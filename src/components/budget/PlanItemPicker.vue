<script setup>
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { findPlanFor, planItemOptions } from '@/utils/budgetPlan'

const props = defineProps({
    accountId: { type: String, default: '' },
})
const model = defineModel({ type: String, default: '' })

const { state } = storeToRefs(useAppStore())
const options = computed(() => planItemOptions(state.value.plans, props.accountId))
const hasPlan = computed(() => Boolean(findPlanFor(state.value.plans, props.accountId)))

watch(options, (list) => {
    if (model.value && !list.some((option) => option.value === model.value)) model.value = ''
})
</script>

<template>
    <div class="row start">
        <span>Budget plan</span>
        <div>
            <div class="chips" role="group" aria-label="Budget plan item">
                <button v-for="option in options" :key="option.value" type="button"
                    :aria-pressed="model === option.value" :class="['chip', option.key, { on: model === option.value }]"
                    @click="model = option.value">
                    <i />
                    {{ option.label }}
                </button>
            </div>
            <p v-if="!model" class="muted">Choose where this expense belongs.</p>
            <p v-if="!hasPlan" class="muted">
                This account has no budget plan yet, so the standard needs and wants are used.
            </p>
        </div>
    </div>
</template>