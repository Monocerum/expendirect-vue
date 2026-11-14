import { createId } from '@/utils/id'
import {
    applyBillPayment,
    ensureBillCategory,
    reverseBillPayment,
    withBillCategory,
    withPaymentDetails,
} from './billing'

function settleBillPayment(state, transaction) {
    const result = applyBillPayment(
        state,
        transaction.billId,
        Number(transaction.amount),
        transaction.useExcess
    )
    return { state: result.state, transaction: withPaymentDetails(transaction, result) }
}

export function addTransactionToState(state, input) {
    let transaction = withBillCategory({ ...input, id: input.id ?? createId() })
    let next = ensureBillCategory(state, transaction)
    if (transaction.billId) ({ state: next, transaction } = settleBillPayment(next, transaction))
    return { ...next, transactions: [...next.transactions, transaction] }
}

export function updateTransactionInState(state, changes) {
    const original = state.transactions.find((item) => item.id === changes.id)
    if (!original) return state

    let transaction = withBillCategory({ ...original, ...changes })
    let next = ensureBillCategory(reverseBillPayment(state, original), transaction)
    if (transaction.billId) {
        ; ({ state: next, transaction } = settleBillPayment(next, transaction))
    } else {
        transaction = { ...transaction, applied: 0, excess: 0, credited: 0, nextId: '' }
    }
    return {
        ...next,
        transactions: next.transactions.map((item) =>
            item.id === transaction.id ? transaction : item
        ),
    }
}

export function removeTransactionFromState(state, id) {
    const removed = state.transactions.find((item) => item.id === id)
    const next = { ...state, transactions: state.transactions.filter((item) => item.id !== id) }
    return removed?.billId ? reverseBillPayment(next, removed) : next
}