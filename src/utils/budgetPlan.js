import { ALL_ACCOUNTS } from '@/constants/accounts'
import { createId } from './id'
import { filterByMonthYear } from './date'
import { sumAmounts } from './finance'

export const PLAN_COLORS = [
    'var(--primary)',
    'var(--secondary)',
    'var(--primary-soft)',
    '#ffc46b',
    '#6bb5ff',
    '#8e7cc3',
    '#58b09c',
    '#f2a65a',
]

export const createStandardPlanItems = () =>
    [
        { key: 'needs', name: 'Needs', percent: 50 },
        { key: 'wants', name: 'Wants', percent: 30 },
        { key: 'savings', name: 'Savings', percent: 20 },
    ].map((item) => ({ id: createId(), categoryIds: [], ...item }))

export const createBlankPlanItem = () => ({ id: createId(), name: '', percent: 0, categoryIds: [] })

export const getPlanItems = (plan) =>
    plan.items ?? [
        { id: 'needs', key: 'needs', name: 'Needs', percent: plan.needs },
        { id: 'wants', key: 'wants', name: 'Wants', percent: plan.wants },
        { id: 'savings', key: 'savings', name: 'Savings', percent: plan.savings },
    ]

const isStandardKey = (key) => key === 'needs' || key === 'wants' || key === 'savings'

export const planItemValue = (item) => item.key || item.id

export function spentForPlanItem(item, expenses, income) {
    if (item.key === 'savings') return Math.max(income - sumAmounts(expenses), 0)
    if (item.key) return sumAmounts(expenses.filter((expense) => expense.plan === item.key))
    return sumAmounts(
        expenses.filter(
            (expense) => expense.plan === item.id || item.categoryIds?.includes(expense.categoryId)
        )
    )
}

export const findPlanFor = (plans, accountId) =>
    plans.find((plan) => plan.accountId === accountId) ??
    plans.find((plan) => plan.accountId === ALL_ACCOUNTS.id)

export function planItemOptions(plans, accountId) {
    const plan = findPlanFor(plans, accountId)
    if (!plan) {
        return ['needs', 'wants'].map((key) => ({
            value: key,
            label: key,
            key,
        }))
    }
    return getPlanItems(plan)
        .filter((item) => item.key !== 'savings')
        .map((item) => ({ value: planItemValue(item), label: item.name, key: item.key }))
}

export function planItemLabel(plans, value) {
    if (!value || isStandardKey(value)) return value
    for (const plan of plans) {
        const item = getPlanItems(plan).find((other) => other.id === value)
        if (item) return item.name
    }
    return value
}

export function buildPlanRows(plan, transactions) {
    const income = sumAmounts(transactions.filter((item) => item.type === 'income'))
    const expenses = transactions.filter((item) => item.type === 'expense')
    return getPlanItems(plan).map((item, index) => {
        const budget = (income * item.percent) / 100
        const spent = spentForPlanItem(item, expenses, income)
        const isOver = item.key !== 'savings' && budget > 0 && spent > budget
        return {
            id: item.id,
            name: item.name,
            percent: item.percent,
            budget,
            spent,
            width: budget ? Math.min((spent / budget) * 100, 100) : 0,
            color: isOver ? '#d32f2f' : PLAN_COLORS[index % PLAN_COLORS.length],
        }
    })
}

export const hasUnlinkedItem = (plan) =>
    getPlanItems(plan).some((item) => !item.key && !item.categoryIds?.length)

export const savingsPercent = (plan) =>
    getPlanItems(plan)
        .filter((item) => item.key === 'savings')
        .reduce((total, item) => total + (Number(item.percent) || 0), 0)

export const transactionsForPlan = (plan, transactions) =>
    plan.accountId === ALL_ACCOUNTS.id
        ? transactions
        : transactions.filter((item) => item.accountId === plan.accountId)

export function planSavingsSummary(plans, accounts, transactions, filter) {
    const withSavings = plans.filter(
        (plan) =>
            savingsPercent(plan) > 0 &&
            (plan.accountId === ALL_ACCOUNTS.id || accounts.some((a) => a.id === plan.accountId))
    )
    const overall = withSavings.find((plan) => plan.accountId === ALL_ACCOUNTS.id)
    const used = overall ? [overall] : withSavings
    if (!used.length) return null
    let goal = 0
    let saved = 0
    for (const plan of used) {
        const items = filterByMonthYear(transactionsForPlan(plan, transactions), filter)
        const income = sumAmounts(items.filter((item) => item.type === 'income'))
        const expenses = sumAmounts(items.filter((item) => item.type === 'expense'))
        goal += (income * savingsPercent(plan)) / 100
        saved += income - expenses
    }
    return { goal, saved, accounts: used.length }
}