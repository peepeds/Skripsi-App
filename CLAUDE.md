# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Application Overview
InternView is a platform for BINUS students that connects two types of users: alumni and current students. Alumni contribute by sharing their internship experiences and reviews of companies, while current (4th semester) students use these insights to explore internship options and prepare for their applications—especially for companies outside the BINUS Enrichment Program.

## Commands

```bash
pnpm dev          # Start development server (Vite HMR)
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

Requires Node.js v24 and pnpm.

## Architecture

**InternView** is a React 19 SPA (internship/company review platform) built with Vite. The companion backend API lives at `../Skripsi-API` (Go), expected at `http://localhost:8000/api/`.

### Key conventions

- **Path alias**: `@/` maps to `./src/`
- **UI**: shadcn/ui (new-york style) + Radix UI primitives + TailwindCSS v4
- **Forms**: React Hook Form + Zod schemas
- **HTTP**: Axios instance in `src/api/` — one file per resource (e.g. `companyApi.js`, `userApi.js`)
- **State**: React Context (`src/context/`) for user session and skeleton loading state

### Rule
start as plan mode not agents

### Directory layout

```
src/
├── api/          # Axios instances and per-resource API modules
├── components/   # Reusable UI (ui/, cards/, layout/, common/, profile/, landing/)
├── context/      # userContext, skeletonContext
├── features/     # Page-level feature modules (auth, companies, profile, inbox, …)
├── hooks/        # Custom hooks
├── routes/       # AppRoutes.jsx — central route definitions
└── utils/        # Helpers and utilities
```

### Routing

Routes are defined in `src/routes/AppRoutes.jsx`. Some routes render without the navbar (login, register, storage, not-found). The layout wrapper in `src/components/layout/` conditionally shows the navbar.

### Adding new features

Follow the `src/features/<name>/` pattern: create an index page component, add API calls to `src/api/<name>Api.js`, and register the route in `AppRoutes.jsx`.
