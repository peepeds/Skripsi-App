# Skripsi App - Developer Baseline

**Purpose:** This baseline specifies architectural decisions, code patterns, and standards for all development in this project. It serves as a specification for writing consistent, maintainable code.

**Tech Stack:** React 19 + Vite + Tailwind CSS + Shadcn/Radix UI + react-hook-form + Zod + Axios

---

## 1. Project Architecture

### Philosophy: Feature-Based Organization

The codebase is organized around **features/domains**, not layers. Each feature contains its own:
- **Components** - Presentational UI for that feature
- **Hooks** - Business logic + API calls + state management
- **Pages** - Page containers (usually one per feature)
- **Utils** - Feature-specific utilities/helpers

**Goal:** Keep related code together. A feature is a self-contained slice that can be understood/modified in isolation.

---

## 2. Folder Structure

```
src/
├── features/                  # Feature modules (domain-based)
│   ├── auth/                  # Feature: authentication
│   │   ├── login/
│   │   │   ├── components/    # UI components for login
│   │   │   ├── hooks/         # Login-specific hooks
│   │   │   └── pages/         # LoginPage.jsx
│   │   └── register/          # Similar structure
│   ├── companies/             # Feature: company listings
│   ├── inbox/                 # Feature: messaging/notifications
│   ├── profile/               # Feature: user profile
│   └── [other features]/
│
├── components/                # Shared UI components
│   ├── common/                # Reusable across entire app (Navbar, Logo, etc.)
│   ├── layout/                # Layout wrappers (Container, Section)
│   ├── ui/                    # Base UI components (button, input, avatar, etc.)
│   └── cards/                 # Card variants
│
├── api/                       # API integration layer
│   ├── axiosInstance.js       # Axios config + interceptors
│   ├── authApi.js             # Auth endpoints
│   ├── companyApi.js          # Company endpoints
│   └── [feature]Api.js        # Feature-specific API calls
│
├── context/                   # Global state (Context API only)
│   ├── userContext.jsx        # User authentication state
│   └── skeletonContext.jsx    # UI loading state
│
├── hooks/                     # Global/shared hooks
│   ├── useAuth.js             # Wrapper around UserContext
│   ├── useFileUpload.js       # Shared file upload logic
│   └── index.js               # Export all shared hooks
│
├── lib/                       # Shared utilities (NO business logic)
│   ├── utils.js               # Helper functions (cn(), date formatting, etc.)
│   └── [utility].js
│
├── helpers/                   # Domain-agnostic helpers
│   └── validations.js         # Zod schemas, validation logic
│
├── routes/                    # Routing config
│   └── AppRoutes.jsx          # All route definitions
│
└── App.jsx, main.jsx          # App entry point
```

### Key Rules
- ✅ **Feature folder has:** `components/`, `hooks/`, `pages/`, `utils/`
- ✅ **Shared components go in:** `/components/common` or `/components/ui`
- ✅ **API calls isolated in:** `/api/[feature]Api.js`
- ✅ **Global state ONLY in:** `/context/` (use sparingly)
- ❌ **NO:** Nested folders deeper than 3 levels (keep it flat)
- ❌ **NO:** `utils/` or `helpers/` inside `/features/` unless truly isolated to that feature

---

## 3. Naming Conventions

### Files & Folders

| Type | Pattern | Example |
|------|---------|---------|
| **React components** | `PascalCase.jsx` | `ProfileHeader.jsx`, `CompanyCard.jsx` |
| **Hooks** | `useXxx.js` | `useAuth.js`, `useInboxNotifications.js` |
| **Utilities** | `camelCase.js` | `validators.js`, `dateUtils.js` |
| **API modules** | `[feature]Api.js` | `companyApi.js`, `authApi.js` |
| **Contexts** | `[feature]Context.jsx` | `userContext.jsx` |
| **Feature folders** | `lowercase` | `features/auth/`, `features/companies/` |
| **Sub-folders** | `lowercase` | `components/`, `hooks/`, `pages/`, `utils/` |

### Variables & Functions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | `PascalCase` | `function HomePage() { }` |
| **Functions/vars** | `camelCase` | `const fetchData = () => {}` |
| **Constants** | `UPPER_SNAKE_CASE` | `const MAX_FILE_SIZE = 5242880` |
| **Booleans** | `is`, `has`, `should` prefix | `isLoading`, `hasError`, `shouldRefresh` |
| **API responses** | `[feature]` singular | `const company = res.data.result` |

---

## 4. Code Standards

### React Components

