<script setup>
import { SIDE_NAV_ITEMS } from '@/constants/navigation'
import NavIcon from './NavIcon.vue'

defineProps({
	isOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle', 'open', 'close'])
</script>

<template>
	<aside :class="['side', { open: isOpen }]">
		<button aria-label="Toggle menu" :aria-expanded="isOpen" @click="emit('toggle')">
			<NavIcon name="menu" />
		</button>
		<RouterLink v-for="item in SIDE_NAV_ITEMS" :key="item.to" :to="item.to" :title="item.label">
			<NavIcon :name="item.icon" />
			<span>{{ item.label }}</span>
		</RouterLink>
	</aside>
	<div v-if="isOpen" class="scrim" @click="emit('close')" />
	<button class="burger" aria-label="Open menu" @click="emit('open')">
		<NavIcon name="menu" :size="26" />
	</button>
</template>