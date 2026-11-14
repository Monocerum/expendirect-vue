export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const EMPTY_DATE_FILTER = { month: '', year: '', overall: false }

const pad = (value) => String(value).padStart(2, '0')

export const toIsoDate = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const todayIso = () => toIsoDate(new Date())

export const parseIsoDate = (iso) => new Date(`${iso}T00:00`)

export function formatLongDate(iso) {
    const date = parseIsoDate(iso)
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function getYearOptions() {
    const current = new Date().getFullYear()
    return Array.from({ length: 8 }, (_, index) => current - 5 + index)
}

function weekBounds(reference) {
    const start = parseIsoDate(reference)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
}

export function filterByMonthYear(items, { month, year, overall }) {
    if (overall || (!month && !year)) return items
    const targetYear = Number(year) || new Date().getFullYear()
    return items.filter((item) => {
        const date = parseIsoDate(item.date)
        return date.getFullYear() === targetYear && (!month || date.getMonth() + 1 === Number(month))
    })
}

export function dateFilterLabel({ month, year, overall }) {
    if (overall || (!month && !year)) return 'Overall'
    return `${month ? MONTHS[month - 1] : 'All months'} ${year || new Date().getFullYear()}`
}

export function isInPeriod(transaction, { period, reference, to }) {
    if (period === 'overall') return true
    const date = parseIsoDate(transaction.date)
    const anchor = parseIsoDate(reference)
    switch (period) {
        case 'day':
            return transaction.date === reference
        case 'week': {
            const { start, end } = weekBounds(reference)
            return date >= start && date <= end
        }
        case 'month':
            return date.getMonth() === anchor.getMonth() && date.getFullYear() === anchor.getFullYear()
        case 'year':
            return date.getFullYear() === anchor.getFullYear()
        default:
            return transaction.date >= reference && transaction.date <= (to || reference)
    }
}

export function periodLabel(period, reference, to) {
    const anchor = parseIsoDate(reference)
    switch (period) {
        case 'overall':
            return 'Overall'
        case 'day':
            return formatLongDate(reference)
        case 'month':
            return `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`
        case 'year':
            return String(anchor.getFullYear())
        case 'week': {
            const { start, end } = weekBounds(reference)
            return `${formatLongDate(toIsoDate(start))} – ${formatLongDate(toIsoDate(end))}`
        }
        default:
            return `${formatLongDate(reference)} – ${formatLongDate(to || reference)}`
    }
}

export function nextDueDate(due, frequency, customDays) {
    const next = parseIsoDate(due)
    switch (frequency) {
        case 'weekly':
            next.setDate(next.getDate() + 7)
            break
        case 'yearly':
            next.setFullYear(next.getFullYear() + 1)
            break
        case 'custom':
            next.setDate(next.getDate() + (Number(customDays) || 30))
            break
        default:
            next.setMonth(next.getMonth() + 1)
    }
    return toIsoDate(next)
}