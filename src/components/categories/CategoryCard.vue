<script setup>
import { formatMoney } from '@/utils/format'

defineProps({
    category: { type: Object, required: true },
    typeLabel: { type: String, required: true },
    total: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
})
const emit = defineEmits(['add-entry', 'view', 'edit', 'delete'])
</script>

<template>
    <section :class="['card', 'catcard', { active: isActive }]">
        <small class="lbl">Category</small>
        <h2><i class="dot" :style="{ background: category.color }" /> {{ category.name }}</h2>
        <div class="catctl">
            <span class="pillfield">{{ typeLabel }}</span>
            <button class="btn sq" :aria-label="`Add ${typeLabel.toLowerCase()} to ${category.name}`"
                @click="emit('add-entry')">
                +
            </button>
            <button class="btn sq" :aria-label="`View ${category.name} entries to remove`" @click="emit('view')">
                −
            </button>
        </div>
        <p class="bal"><small>Total</small> <sup>PHP</sup> {{ formatMoney(total) }}</p>
        <div class="actions row-actions center-actions">
            <button class="link" @click="emit('view')">View</button>
            <button class="link" @click="emit('edit')">Edit</button>
            <button class="link" @click="emit('delete')">Delete</button>
        </div>
    </section>
</template>