**Guidelines:**
- ✅ **Functional components only** (no class components)
- ✅ **Named exports** (not default)
- ✅ **Props destructuring** at function signature
- ✅ **Hooks at top of component** (no deep nesting)
- ✅ **Separate logic to custom hooks** if component gets complex (>100 lines)

```jsx
// ✅ GOOD
export function CompanyCard({ id, name, rating, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return <div onClick={() => onSelect(id)}>...</div>;
}

// ❌ WRONG - Too much logic in component
export function CompanyCard({ id }) {
  const { data, loading, error } = useFetchCompany(id);
  const { actions } = useCompanyActions(id);
  const { theme } = useTheme();
  // ... 200 lines of JSX
}
```

### Component Structure Order

1. **Props destructuring**
2. **State hooks** (useState)
3. **Custom hooks** (useFetch, etc.)
4. **Effect hooks** (useEffect)
5. **Event handlers**
6. **Computed values**
7. **JSX return**

### Props

- ✅ Keep props minimal and focused
- ✅ Use object destructuring: `function Card({ title, description })`
- ❌ NO: Spreading unknown props: `function Card({...props})`
- ❌ NO: Props objects without destructuring

---

## 5. Common Patterns

### A. API Integration Pattern

**Location:** `/api/[feature]Api.js`

```js
// src/api/companyApi.js
import axiosInstance from "./axiosInstance";

export const getCompanies = async (params = {}) => {
  const res = await axiosInstance.get("/companies", { params });
  return res.data; // Backend always wraps in { success, result, message }
};

export const getCompanyById = async (id) => {
  const res = await axiosInstance.get(`/companies/${id}`);
  return res.data;
};
```

**Key Rules:**
- ✅ **One file per feature** (e.g., `companyApi.js` for all company endpoints)
- ✅ **Use axiosInstance** (never direct axios)
- ✅ **Return res.data directly** (interceptor handles errors)
- ✅ **Endpoint name matches intent:** `getCompanies()`, `createCompany()`, `updateCompany()`
- ✅ **Handle errors in hooks/components**, NOT in API functions

### B. Custom Hook Pattern (Business Logic)

**Location:** `/features/[feature]/hooks/`

```js
// src/features/companies/hooks/useCompanyList.js
import { useState, useEffect } from "react";
import { getCompanies } from "@/api/companyApi";

export function useCompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCompanies();
        if (data.success) {
          setCompanies(data.result);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { companies, loading, error };
}
```

**Key Rules:**
- ✅ **Hooks handle:** API calls, data transformation, state management
- ✅ **Return state + status:** `{ data, loading, error }`
- ✅ **One hook = one responsibility** (not a god-hook)
- ✅ **Name clearly:** `useCompanyList`, `useCompanyDetail`, `useCompanyActions`
- ❌ NO: Complex logic inside components
- ❌ NO: Multiple unrelated states in one hook

### C. Form Handling Pattern

**Use:** react-hook-form + Zod

```js
// src/helpers/validations.js
import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "Min 3 chars"),
  email: z.string().email(),
  industry: z.enum(["tech", "finance", "retail"]),
});
```

```jsx
// Component
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/helpers/validations";

export function CompanyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(companySchema),
  });

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

**Key Rules:**
- ✅ **Schemas in:** `/helpers/validations.js`
- ✅ **Use Zod for validation** (type-safe)
- ✅ **One schema per entity** (companySchema, userSchema, etc.)
- ✅ **Form state in component** (unless shared across multiple pages)

### D. Global State Pattern (User Context)

**Location:** `/context/userContext.jsx`

**Example:** User authentication state

```jsx
// Provides: { user, loading, isAuthenticated, logout, loadUser }
export const UserContext = createContext({...});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load from cache first, then API
  const loadUser = async () => {...};
  const logout = () => {...};
  
  return (
    <UserContext.Provider value={{ user, loading, ... }}>
      {children}
    </UserContext.Provider>
  );
}
```

**How to use:**
```jsx
// src/hooks/useAuth.js - Convenience wrapper
export function useAuth() {
  const { user, loadUser, logout, loading } = useContext(UserContext);
  return { user, loadUser, logout, loading, isAuthenticated: user !== null };
}

