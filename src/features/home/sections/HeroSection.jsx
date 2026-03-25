import { SearchBar } from "@/components/common/SearchBar";

export function HeroSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
          Temukan Tempat magangmu
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Cari tahu tempat magang terbaik melalui ulasan mahasiswa
  dan tingkatkan pengalaman magangmu! 
        </p>

        <div className="flex">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
