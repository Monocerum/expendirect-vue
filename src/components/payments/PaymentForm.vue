<script setup>
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import FormRow from '@/components/common/FormRow.vue'
import Modal from '@/components/common/Modal.vue'
import { BILL_SUGGESTIONS, PAYMENT_FREQUENCIES } from '@/constants/payments'
import { useAppStore } from '@/stores/app'
import { todayIso } from '@/utils/date'
import { amountPaid } from '@/utils/finance'

const props = defineProps({
    payment: { type: Object, default: undefined },
})
const emit = defineEmits(['close'])

const store = useAppStore()
const { state } = storeToRefs(store)

const form = reactive(
    props.payment
        ? { ...props.payment, paid: amountPaid(props.payment) }
        : {
            name: '',
            amount: '',
            paid: '',
            accountId: state.value.accounts[0]?.id || '',
            due: todayIso(),
            recurring: false,
            frequency: 'monthly',
            customDays: 30,
        }
)

const handleSubmit = () => {
    const amount = Number(form.amount)
    const values = { ...form, amount, paid: Math.min(Number(form.paid) || 0, amount) }
    if (props.payment) store.updateItem('payments', values)
    else store.addItem('payments', values)
    emit('close')
}
</script>

<template>
    <Modal :title="payment ? 'Edit payment' : 'Add payment'" @close="emit('close')">
        <form class="form" @submit.prevent="handleSubmit">
            <FormRow label="Bill name or type">
                <input v-model="form.name" required list="bill-suggestions" />
            </FormRow>
            <datalist id="bill-suggestions">
                <option v-for="name in BILL_SUGGESTIONS" :key="name">{{ name }}</option>
            </datalist>
            <FormRow label="Amount">
                <input v-model="form.amount" type="number" min="0" step="0.01" required />
            </FormRow>
            <FormRow label="Already paid">
                <input v-model="form.paid" type="number" min="0" :max="form.amount || undefined" step="0.01"
                    placeholder="0" />
            </FormRow>
            <FormRow label="Account">
                <select v-model="form.accountId" required>
                    <option v-for="account in state.accounts" :key="account.id" :value="account.id">
                        {{ account.name }}
                    </option>
                </select>
            </FormRow>
            <FormRow label="Due date">
                <input v-model="form.due" type="date" required />
            </FormRow>
            <FormRow label="Recurring">
                <input v-model="form.recurring" type="checkbox" />
            </FormRow>
            <FormRow v-if="form.recurring" label="Frequency">
                <select v-model="form.frequency">
                    <option v-for="frequency in PAYMENT_FREQUENCIES" :key="frequency">{{ frequency }}</option>
                </select>
            </FormRow>
            <FormRow v-if="form.recurring && form.frequency === 'custom'" label="Every (days)">
                <input v-model="form.customDays" type="number" min="1" />
            </FormRow>
            <button class="btn">Save payment</button>
        </form>
    </Modal>
</template>