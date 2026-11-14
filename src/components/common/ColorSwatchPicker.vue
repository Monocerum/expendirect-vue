<script setup>
import { computed } from 'vue'
import { CATEGORY_SWATCHES } from '@/constants/categories'

const model = defineModel({ type: String, required: true })
const isCustomColor = computed(() => !CATEGORY_SWATCHES.includes(model.value))
</script>

<template>
	<div class="swatches">
		<button v-for="color in CATEGORY_SWATCHES" :key="color" type="button" :aria-label="color"
			:class="['sw', { on: model === color }]" :style="{ background: color }" @click="model = color" />
		<label class="sw picker" title="Custom color" :style="{ borderColor: isCustomColor ? model : undefined }">
			<img src="/assets/eyedropper.svg" alt="" width="16" height="16" />
			<input v-model="model" type="color" aria-label="Custom color" />
		</label>
	</div>
</template>