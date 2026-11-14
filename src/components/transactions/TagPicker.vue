<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps({
    type: { type: String, required: true },
})
const selected = defineModel({ type: Array, default: () => [] })

const store = useAppStore()
const { state } = storeToRefs(store)
const draft = ref('')

const available = computed(() => [
    ...new Set([
        ...state.value.tags.filter((tag) => tag.type === props.type).map((tag) => tag.name),
        ...state.value.transactions
            .filter((transaction) => transaction.type === props.type)
            .flatMap((transaction) => transaction.tags ?? []),
    ]),
])

const toggle = (name) => {
    selected.value = selected.value.includes(name)
        ? selected.value.filter((tag) => tag !== name)
        : [...selected.value, name]
}

const addTag = () => {
    const typed = draft.value.trim()
    if (!typed) return
    const name = available.value.find((tag) => tag.toLowerCase() === typed.toLowerCase()) ?? typed
    if (!available.value.includes(name)) store.addItem('tags', { name, type: props.type })
    if (!selected.value.includes(name)) selected.value = [...selected.value, name]
    draft.value = ''
}
</script>

<template>
    <div class="row start">
        <span>Tags <em>(optional)</em></span>
        <div>
            <div class="chips">
                <button v-for="name in available" :key="name" type="button" :aria-pressed="selected.includes(name)"
                    :class="['tagbtn', { on: selected.includes(name) }]" @click="toggle(name)">
                    {{ name }}
                </button>
            </div>
            <div class="tagadd">
                <input v-model="draft" placeholder="New tag" aria-label="New tag" @keydown.enter.prevent="addTag" />
                <button type="button" class="btn sm" @click="addTag">Add tag</button>
            </div>
        </div>
    </div>
</template>
