<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import FormRow from '@/components/common/FormRow.vue'
import Modal from '@/components/common/Modal.vue'
import { ALL_ACCOUNTS } from '@/constants/accounts'
import { useAppStore } from '@/stores/app'
import { createBlankPlanItem, createStandardPlanItems, getPlanItems } from '@/utils/budgetPlan'

const props = defineProps({
    plan: { type: Object, default: undefined },
})
const emit = defineEmits(['close'])

const isEvenSplit = (total) => Math.abs(total - 100) < 0.001

const store = useAppStore()
const { state } = storeToRefs(store)

const takenIds = new Set(state.value.plans.map((item) => item.accountId))
const availableAccounts = [...state.value.accounts, ALL_ACCOUNTS].filter(
    (account) => props.plan || !takenIds.has(account.id)
)
const expenseCategories = computed(() =>
    state.value.categories.filter((category) => category.type === 'expense')
)

const accountId = ref(props.plan?.accountId ?? availableAccounts[0]?.id ?? '')
const items = ref(
    props.plan
        ? getPlanItems(props.plan).map((item) => ({
            ...item,
            categoryIds: [...(item.categoryIds ?? [])],
        }))
        : createStandardPlanItems()
)

const total = computed(() =>
    items.value.reduce((sum, item) => sum + (Number(item.percent) || 0), 0)
)
const remaining = computed(() => +(100 - total.value).toFixed(2))
const canSave = computed(
    () =>
        Boolean(accountId.value) &&
        items.value.length > 0 &&
        isEvenSplit(total.value) &&
        items.value.every((item) => item.name.trim())
)

const toggleCategory = (item, categoryId) => {
    item.categoryIds = item.categoryIds.includes(categoryId)
        ? item.categoryIds.filter((id) => id !== categoryId)
        : [...item.categoryIds, categoryId]
}
const removeItem = (id) => (items.value = items.value.filter((other) => other.id !== id))

const handleSubmit = () => {
    if (!canSave.value) return
    const cleaned = items.value.map((item) => ({
        ...item,
        name: item.name.trim(),
        percent: Number(item.percent) || 0,
    }))
    if (props.plan)
        store.updateItem('plans', { id: props.plan.id, accountId: accountId.value, items: cleaned })
    else store.addItem('plans', { accountId: accountId.value, items: cleaned })
    emit('close')
}
</script>

<template>
    <Modal :title="plan ? 'Edit plan' : 'Add plan'" @close="emit('close')">
        <form class="form" @submit.prevent="handleSubmit">
            <FormRow label="Account">
                <select v-model="accountId" :disabled="Boolean(plan)">
                    <option v-for="account in availableAccounts" :key="account.id" :value="account.id">
                        {{ account.id === ALL_ACCOUNTS.id ? 'All accounts (overall)' : account.name }}
                    </option>
                </select>
            </FormRow>
            <div class="chips">
                <button type="button" class="chip" @click="items = createStandardPlanItems()">
                    Needs · Wants · Savings
                </button>
                <button type="button" class="chip" @click="items = [createBlankPlanItem()]">
                    Custom split
                </button>
            </div>
            <div v-for="item in items" :key="item.id" class="planrow">
                <input v-model="item.name" aria-label="Name" placeholder="e.g. Travel, Food" />
                <input v-model="item.percent" type="number" aria-label="Percent" min="0" max="100" step="0.1" />
                <span>%</span>
                <button type="button" class="link" :aria-label="`Remove ${item.name || 'item'}`"
                    @click="removeItem(item.id)">
                    Remove
                </button>
                <small v-if="item.key" class="muted">
                    {{
                        item.key === 'savings'
                            ? 'Counts the income left after expenses.'
                            : `Counts expenses marked “${item.key}”.`
                    }}
                </small>
                <div v-else class="linkcats">
                    <small>Counts expenses assigned to it, and spending from:</small>
                    <button v-for="category in expenseCategories" :key="category.id" type="button"
                        :class="['tagbtn', { on: item.categoryIds.includes(category.id) }]"
                        :aria-pressed="item.categoryIds.includes(category.id)"
                        @click="toggleCategory(item, category.id)">
                        {{ category.name }}
                    </button>
                </div>
            </div>
            <button type="button" class="btn sm" @click="items = [...items, createBlankPlanItem()]">
                + Add item
            </button>
            <p :class="isEvenSplit(total) ? 'muted' : 'err'">
                Total: {{ +total.toFixed(2) }}%
                {{
                    !isEvenSplit(total)
                        ? `— ${remaining > 0 ? `${remaining}% left to assign` : `${-remaining}% over`}`
                        : ''
                }}
            </p>
            <button class="btn" :disabled="!canSave">Save plan</button>
        </form>
    </Modal>
</template>