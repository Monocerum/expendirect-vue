<script setup>
defineProps({
    title: { type: String, default: undefined },
})
const emit = defineEmits(['close'])
</script>

<template>
    <Teleport to="body">
        <div class="overlay" @click="emit('close')">
            <div class="modal" role="dialog" aria-modal="true" :aria-label="title" @click.stop>
                <button class="x" aria-label="Close" @click="emit('close')">×</button>
                <h2 v-if="title">{{ title }}</h2>
                <slot />
            </div>
        </div>
    </Teleport>
</template>