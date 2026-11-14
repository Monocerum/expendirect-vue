<script setup>
import { formatMoney } from '@/utils/format'

defineProps({
    rows: { type: Array, required: true },
    max: { type: Number, default: 0 },
})
</script>

<template>
    <ul class="bars">
        <li v-for="row in rows" :key="row.key">
            <span>{{ row.label }}</span>
            <div class="bar">
                <div :style="{
                    width: `${max ? (row.value / max) * 100 : 0}%`,
                    background: row.color || 'var(--primary)',
                }" />
            </div>
            <b>PHP {{ formatMoney(row.value) }}</b>
        </li>
    </ul>
</template>