# Skripsi App - Feature Modules Documentation

**Updated:** March 14, 2026 (After baseline refactoring)

---

## Overview

The application is organized into feature-based modules. Each feature is self-contained with its own components, hooks, pages, and utilities.

---

## Feature: Authentication (`/src/features/auth/`)

**Purpose:** Handle user login and registration workflows

**Structure:**
```
auth/
├── index.js (Barrel export)
├── login/
│   ├── components/
│   │   └── LoginForm.jsx
│   ├── hooks/
│   │   └── useLoginForm.js
│   └── pages/
│       └── LoginPage.jsx
├── register/
│   ├── components/
│   ├── hooks/
│   │   └── useRegisterWizard.js
│   └── pages/
│       └── RegisterPage.jsx
```

**Exports:**
- `LoginPage` - Main login page component
- `LoginForm` - Reusable login form component
- `RegisterPage` - Main registration page component
- `useLoginForm` - Login form state management
- `useRegisterWizard` - Multi-step registration wizard logic

**API Integration:**
- Uses `/api/authApi.js` for authentication endpoints
- Stores user session in `UserContext`

**Key Patterns:**
- Form validation with `react-hook-form` + Zod
- Error handling in hooks, not API layer
- User state persisted in context

---

## Feature: Companies (`/src/features/companies/`)

**Purpose:** Display, search, and detail view for company listings with reviews

**Structure:**
```
companies/
├── index.js (Barrel export)
├── components/
│   ├── CompanyCardHorizontal.jsx
│   ├── CompanyCardSkeleton.jsx
│   ├── CompanyBioSection.jsx
│   ├── CompanyGeneralInfoSection.jsx
│   ├── CompanyTabsPanel.jsx
│   ├── TabNavigation.jsx
│   ├── CompanyListContainer.jsx
│   ├── EmptyStateCard.jsx
│   └── index.js
├── constants/
│   └── tabs.js (Tab configuration)
├── hooks/
│   ├── useCompanies.js (Fetch all companies)
│   ├── useCompanyDetail.js (Fetch company by slug)
│   ├── useLogoValidation.js (Validate company logo URL)
│   ├── useIntersectionObserver.js (Lazy loading)
│   └── index.js
├── pages/
│   ├── CompaniesPage.jsx (List view with search)
│   ├── CompanyDetailPage.jsx (Individual company details)
│   └── ReviewWritePage.jsx (Write company review)
```

**Exports:**
- Pages: `CompaniesPage`, `CompanyDetailPage`, `ReviewWritePage`
- Components: All UI components + card variants
- Hooks: `useCompanies`, `useCompanyDetail`, `useLogoValidation`, `useIntersectionObserver`
- Constants: `tabs` configuration

**API Integration:**
- `/api/companyApi.js` - Company endpoints
- `/api/certificateApi.js` - Certificate endpoints  
- `/api/minioApi.js` - File upload/storage

**Key Hooks:**
- `useCompanies(searchQuery)` - Returns paginated company list
- `useCompanyDetail(slug)` - Returns single company details
- `useLogoValidation(website)` - Validates logo availability

**Notable Patterns:**
- Intersection observer for lazy loading
- Tab-based navigation system
- Skeleton loaders for better UX
- Search integration with debouncing

---

## Feature: Categories (`/src/features/categories/`)

**Purpose:** Display categorized company listings

**Structure:**
```
categories/
├── index.js
└── pages/
    └── CategoriesPage.jsx
```

**Exports:**
- `CategoriesPage` - Main categories page

**API Integration:**
- `/api/categoryApi.js` - Category endpoints

---

## Feature: Home (`/src/features/home/`)

**Purpose:** Landing page with hero, featured companies, and highlights

**Structure:**
```
home/
├── index.js (Barrel export)
├── pages/
│   └── HomePage.jsx
├── sections/
│   ├── HeroSection.jsx
│   ├── TopCompanies.jsx
│   ├── HighlightReview.jsx
│   └── CallToAction.jsx
```

**Exports:**
- `HomePage` - Main landing page
- `HeroSection`, `TopCompanies`, `HighlightReview`, `CallToAction` - Reusable sections

**Key Sections:**
- **HeroSection** - Hero banner with call-to-action
- **TopCompanies** - Featured/top rated companies showcase
- **HighlightReview** - Featured user review highlight
- **CallToAction** - Action buttons and engagement prompts

---

## Feature: Inbox (`/src/features/inbox/`)

**Purpose:** User notifications and messages

**Structure:**
```
inbox/
├── components/
├── hooks/
│   ├── useInboxDetail.js
│   └── useInboxNotifications.js
├── pages/
│   └── InboxPage.jsx
└── utils/
```

**Key Hooks:**
- `useInboxNotifications()` - Fetch all notifications
- `useInboxDetail(params)` - Fetch specific notification details

**API Integration:**
- `/api/inboxApi.js` - Inbox endpoints

---

## Feature: Profile (`/src/features/profile/`)

**Purpose:** User profile management and display

**Pages:**
- User profile information
- Academic details
- Campus location
- Certificates
- Edit functionality

**API Integration:**
- `/api/userApi.js` - User data endpoints
- `/api/certificateApi.js` - Certificate management

---

## Feature: Not Found (`/src/features/not-found/`)

**Purpose:** 404 error page

**Structure:**
```
not-found/
└── pages/
    └── NotFound.jsx
```

