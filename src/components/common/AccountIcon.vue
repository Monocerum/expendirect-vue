<script setup>
defineProps({
    account: { type: Object, default: undefined },
})
</script>

<template>
    <img v-if="account?.icon" class="aic" :src="account.icon" :alt="`${account.name} account icon`" />
    <span v-else class="aic ph">{{ account?.name?.[0] || '?' }}</span>
</template>