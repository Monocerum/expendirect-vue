<script setup>
const props = defineProps({
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
})
const model = defineModel({ type: String, default: '' })
</script>

<template>
    <input v-model="model" class="search" type="search" :placeholder="placeholder"
        :aria-label="props.label || placeholder" />
</template>