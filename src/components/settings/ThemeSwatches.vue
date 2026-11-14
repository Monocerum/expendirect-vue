<script setup>
defineProps({
    colors: { type: Array, required: true },
})
</script>

<template>
    <span class="tsw">
        <i v-for="(color, index) in colors" :key="index" :style="{ background: color }" />
    </span>
</template>