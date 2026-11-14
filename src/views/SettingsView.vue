<script setup>
import FormRow from '@/components/common/FormRow.vue'
import TypeToggle from '@/components/common/TypeToggle.vue'
import ResetDataSection from '@/components/settings/ResetDataSection.vue'
import ThemePicker from '@/components/settings/ThemePicker.vue'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { savingsPercent } from '@/utils/budgetPlan'

const GOAL_SOURCES = [
    { value: 'fixed', label: 'Fixed amount' },
    { value: 'plan', label: 'From budget plan' },
]

const store = useAppStore()
const updateSettings = (values) => store.mergeInto('settings', values)

const goalSource = computed(() => store.state.settings.goalSource || 'fixed')
const hasSavingsPlan = computed(() => store.state.plans.some((plan) => savingsPercent(plan) > 0))
</script>

<template>
    <ThemePicker :settings="store.state.settings" @change="updateSettings" />
    <section class="card form">
        <h2>Preferences</h2>
        <div class="row start">
            <span>Savings goal</span>
            <TypeToggle :model-value="goalSource" :options="GOAL_SOURCES"
                @update:model-value="updateSettings({ goalSource: $event })" />
        </div>
        <p v-if="goalSource === 'plan'" class="muted">
            {{
                hasSavingsPlan
                    ? 'Your goal is each plan’s savings % of that account’s income, so it follows your budget plans. The fixed amount below is only used if no plan sets aside savings.'
                    : 'No budget plan sets aside savings yet, so the fixed amount below is used. Add a Savings item on the Budget Plan page.'
            }}
        </p>
        <FormRow label="Monthly savings goal (PHP)">
            <input type="number" min="0" :value="store.state.settings.goal"
                @input="updateSettings({ goal: $event.target.value })" />
        </FormRow>
    </section>
    <ResetDataSection />
</template>