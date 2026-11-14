<script setup>
import { computed } from 'vue'

const props = defineProps({
	status: { type: String, required: true },
})
const modifier = computed(() => props.status.split(' ')[0].toLowerCase())
</script>

<template>
	<span :class="['pill', modifier]">{{ status }}</span>
</template>