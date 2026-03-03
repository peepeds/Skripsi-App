# src/pages/ - Legacy Pages Directory

## 📚 Overview

This folder contains **legacy page files** that serve as **backward-compatibility wrappers**. 

> **Note**: The actual implementation of these pages has been moved to `src/features/` for better code organization and maintainability.

## 🏗️ Architecture Pattern

### Why This Exists

As part of a codebase refactor, we migrated from a **pages-based structure** to a **feature-based structure**. This folder maintains the old import paths to prevent breaking changes in existing code.

```
OLD STRUCTURE (pages-based):
src/pages/home/Home.jsx        ← Directly contained component logic

NEW STRUCTURE (feature-based):
src/features/home/pages/HomePage.jsx ← Clean separation of concerns
src/features/home/sections/HeroSection.jsx
src/features/home/hooks/useHome.js
```

### How It Works

Each file in `src/pages/` is a **simple wrapper** that re-exports the actual component from `src/features/`:

```jsx
// Example: src/pages/home/Home.jsx
import HomePage from "@/features/home/pages/HomePage";
export default HomePage;
```

✅ **Benefits:**
- Old imports still work: `import Home from "@/pages/home/Home"`
- No breaking changes to existing code
- Actual code is organized in features
- Easy migration path for future refactoring

## 📂 Directory Structure

```
src/pages/
├── home/                    # Home page wrappers
│   ├── Home.jsx            # Wrapper → @/features/home/pages/HomePage
│   ├── HeroSection.jsx      # Wrapper → @/features/home/sections/HeroSection
│   ├── TopCompanies.jsx     # Wrapper → @/features/home/sections/TopCompanies
│   ├── HighlightReview.jsx  # Wrapper → @/features/home/sections/HighlightReview
│   └── CallToAction.jsx     # Wrapper → @/features/home/sections/CallToAction
│
├── auth/
│   ├── login/
│   │   ├── Login.jsx        # Wrapper → @/features/auth/login/pages/LoginPage
│   │   └── LoginForm.jsx    # Wrapper → @/features/auth/login/components/LoginForm
│   │
│   └── register/
│       ├── Register.jsx                    # Wrapper → @/features/auth/register/pages/RegisterPage
│       ├── StepAccount.jsx                 # Real implementation (not a wrapper)
│       ├── StepPersonal.jsx                # Real implementation (not a wrapper)
│       └── StepAcademic.jsx                # Real implementation (not a wrapper)
│
├── inbox/
│   └── InboxDetail.jsx      # Wrapper → @/features/inbox/pages/InboxDetailPage
│
├── profile/
│   └── Profile.jsx          # Real implementation (not a wrapper)
│
├── NotFound.jsx            # Real implementation - 404 error page
├── PingPage.jsx            # Real implementation - dev/debugging page
├── TestPage.jsx            # Real implementation - testing utilities
└── not-found.css           # Styles for NotFound.jsx
```

## 📄 File Categories

### 1️⃣ **Wrapper Files** (re-export from features)

These files simply redirect to the actual implementation:

- `home/Home.jsx`
- `home/HeroSection.jsx` 
- `home/TopCompanies.jsx`
- `home/HighlightReview.jsx`
- `home/CallToAction.jsx`
- `auth/login/Login.jsx`
- `auth/login/LoginForm.jsx`
- `auth/register/Register.jsx`
- `inbox/InboxDetail.jsx`

**Purpose**: Maintain backward compatibility. Old code that imports from these paths will still work.

### 2️⃣ **Real Implementation Files** (not wrappers)

These files contain actual React components:

- `profile/Profile.jsx` - User profile page with personal, academic, and campus info
- `NotFound.jsx` - 404 error page with animated background
- `PingPage.jsx` - Development utility to test backend connectivity
- `TestPage.jsx` - Testing/debugging page
- `auth/register/StepAccount.jsx` - Multi-step form: account creation step
- `auth/register/StepPersonal.jsx` - Multi-step form: personal info step
- `auth/register/StepAcademic.jsx` - Multi-step form: academic info step

## 📖 How to Use

### For Beginners

1. **Want to see a page component?** Look at the wrapper files first to understand the import path.
   
2. **Want to modify a component?** Find the actual implementation in `src/features/`.
   
   Example:
   ```
   File: src/pages/home/Home.jsx (wrapper)
   ↓
   Go to: src/features/home/pages/HomePage.jsx (real code)
   ↓
   Edit the actual component
   ```

3. **Want to add a new feature?** 
   - Create it in `src/features/your-feature/`
   - Optionally create a wrapper in `src/pages/` for backward compatibility

### For Developers

When importing pages in your code:

```jsx
// Old style (still works):
import Home from "@/pages/home/Home";

// New style (preferred):
import HomePage from "@/features/home/pages/HomePage";
```

> **Recommendation**: In new code, import directly from `src/features/` to go straight to the source.

## 🔄 Migration Path

If you're refactoring code to use features directly:

1. Search for imports from `@/pages/`
2. Replace with the corresponding import from `@/features/`
3. Delete other wrapper files
4. Test thoroughly

Example:
```jsx
// Before
import Login from "@/pages/auth/login/Login";

// After  
import LoginPage from "@/features/auth/login/pages/LoginPage";
```

## 🎯 Key Files Explained

### Profile.jsx
- **Type**: Real implementation (not a wrapper)
- **Purpose**: Display user profile with personal, academic, and campus information
- **Features**:
  - Shows user avatar with initials
  - Displays name and email
  - Shows department, major, and region
  - Protected route (redirects to login if not authenticated)
  - Loading skeleton while fetching data
  - Responsive card layout
- **Location**: `/profile` route

### NotFound.jsx (404 Page)
- **Type**: Real implementation
- **Purpose**: Display error page when user visits non-existent route
- **Features**:
  - Animated background orbs
  - Clear 404 message
  - Two navigation buttons
  - Responsive design
- **Location**: Any unknown route

### PingPage.jsx
- **Type**: Real implementation
- **Purpose**: Development utility to test if backend is running
- **Features**:
  - Send ping request to backend
  - Show loading state
  - Display response message
  - Toast notifications
- **Location**: `/ping` route
- **When to use**: Testing during development

## ⚠️ Important Notes

- **Don't edit wrapper files!** If a wrapper isn't working, the issue is likely in the feature file it imports from.
- **Do add comments!** Help the next person understand what each component does.
- **Use descriptive names!** A component called "LoginForm" is better than "Form1".
- **Keep it DRY!** Don't duplicate code between wrapper and feature files (wrapper should just re-export).

## 🚀 Next Steps for Learning

1. **Read src/features/README.md** for details about the new feature structure
2. **Look at src/features/home/pages/HomePage.jsx** to see how features are organized
3. **Check src/features/auth/login/hooks/useLoginForm.js** to understand custom hooks pattern
4. **Review src/components/** to find reusable UI components

## ❓ FAQ

**Q: Should I add new pages here?**
A: No. Create them in `src/features/` instead. You can optionally add a wrapper here for backward compatibility.

**Q: What if two imports give different results?**
A: They shouldn't! Both should work identically. If not, there's a bug in the wrapper.

**Q: Can I delete this folder?**
A: Not yet. It maintains backward compatibility. After all old imports are refactored, yes.

**Q: How do step components (StepAccount, etc.) work together?**
A: They're child components used by the RegisterPage. The parent component manages which step to show using `useRegisterWizard` hook from `src/features/auth/register/hooks/`.

---

**Last Updated**: February 2024  
**Maintained By**: Development Team  
**Questions?**: Check src/features/ for the actual implementation
