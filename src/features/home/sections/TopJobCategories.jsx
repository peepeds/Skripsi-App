import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopCategories } from '@/api/categoryApi';

export function TopJobCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopCategories()
      .then(data => {
        if (data.success && data.result?.length > 0) {
          setCategories(data.result);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-b border-slate-100 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-[2rem]">Top Job Categories</h2>
            <p className="text-sm text-slate-500 md:text-base">Eksplorasi magang berdasarkan bidang studimu</p>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-sm font-semibold text-[#F97316] transition hover:opacity-80 md:text-lg">
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 text-left">
                  <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            : categories.map((cat, i) => (
                <Link
                  key={i}
                  to={`/subcategory${cat.url}`}
                  state={{ subCategoryName: cat.subcategoryName, type: 'jobs' }}
                  className="flex cursor-pointer items-center rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md lg:p-6"
                >
                  <div className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 lg:mr-5 lg:h-14 lg:w-14">
                    <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 text-lg font-bold text-slate-900">{cat.subcategoryName}</h3>
                    <p className="text-sm text-slate-500">{cat.totalReviews}+ reviews</p>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </section>
  );
}
