<script setup>
import { computed } from 'vue'
import { MONTHS, getYearOptions } from '@/utils/date'

const model = defineModel({ type: Object, required: true })
const years = getYearOptions()

const field = (name) =>
    computed({
        get: () => model.value[name],
        set: (value) => (model.value = { ...model.value, [name]: value }),
    })
const month = field('month')
const year = field('year')
const overall = field('overall')
</script>

<template>
    <div class="filters">
        <select v-model="month" aria-label="Month" :disabled="model.overall">
            <option value="">Month</option>
            <option v-for="(name, index) in MONTHS" :key="name" :value="index + 1">{{ name }}</option>
        </select>
        <select v-model="year" aria-label="Year" :disabled="model.overall">
            <option value="">Year</option>
            <option v-for="option in years" :key="option" :value="option">{{ option }}</option>
        </select>
        <label class="chk">
            <input v-model="overall" type="checkbox" />
            Overall
        </label>
    </div>
</template>