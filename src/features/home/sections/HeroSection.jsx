import { SearchBar } from "@/components/common/SearchBar";

export function HeroSection() {
  return (
    <section className="border-b border-slate-100 bg-white pt-12 pb-14 md:pt-16 md:pb-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl font-bold leading-[1.15] text-slate-900 md:text-5xl lg:mb-6">
            Temukan Tempat <br className="hidden md:block" /> Magang Impianmu
          </h1>
          <p className="mb-7 max-w-xl text-base leading-relaxed text-slate-600 lg:text-lg">
            Platform ulasan magang dari mahasiswa, untuk mahasiswa. Cari tahu tempat magang terbaik melalui ulasan mahasiswa dan tingkatkan pengalaman magangmu!
          </p>

          <div className="mb-5 w-full max-w-md">
            <SearchBar />
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Populer:</span>
            <div className="flex flex-wrap gap-2">
              {["Tokopedia", "Gojek", "Traveloka"].map((tag) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden h-[420px] overflow-hidden rounded-l-[80px] lg:block xl:h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3"
            alt="Intern working on laptop"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-white/70" />
        </div>
      </div>
    </section>
  );
}
