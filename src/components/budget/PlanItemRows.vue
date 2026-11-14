<script setup>
import { formatMoney } from '@/utils/format'

defineProps({
    rows: { type: Array, required: true },
})
</script>

<template>
    <div v-for="row in rows" :key="row.id" class="plan">
        <span>{{ row.name }} · {{ row.percent }}%</span>
        <div class="bar">
            <div :style="{ width: `${row.width}%`, background: row.color }" />
        </div>
        <small>PHP {{ formatMoney(row.spent) }} of {{ formatMoney(row.budget) }}</small>
    </div>
</template>