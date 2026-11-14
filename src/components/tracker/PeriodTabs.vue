<script setup>
import { TRACKER_PERIODS } from '@/constants/periods'

const model = defineModel({ type: String, required: true })
</script>

<template>
	<div class="periods" role="tablist" aria-label="Period">
		<button v-for="period in TRACKER_PERIODS" :key="period" role="tab" :aria-selected="model === period"
			:class="{ on: model === period }" @click="model = period">
			{{ period }}
		</button>
	</div>
</template>