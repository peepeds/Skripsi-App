import { Container } from "./Container";

/**
 * Section Component
 * =================
 * Komponen wrapper untuk section dengan background dan container otomatis.
 * 
 * ATURAN PENGGUNAAN:
 * - Background (className) diterapkan pada section (full-width)
 * - Konten otomatis dibungkus Container dengan batas konsisten
 * - Gunakan ini untuk mempercepat pembuatan section
 * 
 * @param {string} className - Class untuk section (background, padding vertical, dll)
 * @param {string} containerClassName - Class tambahan untuk container
 * 
 * @example
 * <Section className="bg-gray-50 py-12">
 *   <h1>Judul</h1>
 *   <p>Konten</p>
 * </Section>
 */

export function Section({ 
  children, 
  className = "", 
  containerClassName = "" 
}) {
  return (
    <section className={className}>
      <Container className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}
