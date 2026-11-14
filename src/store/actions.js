export const ActionTypes = {
    ADD_ITEM: 'item/add',
    UPDATE_ITEM: 'item/update',
    REMOVE_ITEM: 'item/remove',
    ADD_TRANSACTION: 'transaction/add',
    UPDATE_TRANSACTION: 'transaction/update',
    MERGE_SECTION: 'section/merge',
    RESET: 'reset',
}

export const addItem = (collection, item) => ({ type: ActionTypes.ADD_ITEM, collection, item })
export const updateItem = (collection, item) => ({
    type: ActionTypes.UPDATE_ITEM,
    collection,
    item,
})
export const removeItem = (collection, id) => ({ type: ActionTypes.REMOVE_ITEM, collection, id })

export const addTransaction = (transaction) => ({ type: ActionTypes.ADD_TRANSACTION, transaction })
export const updateTransaction = (transaction) => ({
    type: ActionTypes.UPDATE_TRANSACTION,
    transaction,
})

export const mergeInto = (section, values) => ({ type: ActionTypes.MERGE_SECTION, section, values })
export const resetData = () => ({ type: ActionTypes.RESET })