<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import BarList from '@/components/charts/BarList.vue'
import { BUDGET_BUCKETS } from '@/constants/transactions'
import { useAppStore } from '@/stores/app'
import { MONTHS, parseIsoDate } from '@/utils/date'
import { sumAmounts } from '@/utils/finance'
import { groupByCategory } from '@/utils/transactions'

const MONTHS_SHOWN = 6

function buildMonthlyTotals(expenses, income, now = new Date()) {
    return Array.from({ length: MONTHS_SHOWN }, (_, index) => {
        const month = new Date(now.getFullYear(), now.getMonth() - (MONTHS_SHOWN - 1) + index, 1)
        const inMonth = (item) => {
            const date = parseIsoDate(item.date)
            return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
        }
        return {
            label: `${MONTHS[month.getMonth()].slice(0, 3)} ${month.getFullYear()}`,
            expenses: sumAmounts(expenses.filter(inMonth)),
            income: sumAmounts(income.filter(inMonth)),
        }
    })
}

const { state } = storeToRefs(useAppStore())

const expenses = computed(() => state.value.transactions.filter((item) => item.type === 'expense'))
const income = computed(() => state.value.transactions.filter((item) => item.type === 'income'))
const categories = computed(() => groupByCategory(expenses.value, state.value.categories))
const months = computed(() => buildMonthlyTotals(expenses.value, income.value))
const monthlyMax = computed(() =>
    Math.max(...months.value.flatMap((month) => [month.expenses, month.income]), 0)
)

const categoryRows = computed(() =>
    categories.value.map((group) => ({
        key: group.id,
        label: group.name,
        value: group.total,
        color: group.color,
    }))
)
const bucketRows = computed(() =>
    BUDGET_BUCKETS.map((bucket) => ({
        key: bucket,
        label: bucket,
        value: sumAmounts(expenses.value.filter((item) => item.plan === bucket)),
    }))
)
const monthRows = computed(() =>
    months.value.flatMap((month) => [
        { key: `${month.label}-expenses`, label: `${month.label} expenses`, value: month.expenses },
        {
            key: `${month.label}-income`,
            label: `${month.label} income`,
            value: month.income,
            color: 'var(--secondary)',
        },
    ])
)
</script>

<template>
    <p v-if="!state.transactions.length" class="muted">
        No data yet. Add income or expenses in the tracker to see your demographics.
    </p>
    <div v-else class="grid two">
        <section class="card">
            <h2>Spending by category</h2>
            <BarList :max="categories[0]?.total" :rows="categoryRows" />
        </section>
        <section class="card">
            <h2>Needs vs wants</h2>
            <BarList :max="sumAmounts(expenses)" :rows="bucketRows" />
        </section>
        <section class="card span">
            <h2>Last {{ MONTHS_SHOWN }} months</h2>
            <BarList :max="monthlyMax" :rows="monthRows" />
        </section>
    </div>
</template>