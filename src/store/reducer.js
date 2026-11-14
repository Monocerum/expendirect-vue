import { createId } from '@/utils/id'
import { ActionTypes } from './actions'
import { createInitialState } from './initialState'
import {
    addTransactionToState,
    removeTransactionFromState,
    updateTransactionInState,
} from './transactionOps'

const ACCOUNT_OWNED = ['transactions', 'plans', 'payments']

function removeItem(state, collection, id) {
    if (collection === 'transactions') return removeTransactionFromState(state, id)
    const next = { ...state, [collection]: state[collection].filter((item) => item.id !== id) }
    if (collection === 'accounts') {
        ACCOUNT_OWNED.forEach((key) => {
            next[key] = state[key].filter((item) => item.accountId !== id)
        })
    }
    return next
}

export function reducer(state, action) {
    switch (action.type) {
        case ActionTypes.ADD_ITEM:
            return {
                ...state,
                [action.collection]: [
                    ...state[action.collection],
                    { ...action.item, id: action.item.id ?? createId() },
                ],
            }
        case ActionTypes.UPDATE_ITEM:
            return {
                ...state,
                [action.collection]: state[action.collection].map((item) =>
                    item.id === action.item.id ? { ...item, ...action.item } : item
                ),
            }
        case ActionTypes.REMOVE_ITEM:
            return removeItem(state, action.collection, action.id)
        case ActionTypes.ADD_TRANSACTION:
            return addTransactionToState(state, action.transaction)
        case ActionTypes.UPDATE_TRANSACTION:
            return updateTransactionInState(state, action.transaction)
        case ActionTypes.MERGE_SECTION:
            return { ...state, [action.section]: { ...state[action.section], ...action.values } }
        case ActionTypes.RESET:
            return createInitialState()
        default:
            return state
    }
}