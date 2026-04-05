import { Logo } from "@/components/common";

export function Footer() {
  return (
    <footer className="bg-[#232B38] text-white py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 pr-0 md:pr-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Intern<span className="text-[#F97316]">View</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
              Platform ulasan magang untuk mahasiswa BINUS University. Temukan pengalaman magang terbaikmu.
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="/categories" className="hover:text-white transition">Categories</a></li>
              <li><a href="/companies" className="hover:text-white transition">Companies</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Need Help?</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
          &copy; 2026 InternView. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
