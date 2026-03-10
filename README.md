# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 📚 Documentation

- **[Project Structure](PROJECT_STRUCTURE.md)** - Struktur folder dan organisasi kode
- **[Layout Guidelines](LAYOUT_GUIDELINES.md)** - **WAJIB DIBACA** - Aturan layout dan penggunaan Container/Section

## 🎨 Layout Rules (PENTING)

**Semua halaman harus mengikuti aturan layout konsisten:**

- Background styling (warna, gradient) = **Full-width**
- Konten (teks, card, form) = **Dibatasi dengan Container**

```jsx
import { Container, Section } from "@/components/layout";

// ✅ BENAR
<section className="bg-gray-50 py-12">
  <Container>
    <h1>Konten</h1>
  </Container>
</section>

// Atau
<Section className="bg-gray-50 py-12">
  <h1>Konten</h1>
</Section>
```

📖 **Baca detail lengkap di [LAYOUT_GUIDELINES.md](LAYOUT_GUIDELINES.md)**

---

## React + Vite Setup

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
