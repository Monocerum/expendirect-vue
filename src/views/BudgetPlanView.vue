<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import BudgetPlanCard from '@/components/budget/BudgetPlanCard.vue'
import BudgetPlanForm from '@/components/budget/BudgetPlanForm.vue'
import { ALL_ACCOUNTS } from '@/constants/accounts'
import { useAppStore } from '@/stores/app'
import { transactionsForPlan } from '@/utils/budgetPlan'

const store = useAppStore()
const { state } = storeToRefs(store)
const editing = ref(null)

const canAddPlan = computed(
    () =>
        !state.value.plans.some((plan) => plan.accountId === ALL_ACCOUNTS.id) ||
        state.value.accounts.some(
            (account) => !state.value.plans.some((plan) => plan.accountId === account.id)
        )
)

const planCards = computed(() =>
    state.value.plans
        .map((plan) => ({
            plan,
            account:
                plan.accountId === ALL_ACCOUNTS.id
                    ? { ...ALL_ACCOUNTS, name: 'All accounts (overall)' }
                    : state.value.accounts.find((item) => item.id === plan.accountId),
        }))
        .filter((card) => card.account)
)

const handleDelete = (plan) => {
    if (window.confirm('Delete this plan?')) store.removeItem('plans', plan.id)
}
</script>

<template>
    <div class="between wrap">
        <p class="muted">
            Split each account’s income (or all accounts together) any way you like: needs, wants,
            savings, or your own items such as Travel and Food.
        </p>
        <button class="btn" :disabled="!canAddPlan" @click="editing = {}">Add plan</button>
    </div>
    <p v-if="!state.plans.length" class="muted">No plans yet. Add one for an account.</p>
    <BudgetPlanCard v-for="{ plan, account } in planCards" :key="plan.id" :plan="plan" :account="account"
        :transactions="transactionsForPlan(plan, state.transactions)" @edit="editing = plan"
        @delete="handleDelete(plan)" />
    <BudgetPlanForm v-if="editing" :plan="editing.id ? editing : undefined" @close="editing = null" />
</template>