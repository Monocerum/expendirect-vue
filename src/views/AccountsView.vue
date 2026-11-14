<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import AccountCard from '@/components/accounts/AccountCard.vue'
import AccountForm from '@/components/accounts/AccountForm.vue'
import AccountSummaryModal from '@/components/accounts/AccountSummaryModal.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import { useAppStore } from '@/stores/app'
import { accountBalance } from '@/utils/finance'

const store = useAppStore()
const { state } = storeToRefs(store)
const search = ref('')
const editing = ref(null)
const entryDraft = ref(null)
const viewing = ref(null)

const accounts = computed(() =>
    state.value.accounts.filter((account) =>
        account.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const handleDelete = (account) => {
    if (window.confirm(`Delete ${account.name} and all its entries?`)) {
        store.removeItem('accounts', account.id)
    }
}
</script>

<template>
    <div class="between">
        <SearchInput v-model="search" placeholder="Search accounts" />
        <button class="btn" @click="editing = {}">Add account</button>
    </div>
    <p v-if="!accounts.length" class="muted">
        No accounts found. Add a bank or a budget like “Travel fund”.
    </p>
    <AccountCard v-for="account in accounts" :key="account.id" :account="account"
        :balance="accountBalance(state, account.id)"
        @add-entry="(type) => (entryDraft = { type, accountId: account.id })" @view="viewing = account"
        @edit="editing = account" @delete="handleDelete(account)" />
    <AccountForm v-if="editing" :account="editing.id ? editing : undefined" @close="editing = null" />
    <TransactionForm v-if="entryDraft" :type="entryDraft.type" :account-id="entryDraft.accountId"
        @close="entryDraft = null" />
    <AccountSummaryModal v-if="viewing" :account="viewing" @close="viewing = null" />
</template>