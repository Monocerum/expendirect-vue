<script setup>
import { computed } from 'vue'

const props = defineProps({
	name: { type: String, required: true },
	size: { type: Number, default: 24 },
})

const src = computed(() => `/assets/${props.name.includes('.') ? props.name : `${props.name}.svg`}`)
</script>

<template>
	<img class="ico" :src="src" alt="" :width="size" :height="size" />
</template>