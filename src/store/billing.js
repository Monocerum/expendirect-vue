import { BILL_CATEGORY } from '@/constants/categories'
import { nextDueDate } from '@/utils/date'
import { amountOwed, amountPaid } from '@/utils/finance'
import { createId } from '@/utils/id'

const adjustPaid = (payments, billId, delta) =>
    payments.map((payment) =>
        payment.id === billId ? { ...payment, paid: Math.max(0, amountPaid(payment) + delta) } : payment
    )

function createNextOccurrence(bill) {
    const { id, nextId, nextCreated, ...details } = bill
    return {
        ...details,
        id: createId(),
        paid: 0,
        due: nextDueDate(bill.due, bill.frequency, bill.customDays),
    }
}

export function applyBillPayment(state, billId, amount, useExcess) {
    const bill = billId && state.payments.find((payment) => payment.id === billId)
    if (!bill) return { state, applied: 0, excess: 0, credited: 0, nextId: '' }

    const balance = amountOwed(bill)
    const applied = Math.min(amount, balance)
    const excess = Math.max(amount - balance, 0)
    let next = { ...state, payments: adjustPaid(state.payments, billId, applied) }
    let nextId = ''
    let credited = 0

    const completesBill =
        bill.recurring && Number(bill.amount) > 0 && amountPaid(bill) + applied >= Number(bill.amount)
    if (completesBill) {
        let nextBill = next.payments.find((payment) => bill.nextId && payment.id === bill.nextId)
        if (!nextBill && !bill.nextCreated) {
            nextBill = createNextOccurrence(bill)
            const linked = next.payments.map((payment) =>
                payment.id === billId ? { ...payment, nextId: nextBill.id } : payment
            )
            next = { ...next, payments: [...linked, nextBill] }
        }
        if (nextBill) {
            nextId = nextBill.id
            if (useExcess && excess > 0) {
                credited = Math.min(excess, amountOwed(nextBill))
                next = { ...next, payments: adjustPaid(next.payments, nextBill.id, credited) }
            }
        }
    }
    return { state: next, applied, excess, credited, nextId }
}

export function reverseBillPayment(state, transaction) {
    if (!transaction.billId) return state
    const applied = transaction.applied ?? Number(transaction.amount)
    let payments = adjustPaid(state.payments, transaction.billId, -applied)
    if (transaction.credited && transaction.nextId) {
        payments = adjustPaid(payments, transaction.nextId, -transaction.credited)
    }
    return { ...state, payments }
}

export const withPaymentDetails = (transaction, result) => ({
    ...transaction,
    applied: result.applied,
    excess: result.excess,
    credited: result.credited,
    nextId: result.nextId,
})

export const withBillCategory = (transaction) =>
    transaction.billId ? { ...transaction, categoryId: BILL_CATEGORY.id } : transaction

export const ensureBillCategory = (state, transaction) =>
    transaction.billId && !state.categories.some((category) => category.id === BILL_CATEGORY.id)
        ? { ...state, categories: [...state.categories, BILL_CATEGORY] }
        : state