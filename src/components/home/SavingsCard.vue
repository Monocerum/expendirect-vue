<script setup>
import DateFilter from '@/components/common/DateFilter.vue'
import PlanItemRows from '@/components/budget/PlanItemRows.vue'
import { dateFilterLabel } from '@/utils/date'
import { formatMoney } from '@/utils/format'

defineProps({
	area: { type: String, default: '' },
	saved: { type: Number, default: 0 },
	goal: { type: Number, default: 0 },
	fromPlan: { type: Boolean, default: false },
	plans: { type: Array, default: () => [] },
})
const filter = defineModel('filter', { type: Object, required: true })
</script>

<template>
	<section :class="['card', area]">
		<small class="lbl">Savings</small>
		<h2>{{ dateFilterLabel(filter) }}</h2>
		<DateFilter v-model="filter" />
		<p class="big-num">
			{{ formatMoney(saved) }} <span class="muted">/ {{ formatMoney(goal) }}</span>
		</p>
		<p class="muted">PHP {{ formatMoney(Math.max(goal - saved, 0)) }} to reach goal</p>
		<p v-if="fromPlan" class="muted">Goal based on the savings % in your budget plans.</p>
		<p v-if="!plans.length" class="muted">No budget plan yet</p>
		<template v-for="plan in plans" :key="plan.id">
			<small class="lbl">{{ plan.name }}</small>
			<PlanItemRows :rows="plan.rows" />
		</template>
	</section>
</template>