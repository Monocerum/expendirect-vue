<script setup>
import { TRANSACTION_TYPES } from '@/constants/transactions'

defineProps({
    options: { type: Array, default: () => TRANSACTION_TYPES },
    align: { type: String, default: 'left' },
})
const model = defineModel({ type: String, required: true })
</script>

<template>
    <div :class="align === 'left' ? 'toggle left' : 'toggle'">
        <button v-for="option in options" :key="option.value" type="button" :class="{ on: model === option.value }"
            @click="model = option.value">
            {{ option.label }}
        </button>
    </div>
</template>