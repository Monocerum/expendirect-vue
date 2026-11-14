import { ALL_ACCOUNTS } from '@/constants/accounts'
import { todayIso } from './date'

export const sumAmounts = (items) => items.reduce((total, item) => total + Number(item.amount), 0)

export function accountBalance(state, accountId) {
    if (accountId === ALL_ACCOUNTS.id) {
        return state.accounts.reduce((total, account) => total + accountBalance(state, account.id), 0)
    }
    const account = state.accounts.find((item) => item.id === accountId)
    if (!account) return 0
    const net = state.transactions
        .filter((transaction) => transaction.accountId === accountId)
        .reduce((total, transaction) => {
            const sign = transaction.type === 'income' ? 1 : -1
            return total + sign * transaction.amount
        }, 0)
    return Number(account.opening) + net
}

export const amountPaid = (payment) => {
    if (payment.paid != null && payment.paid !== '') return Number(payment.paid)
    return payment.status === 'Paid' ? Number(payment.amount) : 0
}

export const amountOwed = (payment) => Math.max(Number(payment.amount) - amountPaid(payment), 0)

export function paymentStatus(payment) {
    if (amountOwed(payment) === 0 && Number(payment.amount) > 0) return 'Paid'
    if (amountPaid(payment) > 0) return 'Partially Paid'
    return payment.due < todayIso() ? 'Overdue' : 'Unpaid'
}