// Component
const { user, isAuthenticated } = useAuth();
```

**Key Rules:**
- ✅ **Context is for auth + theme ONLY** (sparingly)
- ✅ **Not for feature-specific data** (use hooks instead)
- ✅ **Provide convenience wrapper hooks** (useAuth, useTheme)
- ✅ **Cache in localStorage** where applicable
- ❌ NO: Multiple nested Providers (Max 2-3: Auth, Theme, Toast)

---

## 6. UI & Styling Rules

### Component Library

- **Base UI:** Shadcn/Radix UI components (in `/components/ui/`)
- **Icons:** lucide-react
- **Styling:** Tailwind CSS (not CSS modules or inline styles)

**Usage:**
```jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export function MyComponent() {
  return (
    <div className="flex gap-4">
      <Input placeholder="Search..." />
      <Button><CheckCircle /> Save</Button>
    </div>
  );
}
```

### Layout Pattern

**CRITICAL RULE:** Background = full-width, Content = Container-bounded

```jsx
// ✅ CORRECT
<section className="bg-gray-50 py-12">
  <Container>
    <h1>Title</h1>
  </Container>
</section>

// or shorthand
<Section className="bg-gray-50 py-12">
  <h1>Title</h1>
</Section>

// ❌ WRONG - background gets constrained
<section className="max-w-7xl mx-auto px-6 py-12 bg-gray-50">
  ...
</section>
```

**Key Rules:**
- ✅ **Section/full-width styling:** at outer level
- ✅ **Container for content:** inside section
- ✅ **Max-width:** 1280px (7xl)
- ✅ **Default padding:** px-6 (24px) horizontally
- See [LAYOUT_GUIDELINES.md](../LAYOUT_GUIDELINES.md) for details

### Tailwind Classes

- ✅ Use utility classes (not custom CSS when possible)
- ✅ Responsive prefixes: `md:`, `lg:`, `sm:` (mobile-first)
- ✅ Dark mode: `dark:` prefix (if theme is supported)
- ✅ Common patterns: `flex`, `gap-x`, `px-y`, `py-z` styling
- ❌ NO: Arbitrary values (use predefined spacing)
- ❌ NO: Inline styles unless absolutely necessary

---

## 7. State Management

### Decision Tree

| Scenario | Use |
|----------|-----|
| User auth, session | Context (UserContext) |
| Theme/dark mode | Context (ThemeContext) |
| Form data | Local state (useState) |
| Fetched list data | Custom hook (useState + useEffect) |
| UI toast/notifications | Library (toast/sonner) |
| Multiple features sharing state | Custom hook + Context |

### Best Practices

- ✅ **Prefer local state first** (useState in component)
- ✅ **Move to hook if:** Used across components in same feature
- ✅ **Move to context if:** Needed globally (auth, theme)
- ✅ **Keep context payload small** (don't store all fetched data)
- ❌ NO: Global state for every feature
- ❌ NO: useState + Context for same data (pick one)
- ❌ NO: Deeply nested object updates (use separate state slices)

---

## 8. File Exports & Imports

### Export Pattern

**Feature-level exports:** Use index.js barrels to simplify imports

```js
// src/features/companies/index.js
export { default as CompaniesPage } from "./pages/CompaniesPage";
export { useCompanyList } from "./hooks/useCompanyList";
export { useCompanyDetail } from "./hooks/useCompanyDetail";

// Then import as: import { CompaniesPage, useCompanyList } from "@/features/companies";
```

**Component exports:** Named exports

```jsx
// ✅ GOOD
export function Button({ children }) { }

// ❌ WRONG
export default function Button({ children }) { }
```

### Import Order

1. External libraries (react, axios, etc.)
2. Context & hooks
3. Components
4. Utils & helpers
5. Styles (if any)

```jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { validateEmail } from "@/helpers/validations";
import "./Profile.css"; // if needed
```

---

## 9. API Interceptors & Error Handling

### Axios Instance

**File:** `/src/api/axiosInstance.js`

- ✅ **Auto-attaches auth tokens** to requests
- ✅ **Refreshes expired tokens** automatically
- ✅ **Returns standardized response:** `{ success, result, message }`
- ✅ **Throws errors** on non-200 status

**Working with API:**

```js
// Automatic token attachment - no need to manually add headers
const data = await getCompanies(); // Token auto-added if logged in

// Error handling in components/hooks
try {
  const result = await companyApi.getCompanies();
  if (result.success) {
    setCompanies(result.result);
  } else {
    toast.error(result.message);
  }
} catch (err) {
  toast.error("Network error");
}
```

---

## 10. API Response Contract

### Standard Response Structure

**All API responses MUST follow this contract:**

```json
{
  "success": true,           // boolean - Indicates operation success/failure
  "message": "Description",  // string - Clear, descriptive message
  "result": {}               // any - Data payload (optional, only on success)
}
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | `boolean` | ✅ Always | `true` for successful operations, `false` for errors |
| `message` | `string` | ✅ Always | Clear, human-readable message (explain what happened) |
| `result` | `any` | ❌ Conditional | Data payload on success. Omitted on errors or 204 No Content |

