import { Container } from "@/components/layout/Container";

/**
 * ReviewHeroSection Component
 * ============================
 * Hero section untuk halaman review write
 * Styling sama dengan HeroSection di home page
 */
export function ReviewHeroSection({ company }) {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
          Tulis Review
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Bagikan pengalaman magang kamu untuk membantu teman-teman mahasiswa lainnya!
        </p>
      </Container>
    </section>
  );
}
