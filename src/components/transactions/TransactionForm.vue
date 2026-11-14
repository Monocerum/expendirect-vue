<script setup>
import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'
import FormRow from '@/components/common/FormRow.vue'
import Modal from '@/components/common/Modal.vue'
import TypeToggle from '@/components/common/TypeToggle.vue'
import { vFocus } from '@/composables/useFocus'
import { BILL_CATEGORY } from '@/constants/categories'
import PlanItemPicker from '@/components/budget/PlanItemPicker.vue'
import { useAppStore } from '@/stores/app'
import { todayIso } from '@/utils/date'
import { amountOwed } from '@/utils/finance'
import { formatMoney } from '@/utils/format'
import CategoryPicker from './CategoryPicker.vue'
import ExcessNotice from './ExcessNotice.vue'
import TagPicker from './TagPicker.vue'

const props = defineProps({
    transaction: { type: Object, default: undefined },
    type: { type: String, default: 'expense' },
    accountId: { type: String, default: '' },
    categoryId: { type: String, default: '' },
    date: { type: String, default: '' },
})
const emit = defineEmits(['close'])

const store = useAppStore()
const { state } = storeToRefs(store)

function createInitialForm() {
    if (props.transaction) {
        const { transaction } = props
        return {
            ...transaction,
            amount: String(transaction.amount),
            tags: [...(transaction.tags ?? [])],
            description: transaction.description ?? '',
            notes: transaction.notes ?? '',
            categoryId: transaction.categoryId ?? '',
            plan: transaction.plan || '',
        }
    }
    return {
        type: props.type,
        billId: '',
        amount: '',
        accountId: props.accountId || state.value.accounts[0]?.id || '',
        date: props.date || todayIso(),
        plan: '',
        categoryId: props.categoryId || '',
        tags: [],
        description: '',
        notes: '',
    }
}

const form = reactive(createInitialForm())
const isExpense = computed(() => form.type === 'expense')

const bills = computed(() =>
    state.value.payments.filter(
        (payment) => amountOwed(payment) > 0 || (form.billId && payment.id === form.billId)
    )
)
const bill = computed(() =>
    form.billId ? state.value.payments.find((payment) => payment.id === form.billId) : undefined
)
const alreadyCounted = computed(() =>
    bill.value && props.transaction?.billId === bill.value.id
        ? Number(props.transaction.applied ?? props.transaction.amount)
        : 0
)
const availableBalance = computed(() =>
    bill.value ? amountOwed(bill.value) + alreadyCounted.value : 0
)
const excess = computed(() =>
    bill.value ? Math.max((Number(form.amount) || 0) - availableBalance.value, 0) : 0
)
const asksAboutExcess = computed(() => excess.value > 0 && Boolean(bill.value?.recurring))

const canSubmit = computed(
    () =>
        Number(form.amount) > 0 &&
        Boolean(form.accountId) &&
        Boolean(form.date) &&
        Boolean(form.description.trim()) &&
        (!isExpense.value || Boolean(form.plan)) &&
        (!asksAboutExcess.value || typeof form.useExcess === 'boolean')
)

const changeType = (nextType) => {
    if (nextType === form.type) return
    Object.assign(form, {
        type: nextType,
        categoryId: '',
        tags: [],
        billId: '',
        plan: '',
        useExcess: null,
    })
}

const changeBill = () => {
    const selected = state.value.payments.find((payment) => payment.id === form.billId)
    if (selected) form.categoryId = BILL_CATEGORY.id
    else if (form.categoryId === BILL_CATEGORY.id) form.categoryId = ''
    if (selected) {
        form.description = form.description || `${selected.name} payment`
        form.amount = form.amount || String(amountOwed(selected))
        form.accountId = selected.accountId
    }
}

const handleSubmit = () => {
    if (!canSubmit.value) return
    const payload = {
        ...form,
        tags: [...form.tags],
        amount: Number(form.amount),
        plan: isExpense.value ? form.plan : '',
        description: form.description.trim(),
        billId: isExpense.value ? form.billId || '' : '',
        useExcess: asksAboutExcess.value && form.useExcess === true,
    }
    if (props.transaction) store.updateTransaction({ ...payload, id: props.transaction.id })
    else store.addTransaction(payload)
    emit('close')
}
</script>

<template>
    <Modal :title="transaction ? 'Edit entry' : undefined" @close="emit('close')">
        <form class="form" @submit.prevent="handleSubmit">
            <TypeToggle :model-value="form.type" align="full" @update:model-value="changeType" />

            <FormRow label="Amount">
                <input v-model="form.amount" v-focus type="number" min="0" step="0.01" required />
            </FormRow>
            <FormRow label="Account">
                <select v-model="form.accountId" required>
                    <option value="">Select account</option>
                    <option v-for="account in state.accounts" :key="account.id" :value="account.id">
                        {{ account.name }}
                    </option>
                </select>
            </FormRow>
            <FormRow label="Date">
                <input v-model="form.date" type="date" required />
            </FormRow>
            <FormRow label="Description">
                <input v-model="form.description" required maxlength="80" placeholder="e.g. Lunch at Jollibee" />
            </FormRow>

            <PlanItemPicker v-if="isExpense" v-model="form.plan" :account-id="form.accountId" />

            <FormRow v-if="isExpense">
                <template #label>Bill payment <em>(optional)</em></template>
                <select v-model="form.billId" :disabled="!bills.length" @change="changeBill">
                    <option value="">
                        {{ bills.length ? 'Not a bill payment' : 'No unpaid bills (add one in Payments)' }}
                    </option>
                    <option v-for="payment in bills" :key="payment.id" :value="payment.id">
                        {{ payment.name }} · due {{ payment.due }} · balance PHP
                        {{ formatMoney(amountOwed(payment)) }}
                    </option>
                </select>
            </FormRow>
            <ExcessNotice v-if="isExpense && excess > 0" v-model="form.useExcess" :excess="excess"
                :balance="availableBalance" :bill-name="bill.name" :is-recurring="asksAboutExcess" />

            <CategoryPicker v-model="form.categoryId" :type="form.type" :locked="Boolean(form.billId)"
                :include-bill="Boolean(bill)" />
            <TagPicker v-model="form.tags" :type="form.type" />

            <FormRow label="Notes (optional)">
                <textarea v-model="form.notes" rows="3" />
            </FormRow>
            <button class="btn" :disabled="!canSubmit">
                {{ transaction ? 'Save changes' : isExpense ? 'Add expense' : 'Add income' }}
            </button>
        </form>
    </Modal>
</template>