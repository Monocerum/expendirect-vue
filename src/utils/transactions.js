import { UNCATEGORIZED } from '@/constants/categories'
import { sumAmounts } from './finance'

export function groupByCategory(transactions, categories) {
    const groups = new Map()
    for (const transaction of transactions) {
        const category = categories.find((item) => item.id === transaction.categoryId)
        const key = category ? category.id : UNCATEGORIZED.id
        if (!groups.has(key)) {
            groups.set(key, {
                id: key,
                name: category?.name ?? UNCATEGORIZED.name,
                color: category?.color ?? UNCATEGORIZED.color,
                total: 0,
                items: [],
            })
        }
        const group = groups.get(key)
        group.total += Number(transaction.amount)
        group.items.push(transaction)
    }
    const grandTotal = sumAmounts(transactions) || 1
    return [...groups.values()]
        .map((group) => ({ ...group, percent: Math.round((group.total / grandTotal) * 100) }))
        .sort((a, b) => b.total - a.total)
}

export function matchesSearch(transaction, query, categories) {
    const text = query.trim().toLowerCase()
    if (!text) return true
    const category = categories.find((item) => item.id === transaction.categoryId)
    const fields = [
        category?.name,
        transaction.description,
        transaction.notes,
        ...(transaction.tags ?? []),
    ]
    return fields.some((field) => field?.toLowerCase().includes(text))
}