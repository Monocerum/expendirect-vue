<script setup>
import ColorSwatchPicker from '@/components/common/ColorSwatchPicker.vue'
import { vFocus } from '@/composables/useFocus'

const draft = defineModel({ type: Object, required: true })
const emit = defineEmits(['save', 'cancel'])

const patch = (changes) => (draft.value = { ...draft.value, ...changes })
</script>

<template>
	<div class="minipanel">
		<input v-focus placeholder="Category name" aria-label="New category name" :value="draft.name"
			@input="patch({ name: $event.target.value })" @keydown.enter.prevent="emit('save')" />
		<ColorSwatchPicker :model-value="draft.color" @update:model-value="patch({ color: $event })" />
		<div class="btns">
			<button type="button" class="btn sm" @click="emit('save')">Save category</button>
			<button type="button" class="link" @click="emit('cancel')">Cancel</button>
		</div>
	</div>
</template>