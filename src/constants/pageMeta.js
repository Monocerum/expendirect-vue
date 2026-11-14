export const PAGES = {
    '/': {
        h1: 'expendirect',
        title: 'Expendirect',
        description:
            'Track expenses and income across your accounts, plan your budget, manage bills and see where your money goes with Expendirect.',
    },
    '/tracker': {
        h1: 'cashflow tracker',
        title: 'Cashflow Tracker | Expendirect',
        description:
            'Log expenses and income by account, filter by day, week, month or year, and see your spending broken down by category.',
    },
    '/accounts': {
        h1: 'accounts',
        title: 'Accounts | Expendirect',
        description:
            'Manage your bank accounts and budgets in one place and watch each balance update as you add expenses and income.',
    },
    '/categories': {
        h1: 'categories',
        title: 'Expense Categories | Expendirect',
        description:
            'Create and organize expense categories with your own colors, and see how much you spend in each one.',
    },
    '/budget-plan': {
        h1: 'budget plan',
        title: 'Budget Plan | Expendirect',
        description:
            'Split each account into needs, wants and savings, then compare your plan against what you actually spend.',
    },
    '/payments': {
        h1: 'payments',
        title: 'Bills & Payments | Expendirect',
        description:
            'Track bills, recurring payments and due dates, and keep an eye on paid, unpaid and outstanding balances.',
    },
    '/demographics': {
        h1: 'demographics',
        title: 'Spending Demographics | Expendirect',
        description:
            'See spending by category, needs versus wants, and monthly income against expenses at a glance.',
    },
    '/settings': {
        h1: 'settings',
        title: 'Settings | Expendirect',
        description: 'Set your monthly savings goal and manage your Expendirect preferences.',
    },
    '/profile': {
        h1: 'profile',
        title: 'Your Profile | Expendirect',
        description: 'Update your name, email and profile photo in Expendirect.',
    },
    '*': {
        h1: 'page not found',
        title: 'Page Not Found | Expendirect',
        description:
            'This page does not exist. Head back to Expendirect to keep tracking your expenses.',
    },
}
export const PRIVATE_ROUTES = ['*', '/settings', '/profile']

export const getPageMeta = (pathname) => PAGES[pathname.replace(/\/$/, '') || '/'] || PAGES['*']