import { useState } from 'react'
import FormRow from '@/components/common/FormRow'
import Modal from '@/components/common/Modal'
import ExcessNotice from '@/components/transactions/ExcessNotice'
import { useStore } from '@/hooks/useStore'
import { addTransaction } from '@/store/actions'
import { todayIso } from '@/utils/date'
import { amountOwed, amountPaid } from '@/utils/finance'
import { formatMoney } from '@/utils/format'

export default function PayBillForm({ bill, onClose }) {
    const { dispatch } = useStore()
    const balance = amountOwed(bill)
    const [amount, setAmount] = useState(balance)
    const [useExcess, setUseExcess] = useState(null)

    const payment = Number(amount) || 0
    const excess = Math.max(payment - balance, 0)
    const asksAboutExcess = excess > 0 && Boolean(bill.recurring)
    const canPay = payment > 0 && (!asksAboutExcess || typeof useExcess === 'boolean')

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!canPay) return
        dispatch(
            addTransaction({
                type: 'expense',
                amount: payment,
                accountId: bill.accountId,
                date: todayIso(),
                plan: 'needs',
                categoryId: '',
                tags: ['bill'],
                billId: bill.id,
                useExcess: asksAboutExcess && useExcess === true,
                description: `${bill.name} payment`,
                notes:
                    payment >= balance
                        ? ''
                        : `Partial payment, PHP ${formatMoney(balance - payment)} remaining`,
            }),
        )
        onClose()
    }

    return (
        <Modal title={`Pay ${bill.name}`} onClose={onClose}>
            <form className="form" onSubmit={handleSubmit}>
                <dl className="dl">
                    <dt>Total</dt>
                    <dd>PHP {formatMoney(bill.amount)}</dd>
                    <dt>Already paid</dt>
                    <dd>PHP {formatMoney(amountPaid(bill))}</dd>
                    <dt>Balance</dt>
                    <dd>PHP {formatMoney(balance)}</dd>
                </dl>
                <FormRow label="Amount to pay">
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        autoFocus
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                </FormRow>
                <button type="button" className="link" onClick={() => setAmount(balance)}>
                    Pay full balance
                </button>
                {payment > 0 && payment < balance && (
                    <p className="muted">
                        Partial payment: PHP {formatMoney(balance - payment)} will remain and the status becomes
                        Partially Paid.
                    </p>
                )}
                {excess > 0 && (
                    <ExcessNotice
                        excess={excess}
                        balance={balance}
                        isRecurring={asksAboutExcess}
                        useExcess={useExcess}
                        onChange={setUseExcess}
                    />
                )}
                <button className="btn" disabled={!canPay}>
                    Pay PHP {formatMoney(payment)}
                </button>
            </form>
        </Modal>
    )
}