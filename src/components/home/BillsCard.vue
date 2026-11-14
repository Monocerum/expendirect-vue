<script setup>
import StatusPill from '@/components/payments/StatusPill.vue'
import { MONTHS } from '@/utils/date'
import { amountOwed, paymentStatus } from '@/utils/finance'
import { formatMoney } from '@/utils/format'

defineProps({
    area: { type: String, default: '' },
    bills: { type: Array, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
})

const COLUMNS = ['Status', 'Bill', 'Cost', 'Balance', 'Due']
</script>

<template>
    <section :class="['card', area]">
        <small class="lbl">Bills</small>
        <h2>{{ MONTHS[month] }} {{ year }}</h2>
        <div v-if="bills.length" class="table" role="table">
            <b v-for="column in COLUMNS" :key="column" role="columnheader">{{ column }}</b>
            <template v-for="bill in bills" :key="bill.id">
                <StatusPill :status="paymentStatus(bill)" />
                <span>{{ bill.name }}</span>
                <span>PHP {{ formatMoney(bill.amount) }}</span>
                <span>PHP {{ formatMoney(amountOwed(bill)) }}</span>
                <span>{{ bill.due }}</span>
            </template>
        </div>
        <p v-else class="muted">No bills due this month.</p>
        <RouterLink class="link" to="/payments">Update information</RouterLink>
    </section>
</template>