### HTTP Status Codes

| Status | Use Case | success | Example |
|--------|----------|---------|----------|
| **200 OK** | Successful GET, PATCH, PUT | `true` | Fetch data, update profile |
| **201 Created** | Successful POST (resource created) | `true` | Register user, create company |
| **204 No Content** | Success with no data to return | `true` | Delete resource, logout |
| **400 Bad Request** | Validation/malformed request | `false` | Invalid email, missing fields |
| **401 Unauthorized** | Missing/invalid authentication token | `false` | Token expired, not logged in |
| **403 Forbidden** | Authenticated but not authorized | `false` | Insufficient permissions |
| **404 Not Found** | Resource doesn't exist | `false` | Company ID not found |
| **409 Conflict** | Resource already exists | `false` | Email already registered |
| **500 Internal Server Error** | Unexpected server error | `false` | Database connection failed |

### Success Responses

#### GET - Returning Data

**Request:**
```bash
GET /api/companies?page=0&size=15
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Companies retrieved successfully",
  "result": {
    "data": [
      { "id": 1, "name": "Tech Corp", "rating": 4.5 },
      { "id": 2, "name": "Finance Inc", "rating": 4.8 }
    ],
    "pagination": {
      "page": 0,
      "size": 15,
      "total": 42
    }
  }
}
```

#### POST - Creating Resource

**Request:**
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "secure123",
  "fullName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "result": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiI..."
  }
}
```

#### DELETE - No Content

**Request:**
```bash
DELETE /api/companies/5
```

**Response (204 No Content):**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

### Error Responses

#### 400 - Validation Error

**Request:**
```bash
POST /api/auth/login
{
  "email": "invalid-email",
  "password": ""
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed: Email must be valid. Password is required."
}
```

#### 401 - Unauthorized

**Request:**
```bash
GET /api/user/me
Headers: Authorization: Bearer invalid-token
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication failed: Token expired or invalid. Please login again."
}
```

#### 403 - Forbidden

**Request:**
```bash
PATCH /api/company/request/5/approve
Headers: Authorization: Bearer user-token
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied: Only admin users can approve company requests."
}
```

#### 404 - Not Found

**Request:**
```bash
GET /api/companies/999
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Resource not found: Company with ID 999 does not exist."
}
```

#### 409 - Conflict

**Request:**
```bash
POST /api/auth/register
{
  "email": "existing@example.com",
  "password": "secure123",
  "fullName": "Jane Doe"
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Conflict: Email already registered. Please login or use a different email."
}
```

#### 500 - Server Error

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Server error: An unexpected error occurred. Please try again later."
}
```

### Message Guidelines

**Write messages that are:**

✅ **Clear & Specific**
- ✅ `"Email already registered. Please login or use a different email."`
- ❌ `"Error"`
- ❌ `"Something went wrong"`

✅ **Actionable (Tell user what to do next)**
- ✅ `"Token expired. Please login again."`
- ✅ `"Validation failed: Password must be at least 8 characters."`
- ❌ `"Invalid password"`

✅ **Consistent Formatting**
- Use clear prefixes: `"Validation failed:", "Authentication failed:", "Resource not found:", "Access denied:", "Server error:"`
- Keep tone professional and helpful

✅ **Domain-Appropriate**
- `"User registered successfully"` (auth)
- `"Company request approved"` (company workflow)
- `"File uploaded to storage"` (file operations)

### Frontend Implementation Pattern

**Hook Example:**
```js
export function useCompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/companies");
        
        // Check response contract
        if (response.data.success) {
          setCompanies(response.data.result.data);
          setError(null);
        } else {
          // API returned false success
          setError(response.data.message);
          setCompanies([]);
        }
      } catch (err) {
        // Network/axios error
        setError(err.response?.data?.message || "Network error");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);

  return { companies, loading, error };
}
```

**Component Example:**
```jsx
export function CompanyListPage() {
  const { companies, loading, error } = useCompanyList();

  if (loading) return <Skeleton />;
  if (error) return <ErrorCard message={error} />; // Use message from API directly

  return (
    <div>
      {companies.map(company => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
```

### Backend Checklist

