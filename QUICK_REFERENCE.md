# 🚀 Quick Reference Guide - Struktur Project Baru

## Import Cheat Sheet

### Common Components
```javascript
// ✅ Import dari common
import { Navbar, Logo, SearchBar, ThemeToggle } from "@/components/common";

// ❌ Avoid (old way)
import Navbar from "./components/Navbar";
import Logo from "./components/navbar-components/logo";
```

### Card Components
```javascript
// ✅ Import dari cards
import { CompanyCard, ReviewCard } from "@/components/cards";

// ❌ Avoid (old way)
import { CompanyCard } from "../../components/landing/card/CompanyCard";
import { ReviewCard } from "../../components/landing/card/ReviewCard";
```

### Custom Hooks
```javascript
// ✅ Import dari hooks
import { useAuth } from "@/hooks";

const { user, logout, isAuthenticated, loading } = useAuth();

// ❌ Avoid (old way)
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

const { user, logout } = useContext(UserContext);
```

## Folder Guide

### 📂 `src/components/common/`
**Untuk apa?** Shared components yang digunakan di berbagai halaman
- `Navbar.jsx` - Navigation bar
- `Logo.jsx` - Logo
- `SearchBar.jsx` - Search component
- `ThemeToggle.jsx` - Dark mode toggle

### 📂 `src/components/cards/`
**Untuk apa?** Card components untuk display data
- `CompanyCard.jsx` - Menampilkan info company
- `ReviewCard.jsx` - Menampilkan review

### 📂 `src/components/ui/`
**Untuk apa?** Base UI components (sudah ada)
- Button, Input, Avatar, Dropdown, etc.

### 📂 `src/components/layout/`
**Untuk apa?** Layout wrapper components (siap expansion)
- Use for page layouts, page wrappers

### 📂 `src/hooks/`
**Untuk apa?** Custom React hooks
- `useAuth.js` - Auth context wrapper

### 📂 `src/pages/`
**Untuk apa?** Page components / Views
- `pages/auth/` - Login & Register
- `pages/home/` - Home page
- `PingPage.jsx`, `TestPage.jsx` - Test pages

### 📂 `src/context/`
**Untuk apa?** React Context providers
- `userContext.jsx` - User authentication context

### 📂 `src/api/`
**Untuk apa?** API integration
- `authApi.js`, `majorApi.js`, etc.

### 📂 `src/lib/`
**Untuk apa?** Utility functions
- `utils.js` - Helper utilities

### 📂 `src/helpers/`
**Untuk apa?** Helper functions
- `validations.js` - Validation logic

## Common Tasks

### Membuat Component Baru (UI Component)

```javascript
// 1. Create file di src/components/ui/mycomponent.jsx
export function MyComponent({ prop }) {
  return <div>{prop}</div>;
}

// 2. Update src/components/ui/index.js
export { MyComponent } from "./mycomponent";

// 3. Use it
import { MyComponent } from "@/components/ui";
```

### Membuat Common Component

```javascript
// 1. Create file di src/components/common/MyCommon.jsx
export default function MyCommon() {
  return <div>Common</div>;
}

// 2. Update src/components/common/index.js
export { default as MyCommon } from "./MyCommon";

// 3. Use it
import { MyCommon } from "@/components/common";
```

### Membuat Card Component

```javascript
// 1. Create file di src/components/cards/MyCard.jsx
export function MyCard() {
  return <div>Card</div>;
}

// 2. Update src/components/cards/index.js
export { MyCard } from "./MyCard";

// 3. Use it
import { MyCard } from "@/components/cards";
```

### Membuat Custom Hook

```javascript
// 1. Create file di src/hooks/useMyHook.js
export function useMyHook() {
  // hook logic
  return { /* data */ };
}

// 2. Update src/hooks/index.js
export { useMyHook } from "./useMyHook";

// 3. Use it
import { useMyHook } from "@/hooks";
const data = useMyHook();
```

## Tips & Best Practices

### ✅ DO's
- ✅ Use path aliases (`@/`) untuk imports
- ✅ Export dari index.js files
- ✅ Group related components bersama
- ✅ Use custom hooks untuk logic sharing
- ✅ Keep components focused dan single responsibility

### ❌ DON'Ts
- ❌ Don't use relative imports (../../..)
- ❌ Don't import directly dari component file (use index.js)
- ❌ Don't put unrelated components di satu folder
- ❌ Don't repeat context usage (use custom hook)
- ❌ Don't mix component logic dengan page logic

## File Location Flowchart

```
Is it a page?
├─ YES → src/pages/[feature]/[Page].jsx
└─ NO
   │
   Is it reusable across multiple pages?
   ├─ YES
   │  │
   │  Is it a card?
   │  ├─ YES → src/components/cards/[CardName].jsx
   │  └─ NO
   │     │
   │     Is it a common UI element (navbar, search, etc)?
   │     ├─ YES → src/components/common/[ComponentName].jsx
   │     └─ NO → src/components/ui/[ComponentName].jsx
   │
   └─ NO
      │
      Is it a hook?
      ├─ YES → src/hooks/use[HookName].js
      └─ NO → Ask yourself if it should be reusable
```

## Environment Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run lint
npm run lint
```

## Troubleshooting

### Module Not Found Error
```
Error: Cannot find module '@/components/common'
```
**Solution:** Check if `index.js` exists in the folder and exports are correct

### Component Not Rendering
```javascript
// Wrong
import Navbar from "@/components/common";

// Correct
import { Navbar } from "@/components/common";
```

### Circular Dependency
**Solution:** Move shared logic to `hooks/` or `utils/`

---

**Last Updated:** 14 Februari 2026  
**Status:** ✅ Ready to use!
