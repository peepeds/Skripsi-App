# Layout Guidelines

## Aturan Utama Layout

**PENTING**: Semua halaman dan section harus mengikuti pola layout konsisten ini.

### Prinsip Dasar

1. **Background Styling** = Full-width (seluruh lebar browser)
2. **Konten (teks, card, form, dll)** = Dibatasi dengan container (max-width + padding kiri-kanan)

### Komponen Layout Tersedia

#### 1. Container

Wrapper untuk membatasi lebar konten dengan batas kiri-kanan konsisten.

```jsx
import { Container } from "@/components/layout";

// Contoh penggunaan
<section className="bg-gray-50 py-12">
  <Container>
    <h1>Judul</h1>
    <p>Konten</p>
  </Container>
</section>
```

**Props:**
- `children`: Konten yang akan dibungkus
- `className`: Class tambahan (optional)

**Default Styling:**
- `max-w-7xl` (1280px max width)
- `mx-auto` (center alignment)
- `px-6` (24px horizontal padding)

#### 2. Section

Shortcut untuk section dengan container otomatis.

```jsx
import { Section } from "@/components/layout";

// Contoh penggunaan
<Section className="bg-gray-50 py-12">
  <h1>Judul</h1>
  <p>Konten</p>
</Section>
```

**Props:**
- `children`: Konten yang akan dibungkus container
- `className`: Class untuk section (background, padding, dll)
- `containerClassName`: Class tambahan untuk container (optional)

---

## Cara Penggunaan

### ❌ SALAH

```jsx
// Background ikut terbatas
<section className="bg-gray-50 py-12 max-w-7xl mx-auto px-6">
  <h1>Judul</h1>
  <p>Konten</p>
</section>

// Container di level global (App.jsx)
<main className="max-w-7xl mx-auto px-6">
  {children}
</main>
```

### ✅ BENAR

```jsx
// Background full-width, konten terbatas
<section className="bg-gray-50 py-12">
  <Container>
    <h1>Judul</h1>
    <p>Konten</p>
  </Container>
</section>

// Atau menggunakan Section component
<Section className="bg-gray-50 py-12">
  <h1>Judul</h1>
  <p>Konten</p>
</Section>
```

---

## Contoh Penerapan

### HeroSection

```jsx
import { Container } from "@/components/layout";
import { SearchBar } from "@/components/common/SearchBar";

export default function HeroSection() {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <h1 className="text-4xl font-semibold mb-4">
          Temukan Tempat magangmu
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Cari tahu tempat magang terbaik
        </p>
        <SearchBar />
      </Container>
    </section>
  );
}
```

### TopCompanies

```jsx
import { Section } from "@/components/layout";
import { CompanyCard } from "@/components/cards";

export default function TopCompanies() {
  return (
    <Section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Top Reviewed Companies</h2>
        <a href="#" className="text-green-600">Lihat semua</a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company} name={company} />
        ))}
      </div>
    </Section>
  );
}
```

### Section dengan Background Pattern

```jsx
import { Container } from "@/components/layout";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
      <Container className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Bantu mahasiswa lain
        </h2>
        <p className="text-white/90 mb-8">
          Tulis pengalaman magangmu
        </p>
        <button className="bg-white text-green-600 px-8 py-4 rounded-lg">
          Tulis Review
        </button>
      </Container>
    </section>
  );
}
```

### Multiple Containers dalam Satu Section

```jsx
import { Container } from "@/components/layout";

export default function ComplexSection() {
  return (
    <section className="py-16 bg-gray-50">
      {/* Header dengan container penuh */}
      <Container>
        <h2 className="text-2xl font-semibold mb-8">Judul Section</h2>
      </Container>
      
      {/* Content dengan container terpisah untuk kontrol lebih */}
      <Container className="mb-12">
        <div className="grid grid-cols-3 gap-6">
          {/* Cards */}
        </div>
      </Container>
      
      {/* CTA dengan container */}
      <Container className="text-center">
        <button>Action Button</button>
      </Container>
    </section>
  );
}
```

---

## Kapan Menggunakan Container vs Section

### Gunakan `Container`

- Ketika perlu kontrol penuh terhadap section element
- Ketika ada multiple containers dalam satu section
- Ketika perlu custom structure yang kompleks
- Ketika perlu mengatur background dengan lebih spesifik

### Gunakan `Section`

- Untuk section sederhana dengan satu container
- Ketika ingin kode lebih ringkas
- Untuk halaman/section standar
- Ketika tidak perlu nested containers

---

## Customization

### Custom Container Width

```jsx
<Container className="max-w-4xl">
  {/* Konten dengan max-width lebih kecil */}
</Container>
```

### Custom Container Padding

```jsx
<Container className="px-4 md:px-8">
  {/* Padding responsive custom */}
</Container>
```

### Full-width Section dengan Partial Container

```jsx
<section className="py-12 bg-gray-50">
  {/* Bagian tanpa container */}
  <div className="w-full h-64 bg-cover bg-center" 
       style={{backgroundImage: 'url(...)'}}>
  </div>
  
  {/* Bagian dengan container */}
  <Container className="mt-8">
    <h2>Konten</h2>
  </Container>
</section>
```

---

## Checklist Halaman Baru

Saat membuat halaman atau section baru:

- [ ] Background styling (bg-*, gradient, dll) pada `<section>`
- [ ] Padding vertical (py-*) pada `<section>`
- [ ] Konten dibungkus `<Container>` atau menggunakan `<Section>`
- [ ] Tidak ada `max-w-*`, `mx-auto`, `px-*` di level section
- [ ] Import component dari `@/components/layout`

---

## FAQs

**Q: Bagaimana dengan halaman yang tidak perlu container (full-width)?**  
A: Jangan gunakan Container/Section. Buat custom layout sesuai kebutuhan.

**Q: Apakah semua halaman harus mengikuti max-w-7xl?**  
A: Ya, untuk konsistensi. Tapi bisa di-override dengan className jika ada kebutuhan khusus.

**Q: Bagaimana dengan Navbar dan Footer?**  
A: Navbar biasanya punya pattern sendiri. Untuk konsistensi, bisa menggunakan Container di dalamnya.

**Q: Bolehkah menggunakan px-8 atau px-20 langsung di section?**  
A: Tidak disarankan. Gunakan Container agar padding konsisten di semua halaman.

---

## Migration Guide

Untuk mengupdate existing sections:

1. Identifikasi section yang perlu diupdate
2. Pisahkan background styling dari content styling
3. Wrap konten dengan Container atau ubah jadi Section
4. Test responsiveness di berbagai ukuran layar
5. Hapus padding horizontal di section element

**Before:**
```jsx
<section className="px-8 md:px-20 py-12 bg-gray-50">
  <h2>Title</h2>
</section>
```

**After:**
```jsx
<Section className="py-12 bg-gray-50">
  <h2>Title</h2>
</Section>
```
