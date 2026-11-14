<script setup>
import { computed } from 'vue'
import { THEMES } from '@/theme/themes'
import { contrastWithWhite } from '@/utils/color'
import ThemeSwatches from './ThemeSwatches.vue'

const COLOR_FIELDS = [
    { key: 'primary', label: 'Main color', hint: 'Buttons, headings, sidebar' },
    { key: 'secondary', label: 'Accent color', hint: 'Labels, active tabs, tags' },
    { key: 'light', label: 'Soft color', hint: 'Light tints and highlights' },
]

const props = defineProps({
    settings: { type: Object, required: true },
})
const emit = defineEmits(['change'])

const activeId = computed(() => props.settings.theme || 'sakura')
const colors = computed(() => {
    if (activeId.value === 'custom' && props.settings.custom) return props.settings.custom
    const preset = THEMES.find((theme) => theme.id === activeId.value) ?? THEMES[0]
    return {
        primary: preset.vars['--primary'],
        secondary: preset.vars['--secondary'],
        light: preset.vars['--primary-light'],
    }
})
</script>

<template>
    <section class="card">
        <h2>Color theme</h2>
        <p class="muted">
            Pick a ready-made look, or choose your own three colors. It applies right away.
        </p>
        <div class="themes">
            <button v-for="theme in THEMES" :key="theme.id" :class="['themebtn', { on: activeId === theme.id }]"
                :aria-pressed="activeId === theme.id" @click="emit('change', { theme: theme.id })">
                <ThemeSwatches :colors="[
                    theme.vars['--primary'],
                    theme.vars['--secondary'],
                    theme.vars['--primary-light'],
                ]" />
                {{ theme.name }}
            </button>
            <button :class="['themebtn', { on: activeId === 'custom' }]" :aria-pressed="activeId === 'custom'"
                @click="emit('change', { theme: 'custom', custom: colors })">
                <ThemeSwatches :colors="[colors.primary, colors.secondary, colors.light]" />
                Custom
            </button>
        </div>
        <h3 class="sub">Your colors</h3>
        <div class="picks">
            <label v-for="field in COLOR_FIELDS" :key="field.key" class="pick">
                <input type="color" :value="colors[field.key]" :aria-label="field.label" @input="
                    emit('change', {
                        theme: 'custom',
                        custom: { ...colors, [field.key]: $event.target.value },
                    })
                    " />
                <span>
                    <b>{{ field.label }}</b>
                    <small>{{ field.hint }}</small>
                </span>
            </label>
        </div>
        <p v-if="contrastWithWhite(colors.primary) < 3" class="err" role="status">
            Your main color is quite light, so white text on buttons may be hard to read.
        </p>
    </section>
</template>