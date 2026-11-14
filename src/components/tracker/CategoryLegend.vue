<script setup>
import { formatMoney } from '@/utils/format'

defineProps({
    groups: { type: Array, required: true },
})
const emit = defineEmits(['view'])
</script>

<template>
    <ul class="legend">
        <li v-for="group in groups" :key="group.id">
            <span class="muted">{{ group.percent }}%</span>
            <i :style="{ background: group.color }" />
            <span>{{ group.name }}</span>
            <b>PHP{{ formatMoney(group.total) }}</b>
            <button class="link" :aria-label="`View ${group.name} entries`" @click="emit('view', group.id)">
                View
            </button>
        </li>
    </ul>
</template>