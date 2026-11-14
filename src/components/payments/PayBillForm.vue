<script setup>
import { computed, ref } from 'vue'
import FormRow from '@/components/common/FormRow.vue'
import Modal from '@/components/common/Modal.vue'
import ExcessNotice from '@/components/transactions/ExcessNotice.vue'
import PlanItemPicker from '@/components/budget/PlanItemPicker.vue'
import { vFocus } from '@/composables/useFocus'
import { useAppStore } from '@/stores/app'
import { todayIso } from '@/utils/date'
import { amountOwed, amountPaid } from '@/utils/finance'
import { formatMoney } from '@/utils/format'

const props = defineProps({
    bill: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const store = useAppStore()
const balance = amountOwed(props.bill)
const amount = ref(balance)
const useExcess = ref(null)
const plan = ref('')

const payment = computed(() => Number(amount.value) || 0)
const excess = computed(() => Math.max(payment.value - balance, 0))
const asksAboutExcess = computed(() => excess.value > 0 && Boolean(props.bill.recurring))
const canPay = computed(
    () =>
        payment.value > 0 &&
        Boolean(plan.value) &&
        (!asksAboutExcess.value || typeof useExcess.value === 'boolean')
)

const handleSubmit = () => {
    if (!canPay.value) return
    store.addTransaction({
        type: 'expense',
        amount: payment.value,
        accountId: props.bill.accountId,
        date: todayIso(),
        plan: plan.value,
        categoryId: '',
        tags: ['bill'],
        billId: props.bill.id,
        useExcess: asksAboutExcess.value && useExcess.value === true,
        description: `${props.bill.name} payment`,
        notes:
            payment.value >= balance
                ? ''
                : `Partial payment, PHP ${formatMoney(balance - payment.value)} remaining`,
    })
    emit('close')
}
</script>

<template>
    <Modal :title="`Pay ${bill.name}`" @close="emit('close')">
        <form class="form" @submit.prevent="handleSubmit">
            <dl class="dl">
                <dt>Total</dt>
                <dd>PHP {{ formatMoney(bill.amount) }}</dd>
                <dt>Already paid</dt>
                <dd>PHP {{ formatMoney(amountPaid(bill)) }}</dd>
                <dt>Balance</dt>
                <dd>PHP {{ formatMoney(balance) }}</dd>
            </dl>
            <FormRow label="Amount to pay">
                <input v-model="amount" v-focus type="number" min="0.01" step="0.01" required />
            </FormRow>
            <PlanItemPicker v-model="plan" :account-id="bill.accountId" />
            <button type="button" class="link" @click="amount = balance">Pay full balance</button>
            <p v-if="payment > 0 && payment < balance" class="muted">
                Partial payment: PHP {{ formatMoney(balance - payment) }} will remain and the status becomes
                Partially Paid.
            </p>
            <ExcessNotice v-if="excess > 0" v-model="useExcess" :excess="excess" :balance="balance"
                :is-recurring="asksAboutExcess" />
            <button class="btn" :disabled="!canPay">Pay PHP {{ formatMoney(payment) }}</button>
        </form>
    </Modal>
</template>