<script setup>
import { formatMoney } from '@/utils/format'

defineProps({
    area: { type: String, default: '' },
    periodLabel: { type: String, required: true },
    categories: { type: Array, required: true },
})
</script>

<template>
    <section :class="['card', area]">
        <small class="lbl">Top expenses</small>
        <h2>{{ periodLabel }}</h2>
        <ul v-if="categories.length" class="dots">
            <li v-for="category in categories" :key="category.id">
                <i :style="{ background: category.color }" />
                {{ category.name }}
                <b>PHP {{ formatMoney(category.total) }}</b>
            </li>
        </ul>
        <p v-else class="muted">No expenses yet. Add one from the tracker.</p>
        <RouterLink class="link" to="/demographics">See details</RouterLink>
    </section>
</template>
