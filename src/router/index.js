import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

export const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
            { path: 'tracker', name: 'tracker', component: () => import('@/views/TrackerView.vue') },
            { path: 'accounts', name: 'accounts', component: () => import('@/views/AccountsView.vue') },
            {
                path: 'categories',
                name: 'categories',
                component: () => import('@/views/CategoriesView.vue'),
            },
            {
                path: 'budget-plan',
                name: 'budget-plan',
                component: () => import('@/views/BudgetPlanView.vue'),
            },
            { path: 'payments', name: 'payments', component: () => import('@/views/PaymentsView.vue') },
            {
                path: 'demographics',
                name: 'demographics',
                component: () => import('@/views/DemographicsView.vue'),
            },
            { path: 'settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
            { path: 'profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
            {
                path: ':pathMatch(.*)*',
                name: 'not-found',
                component: () => import('@/views/NotFoundView.vue'),
            },
        ],
    },
]

export function createAppRouter(history = createWebHistory()) {
    return createRouter({
        history,
        routes,
        linkExactActiveClass: 'active',
    })
}

export default createAppRouter()