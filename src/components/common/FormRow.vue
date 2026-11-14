<script setup>
defineProps({
    label: { type: String, default: '' },
})
</script>

<template>
    <label class="row">
        <span>
            <slot name="label">{{ label }}</slot>
        </span>
        <slot />
    </label>
</template>