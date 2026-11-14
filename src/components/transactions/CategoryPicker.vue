<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { BILL_CATEGORY, CATEGORY_SWATCHES } from '@/constants/categories'
import { useAppStore } from '@/stores/app'
import { readableTextColor } from '@/utils/color'
import { createId } from '@/utils/id'
import NewCategoryPanel from './NewCategoryPanel.vue'

const props = defineProps({
    type: { type: String, required: true },
    locked: { type: Boolean, default: false },
    includeBill: { type: Boolean, default: false },
})
const selectedId = defineModel({ type: String, default: '' })

const store = useAppStore()
const { state } = storeToRefs(store)
const draft = ref(null)

const visible = computed(() => {
    const ofType = state.value.categories.filter((category) => category.type === props.type)
    const hasBillCategory = state.value.categories.some(
        (category) => category.id === BILL_CATEGORY.id
    )
    return props.includeBill && !hasBillCategory ? [...ofType, BILL_CATEGORY] : ofType
})

const startDraft = () => (draft.value = { name: '', color: CATEGORY_SWATCHES[0] })

const saveDraft = () => {
    const name = draft.value.name.trim()
    if (!name) return
    const id = createId()
    store.addItem('categories', { id, name, color: draft.value.color, type: props.type })
    selectedId.value = id
    draft.value = null
}
</script>

<template>
    <div class="row start">
        <span>Categories <em>(optional)</em></span>
        <div>
            <div class="chips">
                <button v-for="category in visible" :key="category.id" type="button"
                    :aria-pressed="selectedId === category.id" :class="['catchip', { on: selectedId === category.id }]"
                    :style="{ background: category.color, color: readableTextColor(category.color) }" :disabled="locked"
                    @click="selectedId = selectedId === category.id ? '' : category.id">
                    {{ selectedId === category.id ? '✓ ' : '' }}{{ category.name }}
                </button>
                <button v-if="!draft" type="button" class="catchip add" @click="startDraft">
                    + Add category
                </button>
            </div>
            <NewCategoryPanel v-if="draft" v-model="draft" @save="saveDraft" @cancel="draft = null" />
        </div>
    </div>
</template>