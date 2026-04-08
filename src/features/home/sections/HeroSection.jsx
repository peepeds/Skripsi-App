import { SearchBar } from "@/components/common/SearchBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-white py-6 md:py-8 lg:py-0">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52vw] lg:block">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1800&ixlib=rb-4.0.3"
          alt="Intern working on laptop"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-white" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex min-h-[420px] items-center md:min-h-[460px] lg:min-h-[560px]">
          <div className="w-full max-w-[640px] py-2 lg:w-[52%] lg:py-10">
              <h1 className="font-plus-jakarta mb-4 text-[34px] font-bold leading-[1.15] tracking-[-0.015em] text-slate-900 md:text-[42px]">
              Temukan Tempat <br className="hidden md:block" /> Magang Impianmu
            </h1>
            <p className="font-inter mb-7 max-w-[590px] text-[15px] leading-[1.65] text-slate-600 md:text-[17px]">
              Platform ulasan magang dari mahasiswa, untuk mahasiswa. Cari tahu tempat magang terbaik melalui ulasan mahasiswa dan tingkatkan pengalaman magangmu!
            </p>

            <div className="mb-5 w-full max-w-[640px]">
              <SearchBar />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="font-inter text-sm font-semibold text-slate-500">Populer:</span>
              <div className="flex flex-wrap gap-2">
                {["Tokopedia", "Gojek", "Traveloka"].map((tag) => (
                  <span
                    key={tag}
                    className="font-inter cursor-pointer rounded-full bg-slate-100 px-4 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
