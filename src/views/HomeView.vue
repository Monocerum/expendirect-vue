<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import BillsCard from '@/components/home/BillsCard.vue'
import SavingsCard from '@/components/home/SavingsCard.vue'
import TopExpensesCard from '@/components/home/TopExpensesCard.vue'
import TotalCard from '@/components/home/TotalCard.vue'
import { useAppStore } from '@/stores/app'
import { ALL_ACCOUNTS } from '@/constants/accounts'
import { buildPlanRows, planSavingsSummary, transactionsForPlan } from '@/utils/budgetPlan'
import { EMPTY_DATE_FILTER, dateFilterLabel, filterByMonthYear, parseIsoDate } from '@/utils/date'
import { sumAmounts } from '@/utils/finance'
import { groupByCategory } from '@/utils/transactions'

const { state } = storeToRefs(useAppStore())
const now = new Date()
const expenseFilter = ref({ ...EMPTY_DATE_FILTER })
const incomeFilter = ref({ ...EMPTY_DATE_FILTER })
const savingsFilter = ref({ month: now.getMonth() + 1, year: now.getFullYear(), overall: false })

const expenses = computed(() => state.value.transactions.filter((item) => item.type === 'expense'))
const income = computed(() => state.value.transactions.filter((item) => item.type === 'income'))
const shownExpenses = computed(() => filterByMonthYear(expenses.value, expenseFilter.value))
const topCategories = computed(() =>
    groupByCategory(shownExpenses.value, state.value.categories).slice(0, 3)
)
const totalIncome = computed(() => sumAmounts(filterByMonthYear(income.value, incomeFilter.value)))

const planSummary = computed(() =>
    state.value.settings.goalSource === 'plan'
        ? planSavingsSummary(
            state.value.plans,
            state.value.accounts,
            state.value.transactions,
            savingsFilter.value
        )
        : null
)
const saved = computed(
    () =>
        planSummary.value?.saved ??
        sumAmounts(filterByMonthYear(income.value, savingsFilter.value)) -
        sumAmounts(filterByMonthYear(expenses.value, savingsFilter.value))
)

const planCards = computed(() =>
    state.value.plans
        .map((plan) => {
            const account =
                plan.accountId === ALL_ACCOUNTS.id
                    ? { name: 'All accounts' }
                    : state.value.accounts.find((item) => item.id === plan.accountId)
            if (!account) return null
            const inPeriod = filterByMonthYear(
                transactionsForPlan(plan, state.value.transactions),
                savingsFilter.value
            )
            return { id: plan.id, name: account.name, rows: buildPlanRows(plan, inPeriod) }
        })
        .filter(Boolean)
)
const goal = computed(() => planSummary.value?.goal ?? (Number(state.value.settings.goal) || 0))
const billsThisMonth = computed(() =>
    state.value.payments.filter((bill) => {
        const due = parseIsoDate(bill.due)
        return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear()
    })
)
</script>

<template>
    <div class="grid home">
        <TotalCard v-model:filter="expenseFilter" area="a" label="Total expenses" :amount="sumAmounts(shownExpenses)"
            link-to="/tracker?type=expense" link-label="See expenses" />
        <TopExpensesCard area="b" :period-label="dateFilterLabel(expenseFilter)" :categories="topCategories" />
        <TotalCard v-model:filter="incomeFilter" area="c" label="Total income" :amount="totalIncome"
            link-to="/tracker?type=income" link-label="See income" />
        <SavingsCard v-model:filter="savingsFilter" area="d" :saved="saved" :goal="goal"
            :from-plan="Boolean(planSummary)" :plans="planCards" />
        <BillsCard area="e" :bills="billsThisMonth" :month="now.getMonth()" :year="now.getFullYear()" />
        <RouterLink to="/demographics" class="btn big">See demographics</RouterLink>
    </div>
</template>