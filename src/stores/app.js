import { defineStore } from 'pinia'
import { ref, toRaw, watch } from 'vue'
import * as actions from '@/store/actions'
import { loadState, saveState } from '@/store/persistence'
import { reducer } from '@/store/reducer'

export const useAppStore = defineStore('app', () => {
    const state = ref(loadState())

    const dispatch = (action) => {
        state.value = reducer(toRaw(state.value), action)
    }

    watch(state, (value) => saveState(toRaw(value)), { immediate: true })

    return {
        state,
        addItem: (collection, item) => dispatch(actions.addItem(collection, item)),
        updateItem: (collection, item) => dispatch(actions.updateItem(collection, item)),
        removeItem: (collection, id) => dispatch(actions.removeItem(collection, id)),
        addTransaction: (transaction) => dispatch(actions.addTransaction(transaction)),
        updateTransaction: (transaction) => dispatch(actions.updateTransaction(transaction)),
        mergeInto: (section, values) => dispatch(actions.mergeInto(section, values)),
        resetData: () => dispatch(actions.resetData()),
    }
})