import { SearchBar } from "@/components/SearchBar";

export function HeroSection() {
  return (
    <section className="text-center py-24 px-6 bg-gray-50">
      <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
        Temukan pengalaman magang yang nyata sebelum kamu mendaftar.
      </h1>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Baca ulasan jujur dari mahasiswa dan alumni tentang program magang di
        berbagai perusahaan.
      </p>

      {/* Integrasi SearchBar kamu di sini */}
      <div className="flex justify-center">
        <SearchBar />
      </div>
    </section>
  );
}
