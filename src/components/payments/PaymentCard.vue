<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { todayIso } from '@/utils/date'
import { amountOwed, amountPaid, paymentStatus } from '@/utils/finance'
import { formatMoney } from '@/utils/format'
import StatusPill from './StatusPill.vue'

const props = defineProps({
    payment: { type: Object, required: true },
})
const emit = defineEmits(['pay', 'edit', 'delete'])

const { state } = storeToRefs(useAppStore())

const balance = computed(() => amountOwed(props.payment))
const isOverdue = computed(() => balance.value > 0 && props.payment.due < todayIso())
const accountName = computed(
    () => state.value.accounts.find((account) => account.id === props.payment.accountId)?.name
)
const paymentsMade = computed(() =>
    state.value.transactions
        .filter((item) => item.billId && item.billId === props.payment.id)
        .sort((a, b) => b.date.localeCompare(a.date))
)
const creditsReceived = computed(() =>
    state.value.transactions.filter((item) => item.nextId === props.payment.id && item.credited > 0)
)
const historyCount = computed(() => paymentsMade.value.length + creditsReceived.value.length)
const billName = (id) =>
    state.value.payments.find((bill) => bill.id === id)?.name || 'previous bill'
</script>

<template>
    <section class="card pay">
        <StatusPill :status="paymentStatus(payment)" />
        <div>
            <b>{{ payment.name }}</b>
            <small>
                {{ accountName }} · due {{ payment.due }}
                <template v-if="payment.recurring"> · {{ payment.frequency }}</template>
                <em v-if="isOverdue" class="late"> · overdue</em>
            </small>
        </div>
        <div>
            PHP {{ formatMoney(payment.amount) }}
            <small>
                <template v-if="amountPaid(payment) > 0">
                    Paid PHP {{ formatMoney(amountPaid(payment)) }} ·
                </template>
                Balance PHP {{ formatMoney(balance) }}
            </small>
        </div>
        <div class="actions row-actions">
            <button v-if="balance > 0" class="link" @click="emit('pay')">Pay</button>
            <button class="link" @click="emit('edit')">Edit</button>
            <button class="link" @click="emit('delete')">Delete</button>
        </div>
        <details v-if="historyCount > 0" class="hist">
            <summary>Payments made ({{ historyCount }})</summary>
            <ul>
                <li v-for="item in creditsReceived" :key="`credit-${item.id}`" class="credit">
                    <span>{{ item.date }}</span>
                    <span>Excess carried over from {{ billName(item.billId) }}</span>
                    <b>PHP {{ formatMoney(item.credited) }}</b>
                </li>
                <li v-for="item in paymentsMade" :key="item.id">
                    <span>{{ item.date }}</span>
                    <span>{{ item.description }}</span>
                    <b>PHP {{ formatMoney(item.amount) }}</b>
                </li>
            </ul>
        </details>
    </section>
</template>