- ✅ **All responses** include both `success` and `message`
- ✅ **Success responses (200, 201)** have `success: true` and optional `result`
- ✅ **Error responses** have `success: false` and clear `message`
- ✅ **Status codes are semantically correct** (200 for GET, 201 for POST, 204 for DELETE, 4xx for client errors, 5xx for server errors)
- ✅ **Messages are actionable & specific** (not generic)
- ✅ **Validation errors** list all failing fields
- ✅ **No spaghetti responses** (data mixed with error fields)
- ✅ **Pagination** included in list responses under `result`

---

## 11. DO's & DON'Ts

### DO ✅

| Do | Why |
|----|-----|
| Create custom hooks for reusable logic | Keeps components clean, logic testable |
| Use API wrapper functions | Centralized, easier to modify endpoints |
| Separate presentation from business logic | Easier to test, refactor, understand |
| Keep context minimal | Faster re-renders, clearer data flow |
| Use Tailwind for styling | Consistent, performant, no CSS conflicts |
| Name files/functions clearly | Self-documenting code, easier debugging |
| Organize by features | Easy to locate, modify, delete features |

### DON'T ❌

| Don't | Why |
|--|----|
| Put API calls directly in components | Hard to test, reuse, or modify | 
| Create deeply nested folder structures | Hard to navigate, find files |
| Global state for everything | Causes unnecessary re-renders |
| Use `any` or loose prop types | Hides bugs, future errors |
| Inline complex logic in JSX | Hard to read, test, maintain |
| Create god-components (>200 lines) | Hard to understand, refactor |
| Ignore error handling | Poor UX, hidden bugs |
| Use CSS files for single components | Tailwind is more maintainable |

### Common Anti-patterns

```jsx
// ❌ WRONG: API call in component
export function CompanyList() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    axiosInstance.get("/companies").then(res => setCompanies(res.data.result));
  }, []);
  return <div>{companies.map(...)}</div>;
}

// ✅ CORRECT: Extract to hook
const { companies } = useCompanyList();
return <div>{companies.map(...)}</div>;
```

```jsx
// ❌ WRONG: Everything in state
const [formData, setFormData] = useState({
  name: "",
  email: "",
  isLoading: false,
  error: null,
  success: false
});

// ✅ CORRECT: Separate concerns
const [formData, setFormData] = useState({ name: "", email: "" });
const [state, setState] = useState({ isLoading: false, error: null });
```

---

## 12. Critical Files Reference

| File | Purpose |
|------|---------|
| `/src/api/axiosInstance.js` | Axios config + auth interceptors |
| `/src/context/userContext.jsx` | Global user auth state |
| `/src/hooks/useAuth.js` | Wrapper hook for UserContext |
| `/src/routes/AppRoutes.jsx` | All route definitions |
| `/src/helpers/validations.js` | All Zod schemas |
| `/src/lib/utils.js` | Shared utilities (cn, date, etc.) |
| `/src/components/layout/` | Container, Section components |
| `/src/components/ui/` | Shadcn base components |

---

## 13. Quick Checklist for New Features

When adding a new feature, ensure:

- [ ] Feature folder: `/features/[name]/` with `components/`, `hooks/`, `pages/`, `utils/`
- [ ] API module: `/api/[name]Api.js` with all endpoints
- [ ] Custom hooks: `/features/[name]/hooks/` for business logic
- [ ] Page component: `/features/[name]/pages/[Name]Page.jsx`
- [ ] Route added: In `/src/routes/AppRoutes.jsx`
- [ ] Export barrel: `/features/[name]/index.js` for imports
- [ ] Validation schema: In `/helpers/validations.js` (if needed)
- [ ] Error handling: In hooks/components
- [ ] Type safety: Props clearly documented/destructured
- [ ] Layout rules: Sections use Container for content width

---

## 14. Deployment & Environment

### Environment Variables

- API Base URL: `VITE_API_BASE_URL` (fallback: `http://localhost:8000/api`)
- Other config: Define in `.env.local` (not committed)

### Build

```bash
npm run build  # Production build
npm run dev    # Dev server with HMR
npm run lint   # Check ESLint violations
```

---

## 15. Post-Generation: Documentation Requirements

**After implementing code/features, documentation in `/docs/` MUST be updated or created.**

### A. For New Features

When a new feature is created, **create or update `/docs/FEATURES.md`** with entry:

