# Struktur Project - Skripsi Web

## Penjelasan Struktur Folder

Berikut adalah struktur folder yang telah dirapikan untuk project ini:

```
src/
├── features/                 # Domain/feature modules (logic + UI per fitur)
│   ├── auth/
│   │   ├── login/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useLoginForm.js
│   │   │   └── pages/
│   │   │       └── LoginPage.jsx
│   │   └── register/
│   │       ├── hooks/
│   │       │   └── useRegisterWizard.js
│   │       └── pages/
│   │           └── RegisterPage.jsx
│   │
│   ├── home/
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   └── sections/
│   │       ├── HeroSection.jsx
│   │       ├── TopCompanies.jsx
│   │       ├── HighlightReview.jsx
│   │       └── CallToAction.jsx
│   │
│   └── inbox/
│       ├── components/       # UI khusus inbox (presentational)
│       │   ├── InboxDetailSkeleton.jsx
│       │   ├── InboxDetailView.jsx
│       │   └── InboxDropdown.jsx
│       ├── hooks/            # Business logic inbox (state, effects, API orchestration)
│       │   ├── useInboxDetail.js
│       │   └── useInboxNotifications.js
│       ├── pages/            # Container page khusus fitur
│       │   └── InboxDetailPage.jsx
│       └── utils/            # Utility/transformation khusus inbox
│           └── activityLog.js
│
├── components/               # Semua UI components
│   ├── common/              # Components yang sering digunakan (shared)
│   │   ├── Navbar.jsx       # Navigation bar (layout/auth; inbox logic dipisah ke feature)
│   │   ├── Logo.jsx         # Logo component
│   │   ├── SearchBar.jsx    # Search bar component
│   │   ├── ThemeToggle.jsx  # Dark mode toggle
│   │   └── index.js         # Export all common components
│   ├── cards/               # Card components
│   │   ├── CompanyCard.jsx  # Company card component
│   │   ├── ReviewCard.jsx   # Review card component
│   │   └── index.js         # Export all card components
│   ├── layout/              # Layout wrapper components
│   ├── ui/                  # Base UI components (button, input, avatar, etc.)
│   └── landing/             # Legacy - to be cleaned up
│
├── pages/                    # Page components / Views
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   │   ├── Login.jsx
│   │   │   └── LoginForm.jsx
│   │   └── register/
│   │       ├── Register.jsx
│   │       ├── StepAccount.jsx
│   │       ├── StepAcademic.jsx
│   │       └── StepPersonal.jsx
│   ├── home/                # Home page
│   │   ├── Home.jsx
│   │   ├── HeroSection.jsx
│   │   ├── TopCompanies.jsx
│   │   ├── HighlightReview.jsx
│   │   └── CallToAction.jsx
│   ├── PingPage.jsx
│   └── TestPage.jsx
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.js           # Auth hook (user context wrapper)
│   └── index.js             # Export all hooks
│
├── context/                  # React Context
│   └── userContext.jsx      # User auth context
│
├── api/                      # API calls
│   ├── authApi.js
│   ├── axiosInstance.js
│   ├── majorApi.js
│   ├── pingApi.js
│   └── regionApi.js
│
├── lib/                      # Utility functions
│   └── utils.js
│
├── helpers/                  # Helper functions
│   └── validations.js
│
├── utils/                    # General utilities
│   └── history.js
│
├── assets/                   # Static assets (images, icons, etc.)
├── App.jsx                   # Main app component
├── App.css                   # App styles
├── main.jsx                  # Entry point
├── index.css                 # Global styles
└── context/                  # Context providers
```

## Key Changes

### 1. **components/common/** - Shared Components
- Memindahkan `Navbar.jsx` ke `components/common/`
- Memindahkan `logo.jsx` → `Logo.jsx`
- Memindahkan `SearchBar.jsx` dari `navbar-components/`
- Memindahkan `theme-toggle.jsx` → `ThemeToggle.jsx`
- Membuat `index.js` untuk clean exports

### 2. **components/cards/** - Card Components
- Memindahkan `CompanyCard.jsx` dan `ReviewCard.jsx`
- Membuat `index.js` untuk clean exports

### 3. **hooks/** - Custom Hooks
- Membuat `useAuth.js` hook untuk wrap UserContext
- Menghilangkan repetisi penggunaan `useContext(UserContext)`
- Membuat `index.js` untuk clean exports

### 4. **Updated Imports**
- `import Navbar from "./components/Navbar"` → `import { Navbar } from "@/components/common"`
- `import { ReviewCard } from "../../components/landing/card/ReviewCard"` → `import { ReviewCard } from "@/components/cards"`
- `import { CompanyCard } from "../../components/landing/card/CompanyCard"` → `import { CompanyCard } from "@/components/cards"`

### 5. **Feature-first Separation (Inbox)**
- `src/pages/inbox/InboxDetail.jsx` sekarang hanya wrapper agar route lama tetap kompatibel.
- Logic data-fetch/action dipindahkan ke `src/features/inbox/hooks/useInboxDetail.js`.
- UI detail dipisah di `src/features/inbox/components/InboxDetailView.jsx`.
- Transformasi timeline/audit log dipusatkan di `src/features/inbox/utils/activityLog.js`.
- Logic inbox dropdown navbar dipisah ke `useInboxNotifications` + `InboxDropdown`.

### 6. **Feature-first Separation (Auth + Home)**
- Route login/register sekarang mengarah ke `src/features/auth/**`.
- Logic login dipisah ke `useLoginForm` agar form UI tetap presentational.
- Logic wizard register dipisah ke `useRegisterWizard`.
- Komposisi halaman home dipindah ke `src/features/home/pages/HomePage.jsx`.
- Section home (`HeroSection`, `TopCompanies`, `HighlightReview`, `CallToAction`) dipusatkan di `src/features/home/sections`.
- File lama di `src/pages/**` dan `src/components/**` dipertahankan sebagai wrapper kompatibilitas.

## Benefits

✅ **Better Organization** - Folder terstruktur dengan jelas  
✅ **Easier Navigation** - Mudah menemukan file yang dibutuhkan  
✅ **Cleaner Imports** - Menggunakan path alias `@/` dan index.js  
✅ **Reusable Hooks** - `useAuth()` custom hook untuk cleaner code  
✅ **Scalability** - Mudah untuk menambah features baru  
✅ **Maintenance** - Lebih mudah untuk maintain dan refactor  

## Next Steps

Untuk cleaning up lebih lanjut:
- [ ] Hapus folder `components/navbar-components/` (sudah dipindahkan)
- [ ] Hapus folder `components/landing/` (sudah dipindahkan)
- [ ] Hapus `components/Navbar.jsx` dan `components/SearchBar.jsx` (sudah dipindahkan)
- [ ] Reorganisasi `pages/auth/` untuk structure yang lebih konsisten
- [ ] Buat layout components di `components/layout/` (jika diperlukan)
