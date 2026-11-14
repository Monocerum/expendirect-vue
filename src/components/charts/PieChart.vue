<script setup>
import { computed } from 'vue'

const RADIUS = 100
const CENTER = 110
const SLICE_OFFSET = 8

const props = defineProps({
    groups: { type: Array, required: true },
    total: { type: Number, default: 0 },
})

const pointAt = (angle) => [CENTER + RADIUS * Math.cos(angle), CENTER + RADIUS * Math.sin(angle)]

const slices = computed(() => {
    let startAngle = -Math.PI / 2
    return props.groups.map((group) => {
        const sweep = (group.total / props.total) * 2 * Math.PI
        const endAngle = startAngle + sweep
        const middle = (startAngle + endAngle) / 2
        const [x1, y1] = pointAt(startAngle)
        const [x2, y2] = pointAt(endAngle)
        const slice = {
            id: group.id,
            color: group.color,
            transform: `translate(${SLICE_OFFSET * Math.cos(middle)} ${SLICE_OFFSET * Math.sin(middle)})`,
            path: `M${CENTER} ${CENTER}L${x1} ${y1}A${RADIUS} ${RADIUS} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2}Z`,
        }
        startAngle = endAngle
        return slice
    })
})
</script>

<template>
    <svg viewBox="0 0 220 220" class="pie" role="img"
        :aria-label="groups.length ? 'Spending by category' : 'No data yet'">
        <circle v-if="groups.length === 0" :cx="CENTER" :cy="CENTER" :r="RADIUS" fill="#eee" />
        <circle v-else-if="groups.length === 1" :cx="CENTER" :cy="CENTER" :r="RADIUS" :fill="groups[0].color" />
        <template v-else>
            <path v-for="slice in slices" :key="slice.id" :d="slice.path" :fill="slice.color" stroke="#fff"
                stroke-width="2" :transform="slice.transform" />
        </template>
    </svg>
</template>