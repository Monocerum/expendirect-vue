<script setup>
import TransactionEntry from '@/components/transactions/TransactionEntry.vue'

defineProps({
    group: { type: Object, required: true },
    heading: { type: String, required: true },
})
</script>

<template>
    <section class="card">
        <small class="lbl">{{ heading }}</small>
        <h2>{{ group.name }}</h2>
        <TransactionEntry v-for="item in group.items" :key="item.id" :transaction="item" :color="group.color"
            :name="group.name" />
    </section>
</template>