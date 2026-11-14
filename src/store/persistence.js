import { createInitialState } from './initialState'
import { migrate, renameLegacyKeys } from './migrations'

export const STORAGE_KEY = 'expendirect:v1'

export function loadState() {
    try {
        const saved = renameLegacyKeys(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {})
        return migrate({ ...createInitialState(), ...saved, schema: saved.schema || 1 })
    } catch {
        return createInitialState()
    }
}

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { }
}