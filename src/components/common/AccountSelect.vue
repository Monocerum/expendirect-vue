<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { ALL_ACCOUNTS } from '@/constants/accounts'
import { useAppStore } from '@/stores/app'
import AccountIcon from './AccountIcon.vue'

defineProps({
	includeAll: { type: Boolean, default: false },
})
const model = defineModel({ type: String, default: '' })
const { state } = storeToRefs(useAppStore())
const isOpen = ref(false)
const selected = computed(() =>
	model.value === ALL_ACCOUNTS.id
		? ALL_ACCOUNTS
		: state.value.accounts.find((account) => account.id === model.value)
)

const choose = (accountId) => {
	model.value = accountId
	isOpen.value = false
}
</script>

<template>
	<div class="dd">
		<button type="button" aria-haspopup="listbox" :aria-expanded="isOpen" @click="isOpen = !isOpen">
			<AccountIcon :account="selected" />
			{{ selected?.name || 'Select account' }} ▾
		</button>
		<ul v-if="isOpen" role="listbox">
			<li v-if="includeAll">
				<button type="button" @click="choose(ALL_ACCOUNTS.id)">
					<AccountIcon :account="ALL_ACCOUNTS" />
					{{ ALL_ACCOUNTS.name }}
				</button>
			</li>
			<li v-for="account in state.accounts" :key="account.id">
				<button type="button" @click="choose(account.id)">
					<AccountIcon :account="account" />
					{{ account.name }}
				</button>
			</li>
		</ul>
	</div>
</template>