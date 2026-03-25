# Companies Feature

Feature untuk mengelola dan menampilkan data perusahaan di aplikasi.

## 📁 Struktur Folder

```
companies/
├── components/          # Reusable UI components
├── constants/           # Shared constants (tabs, etc)
├── hooks/              # Custom hooks for data & logic
├── pages/              # Page components
│   ├── review/         # Review sub-feature
│   └── ...
└── index.js            # Feature exports
```

## 🔧 Komponen

### Pages
- **CompaniesPage** - List perusahaan dengan infinite scroll & search
- **CompanyDetailPage** - Detail perusahaan dengan tabs
- **ReviewWritePage** - Form untuk menulis review perusahaan

### Components
- **CompanyCardHorizontal** - Card untuk list view
- **CompanyCardSkeleton** - Loading placeholder
- **CompanyBioSection** - Bio/deskripsi perusahaan
- **CompanyGeneralInfoSection** - Banner info umum perusahaan
- **CompanyTabsPanel** - Tabs untuk detail perusahaan
- **TabNavigation** - Reusable tab navigation component
- **CompanyListContainer** - Container untuk list dengan state handling
- **EmptyStateCard** - Empty state display

## 🪝 Custom Hooks

### useCompanies(searchQuery)
Fetch dan manage companies list dengan pagination support
```jsx
const { companies, loading, hasMore, error, fetchCompanies, setPage, page } = useCompanies(searchQuery);
```

### useCompanyDetail(slug)
Fetch company detail berdasarkan slug
```jsx
const { company, loading, error } = useCompanyDetail(slug);
```

### useLogoValidation(website)
Validasi dan load logo dari favicon website
```jsx
const { logoUrl, logoValid } = useLogoValidation(website);
```

### useIntersectionObserver(isLoading, hasMore, onIntersect, threshold)
Intersection observer untuk infinite scroll
```jsx
const elementRef = useIntersectionObserver(loading, hasMore, handleLoadMore, 0.5);
```

## 📊 Constants

### COMPANY_COMPARE_TABS
Tab untuk companies list page
- semua
- teratas
- populer
- terbaru

### COMPANY_DETAIL_TABS
Tab untuk company detail page
- informasi
- testimonial
- recruitment

## 🎯 Fitur Utama

### 1. List Companies
- Infinite scroll dengan intersection observer
- Search functionality
- Loading states dengan skeleton
- Partner badge untuk perusahaan partner

### 2. Company Detail
- Info umum dengan logo
- Tab untuk informasi, testimoni, rekrutmen
- Button untuk menulis review

### 3. Write Review
- Form input title, rating, content
- Validation (TODO)
- Submit & redirect (TODO)

## 🔄 Data Flow

### List Companies
```
CompaniesPage
  ├── useCompanies (fetch data)
  ├── useIntersectionObserver (infinite scroll)
  └── CompanyListContainer (render list)
      └── CompanyCardHorizontal (per company)
```

### Company Detail
```
CompanyDetailPage
  ├── useCompanyDetail (fetch detail)
  └── CompanyGeneralInfoSection + CompanyTabsPanel
      ├── useLogoValidation (validate logo)
      └── CompanyTabsPanel content
```

## 📝 Improvement Opportunities

- [ ] Implement filter tabs (teratas, populer, terbaru)
- [ ] Add review functionality (API & validation)
- [ ] Add testimonial display
- [ ] Add recruitment info
- [ ] Performance: lazy load images
- [ ] Add error boundaries
- [ ] Add caching mechanism
- [ ] Add sorting options

## 🧪 Testing Checklist

- [ ] List loads with pagination
- [ ] Search functionality works
- [ ] Infinite scroll triggers at bottom
- [ ] Company detail loads correctly
- [ ] Logo validation works
- [ ] Tab navigation works
- [ ] Review form displays

## 📚 Related Files

- API: `src/api/companyApi.js`
- Validation: `src/helpers/validations.js`
- Layout: `src/components/layout/Container.jsx`
- UI Components: `src/components/ui/`
