<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import CategoryCard from '@/components/categories/CategoryCard.vue'
import CategoryEntriesPanel from '@/components/categories/CategoryEntriesPanel.vue'
import CategoryFilterBar from '@/components/categories/CategoryFilterBar.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TypeToggle from '@/components/common/TypeToggle.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import { CATEGORY_TYPE_OPTIONS } from '@/constants/transactions'
import { useAppStore } from '@/stores/app'
import { sumAmounts } from '@/utils/finance'
import { formatMoney } from '@/utils/format'

const store = useAppStore()
const { state } = storeToRefs(store)
const type = ref('expense')
const search = ref('')
const selectedIds = ref([])
const viewedId = ref(null)
const editing = ref(null)
const entryDraft = ref(null)

const categoriesOfType = computed(() =>
    state.value.categories.filter((category) => category.type === type.value)
)
const viewedCategory = computed(() =>
    categoriesOfType.value.find((category) => category.id === viewedId.value)
)
const activeIds = computed(() =>
    selectedIds.value.filter((id) => categoriesOfType.value.some((category) => category.id === id))
)
const selectedCategories = computed(() =>
    categoriesOfType.value.filter(
        (category) => !activeIds.value.length || activeIds.value.includes(category.id)
    )
)
const visibleCategories = computed(() =>
    selectedCategories.value.filter((category) =>
        category.name.toLowerCase().includes(search.value.trim().toLowerCase())
    )
)

const transactionsOf = (categoryId) =>
    state.value.transactions.filter(
        (item) => item.categoryId === categoryId && item.type === type.value
    )
const total = computed(() =>
    sumAmounts(selectedCategories.value.flatMap((category) => transactionsOf(category.id)))
)
const typeLabel = computed(() => (type.value === 'expense' ? 'Expenditure' : 'Income'))

const changeType = (nextType) => {
    type.value = nextType
    selectedIds.value = []
    viewedId.value = null
}
const toggleSelected = (id) => {
    selectedIds.value = activeIds.value.includes(id)
        ? activeIds.value.filter((other) => other !== id)
        : [...activeIds.value, id]
}
const handleDelete = (category) => {
    if (!window.confirm(`Delete ${category.name}? Its entries become uncategorized.`)) return
    if (viewedId.value === category.id) viewedId.value = null
    store.removeItem('categories', category.id)
}
</script>

<template>
    <div class="between wrap">
        <p class="muted">
            Expenditures and income each have their own categories. Only the ones listed here appear when
            you add an entry.
        </p>
        <button class="btn" @click="editing = {}">Add category</button>
    </div>
    <TypeToggle :model-value="type" :options="CATEGORY_TYPE_OPTIONS" @update:model-value="changeType" />
    <SearchInput v-model="search" placeholder="Search categories" />
    <CategoryFilterBar :categories="categoriesOfType" :selected-ids="activeIds" @toggle="toggleSelected"
        @clear="selectedIds = []" />
    <section class="card totalcard">
        <small class="lbl">
            Total {{ type === 'expense' ? 'expenditures' : 'income' }} ·
            {{ activeIds.length ? `${activeIds.length} selected` : 'all categories' }}
        </small>
        <p class="bal"><sup>PHP</sup> {{ formatMoney(total) }}</p>
    </section>
    <p v-if="!visibleCategories.length" class="muted">No categories found.</p>

    <div :class="['catlayout', { open: viewedCategory }]">
        <div class="catlist">
            <CategoryCard v-for="category in visibleCategories" :key="category.id" :category="category"
                :type-label="typeLabel" :total="sumAmounts(transactionsOf(category.id))"
                :is-active="viewedId === category.id" @add-entry="entryDraft = { type, categoryId: category.id }"
                @view="viewedId = category.id" @edit="editing = category" @delete="handleDelete(category)" />
        </div>
        <CategoryEntriesPanel v-if="viewedCategory" :key="viewedCategory.id" :category="viewedCategory" :type="type"
            :transactions="transactionsOf(viewedCategory.id)" @close="viewedId = null" />
    </div>

    <CategoryForm v-if="editing" :category="editing.id ? editing : undefined" :type="type" @close="editing = null" />
    <TransactionForm v-if="entryDraft" :type="entryDraft.type" :category-id="entryDraft.categoryId"
        @close="entryDraft = null" />
</template>