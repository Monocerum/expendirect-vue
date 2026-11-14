<script setup>
import { watchEffect } from 'vue'

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
})

function setHeadTag(selector, attributes, value) {
    let element = document.head.querySelector(selector)
    if (!element) {
        element = document.createElement('meta')
        Object.entries(attributes).forEach(([name, attr]) => element.setAttribute(name, attr))
        document.head.appendChild(element)
    }
    element.setAttribute('content', value)
}

watchEffect(() => {
    document.title = props.title
    setHeadTag('meta[name="description"]', { name: 'description' }, props.description)
    setHeadTag('meta[property="og:title"]', { property: 'og:title' }, props.title)
    setHeadTag('meta[property="og:description"]', { property: 'og:description' }, props.description)
})
</script>

<template>
    <span v-if="false" />
</template>