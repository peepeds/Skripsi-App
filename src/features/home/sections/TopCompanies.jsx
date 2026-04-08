import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/ui/StarRating';
import { getTopRatedCompanies } from '@/api/companyApi';
import { CompanyLogo } from '@/components/common/CompanyLogo';

const TopCompanyCard = ({ companyName, companyAbbreviation, website, subcategoryName, rating, totalReviews, companySlug }) => {
  const reviewLabel = totalReviews === 1 ? 'review' : 'reviews';

  return (
    <Link to={`/company/${companySlug}`} className="group block h-full">
      <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <CompanyLogo
          website={website}
          companyName={companyName}
          companyAbbreviation={companyAbbreviation}
          className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 mb-5"
          fallbackClassName="bg-gray-50 text-gray-500 font-bold text-xl rounded"
          showSkeleton
        />
        <h3 className="mb-2 text-lg font-bold text-slate-900">{companyName}</h3>
        
        <div className="flex items-center gap-2 mb-5">
          <StarRating rating={rating} size="sm" className="text-[#F97316]" />
          <span className="text-sm font-bold text-slate-900">{rating?.toFixed(1).replace('.', ',')}</span>
          <span className="text-sm text-slate-400">({totalReviews} {reviewLabel})</span>
        </div>

        <div>
          <span className="inline-block px-3 py-1 border-gray-100 rounded-md text-xs font-medium bg-slate-50 text-slate-600">
            {subcategoryName}
          </span>
        </div>
      </div>
    </Link>
  );
};

export function TopCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopRatedCompanies()
      .then(data => { if (data.success) setCompanies(data.result); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-b border-slate-100 bg-slate-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-[2rem]">Top Reviewed Companies</h2>
            <p className="text-sm text-slate-500 md:text-base">Berdasarkan ulasan mahasiswa di seluruh Indonesia</p>
          </div>
          <Link to="/companies" className="flex items-center gap-1 text-sm font-semibold text-[#F97316] transition hover:opacity-80 md:text-lg">
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6">
                  <Skeleton className="mb-5 h-16 w-16 rounded-2xl" />
                  <Skeleton className="mb-2 h-6 w-2/3" />
                  <Skeleton className="mb-5 h-5 w-1/2" />
                  <Skeleton className="h-7 w-24 rounded-md" />
                </div>
              ))
            : companies.map(c => <TopCompanyCard key={c.companyId} {...c} />)
          }
        </div>
      </div>
    </section>
  );
}
