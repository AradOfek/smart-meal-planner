# Kitchen Vault (Smart Meal Planner)

A modern, fast, and cozy meal planning web application designed to help you curate recipes, plan weekly meals, aggregate grocery lists automatically, and export or share shopping lists via WhatsApp and native mobile devices.

![Kitchen Vault](public/favicon.svg)

---

## 🍳 Features

- **Cozy & Home-y Theme**: Thoughtfully designed dark and light themes using a warm palette (**Vanilla Cream `#F3E9D2`**, **Graphite `#363537`**, **Warm Terracotta `#C86D51`**, and **Sage Green `#6B8E70`**).
- **Recipe Vault**: Browse public recipes or log in to create and manage your personal recipe collection powered by Supabase.
- **Multi-Meal Selector**: Add recipes to your meal plan with immediate visual feedback (`Added! ✓`). Supports selecting multiple quantities of the same recipe.
- **Automated Grocery Aggregator**: Combines ingredients across all selected meals, multiplying quantities automatically based on planned servings.
- **Mobile & WhatsApp Sharing**:
  - **WhatsApp**: Pre-formats your shopping list into clean text with emojis and opens directly in WhatsApp (`wa.me`).
  - **Web Share API**: Uses native device sharing on iOS and Android to send lists via Messages, Mail, or Notes (with automatic clipboard copy fallback on desktop).
- **Print Optimization**: Clean `@media print` layout that strips away buttons and navigation, providing a paper checklist for grocery shopping.
- **Reactive Auth Sync**: Seamless data fetching on login and instant state cleanup on logout without requiring full page reloads.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (Auth & PostgreSQL database)
- **Styling**: Modern Vanilla CSS with CSS custom properties (variables) for theme switching

---

## 🚀 Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AradOfek/smart-meal-planner.git
   cd smart-meal-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
smart-meal-planner/
├── public/                  # Static assets & favicons
├── src/
│   ├── assets/              # SVGs and static media
│   ├── context/             # AuthContext & useAuth hook
│   ├── features/
│   │   └── recipes/
│   │       ├── auth/        # AuthModal component
│   │       ├── components/  # Header, RecipeCard, PrepSheet, CheckoutModal, etc.
│   │       ├── types/       # TypeScript interfaces (Recipe, Ingredient, SelectedRecipe)
│   │       ├── recipeEngine.ts # Ingredient aggregation & WhatsApp text export helpers
│   │       ├── useDebounce.ts  # Search debounce hook
│   │       └── useRecipes.ts   # Main recipe management & Supabase query hook
│   ├── supabaseClient.ts    # Supabase client initialization
│   ├── index.css            # Design tokens, color palette, dark mode & print styles
│   ├── App.tsx              # Main layout & view routing
│   └── main.tsx             # Application entry point
├── package.json
└── tsconfig.json
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
