<script setup>
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
})
</script>

<template>
    <section class="hero">
        <h1 :key="title">{{ title }}</h1>
        <div class="subtitle-container">
            <img class="hero-subtitle-design" src="/assets/hero-design.png" alt="Teacup with lines." />
            <p :key="`${title}-subtitle`" class="script">{{ subtitle }}</p>
        </div>
        <slot />
    </section>
</template>