```markdown
## Feature Name

**Location:** `/src/features/[feature-name]/`

**Purpose:** What this feature does (1-2 sentences)

**Key Components:**
- `pages/[Name]Page.jsx` - Main page/container
- `components/` - List key UI components
- `hooks/` - List custom hooks (e.g., useFetchData, useFormState)
- `[feature]Api.js` - API endpoints

**Data Flow:** Brief explanation of how data flows

**Example Import:**
```jsx
import { FeaturePage, useFeatureHook } from "@/features/feature-name";
```
```

### B. For API Endpoints

**Create or update `/docs/API.md`** with endpoint documentation:

```markdown
## [Feature] Endpoints

**Base URL:** `/api/[feature]`

### Endpoints

#### GET /[feature]
- **Description:** What it does
- **Query params:** (if any)
- **Response:** `{ success, result: [...], message }`
- **Errors:** 400, 401, 404, 500

#### POST /[feature]
- **Description:** What it does
- **Body:** `{ field1, field2, ... }`
- **Response:** `{ success, result: {...}, message }`
```

### C. For Complex Custom Hooks

**Create or update `/docs/HOOKS.md`** for reusable/complex hooks:

```markdown
## useHookName

**Location:** `/src/features/[feature]/hooks/useHookName.js`

**Purpose:** What this hook does

**Parameters:**
- `param1` (type) - Description
- `param2` (type) - Description (optional)

**Returns:**
```js
{
  data,       // Data type and description
  loading,    // boolean - Loading state
  error       // Error object or null
}
```

**Example:**
```jsx
const { data, loading, error } = useHookName(param1);
```
```

### D. For Breaking Changes

**Create or update `/docs/MIGRATION.md`** when patterns/imports change:

```markdown
## Breaking Change: [Description]

**When:** Date/version this changed

**What Changed:** Explain the change

**Before:**
```jsx
import { Component } from "@/path/old";
```

**After:**
```jsx
import { Component } from "@/path/new";
```

**Why:** Reason for change and benefits
```

### Post-Implementation Checklist

**Agent MUST verify before code generation is complete:**

- [ ] Code follows BASELINE.md naming conventions
- [ ] Feature folder structure: `/features/[name]/{components,hooks,pages,utils}`
- [ ] All custom hooks have JSDoc: `@param`, `@returns`
- [ ] API calls isolated in `/api/[feature]Api.js`
- [ ] All new files export via barrel export (`index.js`)
- [ ] Error handling implemented (try/catch, error states)
- [ ] Route added to `/src/routes/AppRoutes.jsx` (if page)
- [ ] Feature documented: `/docs/FEATURES.md` ✅
- [ ] New API endpoints documented in `/docs/API.md` per Section 10 contract ✅
- [ ] Complex hooks: `/docs/HOOKS.md` ✅
- [ ] Breaking changes: `/docs/MIGRATION.md` ✅
- [ ] Validation schema added to `/helpers/validations.js` (if form)
- [ ] **API responses follow Section 10 contract** (success, message fields + proper status codes) ✅
- [ ] Build passes: `npm run build` ✅
- [ ] Linting passes: `npm run lint` ✅
- [ ] No broken imports or undefined routes

### Documentation Files Reference

| File | Purpose | When to Update |
|------|---------|-----------------|
| **BASELINE.md** | Core standards & patterns | Only for major pattern changes |
| **LAYOUT_GUIDELINES.md** | Container/Section rules | If layout patterns change |
| **FEATURES.md** | Feature inventory | After new feature created |
| **API.md** | API endpoint reference | After new/modified endpoints |
| **HOOKS.md** | Reusable hooks reference | After complex hook created |
| **MIGRATION.md** | Breaking change guides | After architecture refactor |

### Key Points for Agents

1. **Documentation is NOT optional** - It's part of the implementation
2. **Keep docs in sync with code** - Out-of-date docs are worse than no docs
3. **Use templates** - Copy the templates above for consistency
4. **Be specific** - Include actual code examples, not abstract descriptions
5. **Update ALWAYS** - Even small features need documentation

---

## Summary

**This baseline ensures:**
1. ✅ Consistent, predictable code organization
2. ✅ Clear separation of concerns (features, components, logic)
3. ✅ Reusable hooks and APIs for common patterns
4. ✅ Maintainable styling with Tailwind
5. ✅ Scalable architecture as features grow
6. ✅ **Well-documented code and features** in `/docs/`

**When in doubt:** 
- Refer to existing features (auth, companies, inbox) as examples
- Check `/docs/FEATURES.md` for feature documentation
- Follow patterns established in BASELINE.md

---

**Last Updated:** March 2026  
**Version:** 1.1
