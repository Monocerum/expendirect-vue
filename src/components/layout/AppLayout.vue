<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPageMeta } from '@/constants/pageMeta'
import { useAppStore } from '@/stores/app'
import { applyTheme } from '@/theme/applyTheme'
import Header from './Header.vue'
import PageHero from './PageHero.vue'
import SeoHead from './SeoHead.vue'
import SideNav from './SideNav.vue'

const route = useRoute()
const { state } = storeToRefs(useAppStore())
const isMenuOpen = ref(false)

const page = computed(() => getPageMeta(route.path))
const isHome = computed(() => route.path === '/')

watch(
	() => [state.value.settings.theme, state.value.settings.custom],
	([theme, custom]) => applyTheme(theme, custom),
	{ immediate: true }
)

watch(
	() => route.path,
	() => {
		isMenuOpen.value = false
		window.scrollTo(0, 0)
	}
)
</script>

<template>
	<div class="app">
		<SeoHead :title="page.title" :description="page.description" />
		<Header :profile="state.profile" />
		<PageHero :title="page.h1" :subtitle="isHome ? 'expense tracker' : 'expendirect'">
			<RouterLink v-if="isHome" to="/tracker" class="btn big">Track expenses</RouterLink>
		</PageHero>
		<div class="shell">
			<SideNav :is-open="isMenuOpen" @toggle="isMenuOpen = !isMenuOpen" @open="isMenuOpen = true"
				@close="isMenuOpen = false" />
			<main :key="route.path" class="content">
				<RouterView />
			</main>
		</div>
		<div class="foot" aria-hidden="true" />
	</div>
</template>