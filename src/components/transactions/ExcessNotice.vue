<script setup>
import { formatMoney } from '@/utils/format'

defineProps({
	excess: { type: Number, required: true },
	balance: { type: Number, required: true },
	billName: { type: String, default: '' },
	isRecurring: { type: Boolean, default: false },
})

const useExcess = defineModel({ default: null })
</script>

<template>
	<div class="excess" role="alert">
		<p>
			<b>Excess payment.</b> This is PHP {{ formatMoney(excess) }} more than the remaining balance
			of PHP {{ formatMoney(balance) }}{{ billName ? ` for ${billName}` : '' }}.
		</p>
		<template v-if="isRecurring">
			<p>Use the excess for the next payment?</p>
			<div class="chips">
				<button type="button" :class="['chip', { on: useExcess === true }]" :aria-pressed="useExcess === true"
					@click="useExcess = true">
					Yes, apply it to the next payment
				</button>
				<button type="button" :class="['chip', { on: useExcess === false }]" :aria-pressed="useExcess === false"
					@click="useExcess = false">
					No, keep it as an overpayment
				</button>
			</div>
		</template>
		<p v-else class="muted">
			This bill isn’t recurring, so there is no next payment to credit. Turn on “Recurring” for it
			in Payments to carry excess forward.
		</p>
	</div>
</template>
