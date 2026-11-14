<script setup>
import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'
import ColorSwatchPicker from '@/components/common/ColorSwatchPicker.vue'
import FormRow from '@/components/common/FormRow.vue'
import Modal from '@/components/common/Modal.vue'
import { EXPENSE_PRESETS, INCOME_PRESETS } from '@/constants/categories'
import { useAppStore } from '@/stores/app'

const props = defineProps({
	category: { type: Object, default: undefined },
	type: { type: String, required: true },
})
const emit = defineEmits(['close'])

const store = useAppStore()
const { state } = storeToRefs(store)
const form = reactive(
	props.category ? { ...props.category } : { name: '', color: '#dd6b9a', type: props.type }
)

const presets = computed(() => (props.type === 'income' ? INCOME_PRESETS : EXPENSE_PRESETS))
const isTaken = (name) =>
	state.value.categories.some(
		(item) => item.type === (props.category?.type || props.type) && item.name === name
	)
const availablePresets = computed(() => presets.value.filter((preset) => !isTaken(preset.name)))

const title = computed(() =>
	props.category
		? 'Edit category'
		: `Add ${props.type === 'income' ? 'income' : 'expenditure'} category`
)

const handleSubmit = () => {
	const values = { ...form }
	if (props.category) store.updateItem('categories', values)
	else store.addItem('categories', values)
	emit('close')
}
</script>

<template>
	<Modal :title="title" @close="emit('close')">
		<form class="form" @submit.prevent="handleSubmit">
			<div v-if="!category" class="row start">
				<span>Pick from the list</span>
				<div class="chips">
					<button v-for="preset in availablePresets" :key="preset.name" type="button"
						:class="['chip', { on: form.name === preset.name }]"
						@click="Object.assign(form, { ...preset, type })">
						<i :style="{ background: preset.color }" />
						{{ preset.name }}
					</button>
				</div>
			</div>
			<FormRow label="Name">
				<input v-model="form.name" required />
			</FormRow>
			<div class="row start">
				<span>Color</span>
				<ColorSwatchPicker v-model="form.color" />
			</div>
			<button class="btn">Save category</button>
		</form>
	</Modal>
</template>