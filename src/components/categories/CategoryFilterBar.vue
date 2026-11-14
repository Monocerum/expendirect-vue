<script setup>
import { computed } from 'vue'

const props = defineProps({
	categories: { type: Array, required: true },
	selectedIds: { type: Array, required: true },
})
const emit = defineEmits(['toggle', 'clear'])

const showingAll = computed(() => props.selectedIds.length === 0)
</script>

<template>
	<div class="catfilter" role="group" aria-label="Filter categories">
		<button :class="{ on: showingAll }" :aria-pressed="showingAll" @click="emit('clear')">
			All
		</button>
		<button v-for="category in categories" :key="category.id" :class="{ on: selectedIds.includes(category.id) }"
			:aria-pressed="selectedIds.includes(category.id)" @click="emit('toggle', category.id)">
			{{ category.name }}
		</button>
	</div>
</template>