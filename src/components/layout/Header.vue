<script setup>
import { HEADER_NAV_ITEMS } from '@/constants/navigation'
import Logo from './Logo.vue'

defineProps({
    profile: { type: Object, required: true },
})
</script>

<template>
    <header class="top">
        <Logo />
        <nav aria-label="Main">
            <RouterLink v-for="item in HEADER_NAV_ITEMS" :key="item.to" :to="item.to">
                {{ item.label }}
            </RouterLink>
        </nav>
        <RouterLink to="/profile" class="avatar" aria-label="Profile">
            <img v-if="profile.avatar" :src="profile.avatar" alt="Your profile photo" />
            <span v-else>{{ (profile.name || 'U')[0] }}</span>
        </RouterLink>
        <RouterLink to="/settings" class="gear" aria-label="Settings">
            <img src="/assets/settings.svg" alt="" width="26" height="26" />
        </RouterLink>
    </header>
</template>