**Styling:** Tailwind CSS with gradient backgrounds and animations (no separate CSS file)

---

## Shared Components (`/src/components/`)

### Common Components (`/components/common/`)
Reusable across the entire app:
- `Navbar.jsx` - Navigation bar
- `Logo.jsx` - Logo component
- `SearchBar.jsx` - Global search
- `ThemeToggle.jsx` - Dark/light mode toggle

### Layout Components (`/components/layout/`)
Layout structure components:
- `Container.jsx` - Max-width content wrapper (1280px)
- `Section.jsx` - Full-width section with built-in container

**Important Pattern:**
```jsx
// Background = full-width (outside section)
// Content = container-bounded
<section className="bg-gray-50 py-12">
  <Container>
    <h1>Title</h1>
  </Container>
</section>
```

### UI Components (`/components/ui/`)
Shadcn/Radix base components:
- `avatar.jsx`
- `button.jsx`
- `card.jsx`
- `dropdown-menu.jsx`
- `field.jsx`
- `input-group.jsx`
- `input.jsx`
- `label.jsx`
- `LoadingWrapper.jsx` - Loading state wrapper
- `select.jsx`
- `separator.jsx`
- `skeleton.jsx` - Loading skeleton (Tailwind-first)
- `textarea.jsx`
- `toggle.jsx`

### Card Components (`/components/cards/`)
- `CompanyCard.jsx` - Company listing card
- `ReviewCard.jsx` - Review display card

---

## Global Utilities (`/src/`)

### API Layer (`/api/`)
**Files:** All API communication without error handling
- `axiosInstance.js` - Axios config + auth interceptors
- `authApi.js` - Authentication endpoints
- `categoryApi.js` - Category endpoints
- `certificateApi.js` - Certificate endpoints
- `companyApi.js` - Company endpoints
- `inboxApi.js` - Inbox endpoints
- `majorApi.js` - Major/field endpoints
- `minioApi.js` - File storage endpoints
- `pingApi.js` - Health check
- `regionApi.js` - Region/location endpoints
- `userApi.js` - User endpoints
- `auditApi.js` - Audit endpoints

**Pattern:** All return `response.data` directly

### Hooks (`/hooks/`)
Global/shared hooks:
- `useAuth()` - Wrapper around UserContext for auth state
- `useFileUpload()` - File upload logic

### Context (`/context/`)
Global state (used sparingly):
- `userContext.jsx` - User authentication state
- `skeletonContext.jsx` - Loading skeleton state

### Helpers (`/helpers/`)
- `validations.js` - Zod schemas for form validation

### Lib (`/lib/`)
- `utils.js` - Shared utility functions (cn(), etc.)

### Routes (`/routes/`)
- `AppRoutes.jsx` - All route definitions

---

## Component Composition Pattern

### Feature Component Hierarchy

```
Page Component (from /pages/)
├── Optional: Hooks for data fetching
├── Optional: Form/state management
└── Child Components (from /components/)
    ├── Feature-specific components (from /components/)
    └── Shared components (from /components/common or /components/ui/)
```

### Example: CompanyDetailPage
```
CompanyDetailPage.jsx (page)
├── useCompanyDetail() (hook - fetches data)
├── Container (layout)
├── CompanyGeneralInfoSection (feature component)
├── CompanyTabsPanel (feature component)
│   └── CompanyBioSection
│   └── CompanyReviews
└── LoadingWrapper (ui component - loading state)
```

---

## Best Practices by Feature

### Adding a New Feature

1. **Create folder structure:**
   ```
   src/features/[feature]/
   ├── components/
   │   └── index.js
   ├── hooks/
   │   └── index.js
   ├── pages/
   │   └── [Feature]Page.jsx
   ├── utils/
   └── index.js
   ```

2. **Create API module:** `/src/api/[feature]Api.js`

3. **Create barrel exports:** Each `index.js` exports public API

4. **Add route:** Update `/src/routes/AppRoutes.jsx`

5. **Document:** Add entry to this file

---

## Data Flow Architecture

```
Component (Page or UI)
    ↓
Custom Hook (useXxx.js)
    ↓
API Function (xxxApi.js)
    ↓
Axios Instance (with interceptors)
    ↓
Backend API
```

**Error Handling:** Happens in hook/component layer, not API layer

**State Management:**
- Local state: `useState` in components
- Feature state: Custom hooks + `useState`
- Global state: Context API (auth, theme only)

---

## Styling Architecture

**Tailwind CSS First:**
- All styling uses Tailwind utility classes
- No CSS files except `index.css` (entry point)
- Inline styles only for dynamic/calculated values

**Component Styling Example:**
```jsx
// ✅ GOOD - Tailwind utilities
<div className="flex gap-4 p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-slate-900">Title</h1>
</div>

// ❌ WRONG - CSS file
import "./Component.css"
// (Use Tailwind instead)
```

---

## Performance Considerations

1. **Lazy Loading:**
   - Companies list uses `useIntersectionObserver`
   - Images lazy-loaded with intersection observer

2. **Skeleton Loaders:**
   - All data-fetching pages use skeleton components
   - Prevents layout shift during load

3. **Code Splitting:**
   - Routes support dynamic imports
   - Feature modules can be code-split

---

**Documentation Maintained:** March 14, 2026  
**Last Refactoring:** Baseline compliance (all exports, API patterns standardized)
