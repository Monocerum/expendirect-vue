<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import PayBillForm from '@/components/payments/PayBillForm.vue'
import PaymentCard from '@/components/payments/PaymentCard.vue'
import PaymentForm from '@/components/payments/PaymentForm.vue'
import { PAYMENT_STATUSES } from '@/constants/payments'
import { useAppStore } from '@/stores/app'
import { todayIso } from '@/utils/date'
import { amountOwed, paymentStatus } from '@/utils/finance'
import { formatMoney } from '@/utils/format'

const store = useAppStore()
const { state } = storeToRefs(store)
const editing = ref(null)
const paying = ref(null)
const search = ref('')
const status = ref('')
const dueFrom = ref('')
const dueTo = ref('')

const bills = computed(() =>
    state.value.payments
        .filter(
            (bill) =>
                bill.name.toLowerCase().includes(search.value.toLowerCase()) &&
                (!status.value || paymentStatus(bill) === status.value) &&
                (!dueFrom.value || bill.due >= dueFrom.value) &&
                (!dueTo.value || bill.due <= dueTo.value)
        )
        .sort((a, b) => a.due.localeCompare(b.due))
)

const summaries = computed(() => {
    const unpaid = state.value.payments.filter((bill) => amountOwed(bill) > 0)
    const outstanding = unpaid.reduce((total, bill) => total + amountOwed(bill), 0)
    return [
        { label: 'Upcoming payments', value: unpaid.filter((bill) => bill.due >= todayIso()).length },
        {
            label: 'Paid bills',
            value: state.value.payments.filter((bill) => paymentStatus(bill) === 'Paid').length,
        },
        { label: 'Outstanding balance', value: `PHP ${formatMoney(outstanding)}` },
    ]
})

const handleDelete = (bill) => {
    if (window.confirm('Delete this payment?')) store.removeItem('payments', bill.id)
}
</script>

<template>
    <div class="grid three">
        <section v-for="summary in summaries" :key="summary.label" class="card">
            <small class="lbl">{{ summary.label }}</small>
            <p class="big-num">{{ summary.value }}</p>
        </section>
    </div>

    <div class="between wrap">
        <div class="filters">
            <input v-model="search" type="search" placeholder="Search payments" aria-label="Search" />
            <select v-model="status" aria-label="Status">
                <option value="">All statuses</option>
                <option v-for="option in PAYMENT_STATUSES" :key="option">{{ option }}</option>
            </select>
            <input v-model="dueFrom" type="date" aria-label="Due from" />
            <input v-model="dueTo" type="date" aria-label="Due to" />
        </div>
        <button class="btn" :disabled="!state.accounts.length" @click="editing = {}">
            Add payment
        </button>
    </div>

    <p v-if="!bills.length" class="muted">No payments found.</p>
    <PaymentCard v-for="bill in bills" :key="bill.id" :payment="bill" @pay="paying = bill" @edit="editing = bill"
        @delete="handleDelete(bill)" />

    <PaymentForm v-if="editing" :payment="editing.id ? editing : undefined" @close="editing = null" />
    <PayBillForm v-if="paying" :bill="paying" @close="paying = null" />
</template>