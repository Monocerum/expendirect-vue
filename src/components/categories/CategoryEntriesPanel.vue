<script setup>
import { computed, onMounted, ref } from 'vue'
import TransactionEntry from '@/components/transactions/TransactionEntry.vue'
import { CATEGORY_VIEW_MODES } from '@/constants/periods'
import { getYearOptions, isInPeriod, periodLabel, todayIso } from '@/utils/date'

const props = defineProps({
	category: { type: Object, required: true },
	type: { type: String, required: true },
	transactions: { type: Array, required: true },
})
const emit = defineEmits(['close'])

const today = todayIso()
const mode = ref('day')
const day = ref(today)
const month = ref(today.slice(0, 7))
const year = ref(today.slice(0, 4))
const panel = ref(null)
const years = getYearOptions()

onMounted(() => panel.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))

const reference = computed(
	() =>
		({ day: day.value, month: `${month.value}-01`, year: `${year.value}-01-01`, overall: today })[
		mode.value
		]
)
const visible = computed(() =>
	props.transactions.filter((item) =>
		isInPeriod(item, { period: mode.value, reference: reference.value })
	)
)

const setMonth = (event) => event.target.value && (month.value = event.target.value)
</script>

<template>
	<aside ref="panel" class="card catpanel" :aria-label="`${category.name} entries`">
		<div class="between">
			<div class="chips">
				<button v-for="option in CATEGORY_VIEW_MODES" :key="option" :class="['chip', { on: mode === option }]"
					:aria-pressed="mode === option" @click="mode = option">
					{{ option }}
				</button>
			</div>
			<button class="link" @click="emit('close')">Close</button>
		</div>
		<div class="filters">
			<input v-if="mode === 'day'" v-model="day" type="date" aria-label="Day" />
			<input v-if="mode === 'month'" type="month" aria-label="Month" :value="month" @input="setMonth" />
			<select v-if="mode === 'year'" v-model="year" aria-label="Year">
				<option v-for="option in years" :key="option" :value="String(option)">{{ option }}</option>
			</select>
		</div>
		<small class="lbl">{{ periodLabel(mode, reference) }}</small>
		<h2>{{ category.name }}</h2>
		<template v-if="visible.length">
			<TransactionEntry v-for="item in visible" :key="item.id" :transaction="item" :color="category.color"
				:name="category.name" />
		</template>
		<p v-else class="muted">
			No {{ type === 'income' ? 'income' : 'expenditures' }} for this period.
		</p>
	</aside>
</template>