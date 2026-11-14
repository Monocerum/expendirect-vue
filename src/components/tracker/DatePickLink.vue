<script setup>
defineProps({
    label: { type: String, required: true },
    min: { type: String, default: undefined },
})
const model = defineModel({ type: String, required: true })

const openPicker = (event) => event.target.showPicker?.()
</script>

<template>
    <label class="link datepick">
        {{ label }}
        <input v-model="model" type="date" :min="min" @click="openPicker" />
    </label>
</template>