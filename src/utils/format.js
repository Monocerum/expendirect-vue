export const formatMoney = (amount) =>
    (Number(amount) || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })