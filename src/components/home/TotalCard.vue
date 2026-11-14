<script setup>
import DateFilter from '@/components/common/DateFilter.vue'
import { dateFilterLabel } from '@/utils/date'
import { formatMoney } from '@/utils/format'

defineProps({
	area: { type: String, default: '' },
	label: { type: String, required: true },
	amount: { type: Number, default: 0 },
	linkTo: { type: String, required: true },
	linkLabel: { type: String, required: true },
})
const filter = defineModel('filter', { type: Object, required: true })
</script>

<template>
	<section :class="['card', area]">
		<small class="lbl">{{ label }}</small>
		<h2>{{ dateFilterLabel(filter) }}</h2>
		<DateFilter v-model="filter" />
		<p class="big-num"><sup>PHP</sup> {{ formatMoney(amount) }}</p>
		<RouterLink class="btn cta" :to="linkTo">{{ linkLabel }}</RouterLink>
	</section>
</template>