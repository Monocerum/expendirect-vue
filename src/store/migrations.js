import { BILL_CATEGORY, INCOME_PRESETS } from '@/constants/categories'
import { createId } from '@/utils/id'
import { applyBillPayment, withBillCategory, withPaymentDetails } from './billing'
import { SCHEMA_VERSION } from './initialState'

const COLLECTIONS = ['accounts', 'categories', 'tags', 'transactions', 'plans', 'payments']

const renamePaymentFields = ({ freq, custom, ...payment }) => ({
    ...payment,
    frequency: payment.frequency ?? freq,
    customDays: payment.customDays ?? custom,
})

export function renameLegacyKeys(saved) {
    const { txns, ...rest } = saved
    const state = { ...rest }
    if (txns && !state.transactions) state.transactions = txns
    if (state.payments) state.payments = state.payments.map(renamePaymentFields)
    return state
}

const assignMissingIds = (state) => {
    const next = { ...state }
    COLLECTIONS.forEach((key) => {
        next[key] = (state[key] ?? []).map((item) => (item.id ? item : { ...item, id: createId() }))
    })
    return next
}

function splitCategoriesByType(state) {
    const categories = state.categories.map((category) => ({
        ...category,
        type: category.type || 'expense',
    }))
    const incomeCopies = {}
    const transactions = state.transactions.map((transaction) => {
        const category =
            transaction.type === 'income' && categories.find((item) => item.id === transaction.categoryId)
        if (!category) return transaction
        incomeCopies[category.id] ??= { ...category, id: createId(), type: 'income' }
        return { ...transaction, categoryId: incomeCopies[category.id].id }
    })

    let allCategories = [...categories, ...Object.values(incomeCopies)]
    if (!allCategories.some((category) => category.type === 'income')) {
        const defaults = INCOME_PRESETS.slice(0, 3).map((preset) => ({
            id: createId(),
            ...preset,
            type: 'income',
        }))
        allCategories = [...allCategories, ...defaults]
    }

    const tags = state.tags.map((tag) => ({ ...tag, type: tag.type || 'expense' }))
    const incomeTagNames = new Set(
        transactions.filter((item) => item.type === 'income').flatMap((item) => item.tags ?? [])
    )
    incomeTagNames.forEach((name) => {
        const exists = tags.some(
            (tag) => tag.type === 'income' && tag.name.toLowerCase() === name.toLowerCase()
        )
        if (!exists) tags.push({ id: createId(), name, type: 'income' })
    })
    return { ...state, categories: allCategories, transactions, tags }
}

function relinkBillEntries(state) {
    const billIds = new Set(state.payments.map((payment) => payment.id))
    let next = state
    const transactions = state.transactions.map((transaction) => {
        if (!transaction.billId || billIds.has(transaction.billId)) return transaction
        const bill = state.payments.find((payment) =>
            String(transaction.billId).startsWith(`${payment.name} · due ${payment.due}`)
        )
        if (!bill) return { ...transaction, billId: '' }
        const result = applyBillPayment(next, bill.id, Number(transaction.amount), false)
        next = result.state
        return withPaymentDetails({ ...transaction, billId: bill.id }, result)
    })
    return { ...next, transactions }
}

function categorizeBillEntries(state) {
    if (!state.transactions.some((transaction) => transaction.billId)) return state
    const hasBillCategory = state.categories.some((category) => category.id === BILL_CATEGORY.id)
    return {
        ...state,
        categories: hasBillCategory ? state.categories : [...state.categories, BILL_CATEGORY],
        transactions: state.transactions.map(withBillCategory),
    }
}

export function migrate(state) {
    let next = assignMissingIds(state)
    if ((state.schema || 1) < 2) next = splitCategoriesByType(next)
    next = categorizeBillEntries(relinkBillEntries(next))
    return { ...next, schema: SCHEMA_VERSION }
}