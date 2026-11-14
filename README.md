# Cashflow Tracker

A responsive personal finance tracking application built with **Vue.js 3** and **JavaScript**. It allows users to manage financial accounts, monitor income and expenses, organize transactions, create budget plans, and track payment activities through an interactive dashboard.

Deployed at Vercel: https://expendirect-vue-aznm.vercel.app/

## Features

- **Dashboard** – View an overview of financial activities, account balances, savings, bills, and top expenses.
- **Account Management** – Create, edit, and manage multiple financial accounts.
- **Cashflow Tracking** – Monitor income and expenses across different accounts and time periods.
- **Transaction Management** – Add, edit, delete, and organize financial transactions.
- **Category Management** – Create custom categories, assign colors, and filter transactions.
- **Budget Planning** – Create and manage budget plans to monitor spending and savings goals.
- **Payment Tracking** – Record payments, monitor outstanding balances, and view payment statuses.
- **Data Visualization** – View spending breakdowns and financial summaries through charts.
- **Theme Customization** – Personalize the application using available themes and custom color settings.
- **Settings and Data Management** – Manage application preferences and reset stored data.
- **Responsive Design** – Adapted layouts for desktop, tablet, and mobile screens.

## Technologies Used

- **Vue.js 3** – Component-based frontend development using Single-File Components.
- **JavaScript** – Application logic and interactivity.
- **HTML5** – Application structure.
- **CSS3** – Styling, responsive layouts, and theme customization.
- **Pinia** – Centralized application state management.
- **Vue Router** – Client-side routing and navigation.
- **Vite** – Development server and build tooling.
- **npm** – Package management.

## Getting Started

Follow these instructions to run the application locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-folder>
   ```

3. Install the project dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal. By default, Vite typically uses:
   ```text
   http://localhost:5173
   ```

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Installs the required project dependencies. |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the application for production. |
| `npm run preview` | Previews the production build locally. |

## Project Structure
```
expendirect-vue/
├── .vscode/                    # VS Code workspace settings and recommendations
├── public/
│   ├── assets/                 # Images, SVG icons, and other static assets
│   ├── fonts/                  # Custom typography files
│   └── ...                     # Favicons, manifest, robots.txt, etc.
├── src/
│   ├── components/             # Reusable Vue components
│   │   ├── accounts/           # Account cards, forms, and summary modals
│   │   ├── budget/             # Budget plan components
│   │   ├── categories/         # Category cards, forms, and filters
│   │   ├── charts/             # Data visualization components
│   │   ├── common/             # Shared UI components (modals, inputs, pickers)
│   │   ├── home/               # Dashboard cards and summaries
│   │   ├── layout/             # App layout, header, navigation, and page elements
│   │   ├── payments/           # Bill payment forms, cards, and status indicators
│   │   ├── settings/           # Settings and theme customization components
│   │   ├── tracker/            # Transaction tracking and filtering components
│   │   └── transactions/       # Transaction forms, entries, and category/tag pickers
│   ├── composables/            # Reusable Composition API logic
│   ├── constants/              # Static configuration and predefined data
│   ├── router/                 # Vue Router configuration and route definitions
│   ├── store/                  # State management logic, actions, and reducers
│   ├── stores/                 # Pinia application store
│   ├── styles/                 # Modular CSS files for application styling
│   ├── theme/                  # Theme definitions and theme application logic
│   ├── utils/                  # Reusable helper functions and utilities
│   ├── views/                  # Page-level Vue components
│   ├── App.vue                 # Root application component
│   ├── main.js                 # Application entry point
│   └── style.css               # Global stylesheet entry point
├── .gitattributes
├── .gitignore
├── index.html                  # HTML document entry point
├── package.json                # Project metadata, dependencies, and scripts
├── package-lock.json           # Dependency lockfile
├── README.md
└── vite.config.js              # Vite and Vitest configuration
```

## Application Architecture

The application follows a modular, component-based architecture using Vue 3:

- **Components:** Reusable Vue Single-File Components (`.vue`) organized by application feature, with templates, scripts, and styles.
- **Pages:** Individual application views for the dashboard, accounts, budget plans, categories, payments, and other sections.
- **Pinia Stores:** Centralized application state management, including financial data, transactions, and application preferences.
- **Composables:** Reusable Composition API functions for shared logic and reactive functionality.
- **Vue Router:** Handles client-side navigation and route management.
- **Utilities:** Shared functions for financial calculations, date handling, formatting, and transaction operations.
- **Themes:** Theme configurations and customization logic.
- **Styles:** Separate stylesheets for application components, layouts, themes, and responsive behavior.

## Development

The application uses Vite for its development environment, providing Hot Module Replacement (HMR) for a faster development workflow.

Vue Single-File Components (`.vue`) organize component logic, templates, and styles. The Composition API manages reactive data and component behavior, while Pinia handles centralized state management and Vue Router manages client-side navigation.

---

**Project Type:** Personal Project  
**Frontend:** Vue.js 3, JavaScript, CSS3  
**State Management:** Pinia  
**Routing:** Vue Router  
**Build Tool:** Vite
