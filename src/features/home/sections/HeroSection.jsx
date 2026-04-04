import { SearchBar } from "@/components/common/SearchBar";

export function HeroSection() {
  return (
    <section className="bg-white pt-16 pb-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-[1.15]">
            Temukan Tempat <br className="hidden md:block"/> Magang Impianmu
          </h1>
          <p className="text-gray-600 mb-8 text-base lg:text-lg leading-relaxed max-w-lg">
            Platform ulasan magang dari mahasiswa, untuk mahasiswa. Cari tahu tempat magang terbaik melalui ulasan mahasiswa dan tingkatkan pengalaman magangmu!
          </p>

          <div className="w-full max-w-md mb-6">
            <SearchBar />
          </div>

          {/* Popular Tags */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Populer:</span>
            <div className="flex flex-wrap gap-2">
              {['Tokopedia', 'Gojek', 'Traveloka'].map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative h-[600px] w-[130%] right-[-100px] -mt-16 -mb-16 -mr-12 opacity-100 overflow-hidden rounded-l-[100px]">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
            alt="Intern working on laptop" 
            className="w-full h-full object-cover object-left"
          />
        </div>
      </div>
    </section>
  );
}
