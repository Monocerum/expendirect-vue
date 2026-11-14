import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { loadState } from '@/store/persistence'
import { applyTheme } from '@/theme/applyTheme'
import '@/styles/index.css'

const { settings } = loadState()
applyTheme(settings.theme, settings.custom)

createApp(App).use(createPinia()).use(router).mount('#app')