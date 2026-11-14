import { EXPENSE_PRESETS, INCOME_PRESETS } from '@/constants/categories'
import { DEFAULT_THEME_ID } from '@/theme/themes'

export const SCHEMA_VERSION = 3

export function createInitialState() {
    return {
        accounts: [{ id: 'bpi', name: 'BPI', icon: '', opening: 0 }],
        categories: [
            ...EXPENSE_PRESETS.slice(0, 3).map((preset, index) => ({
                id: `c${index}`,
                ...preset,
                type: 'expense',
            })),
            ...INCOME_PRESETS.slice(0, 3).map((preset, index) => ({
                id: `i${index}`,
                ...preset,
                type: 'income',
            })),
        ],
        tags: [
            { id: 't1', name: 'Food', type: 'expense' },
            { id: 't2', name: 'Snacks', type: 'expense' },
        ],
        transactions: [],
        plans: [],
        payments: [],
        profile: { name: '', email: '', avatar: '' },
        settings: { goal: 5000, goalSource: 'fixed', theme: DEFAULT_THEME_ID },
        schema: SCHEMA_VERSION,
    }
}