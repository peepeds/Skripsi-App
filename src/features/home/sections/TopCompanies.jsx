import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/ui/StarRating';
import { getTopRatedCompanies } from '@/api/companyApi';
import { useLogoValidation } from '@/features/companies/hooks/useLogoValidation';

const TopCompanyCard = ({ companyName, companyAbbreviation, website, subcategoryName, rating, totalReviews, companySlug }) => {
  const { logoUrl, logoValid } = useLogoValidation(website);
  const initial = companyAbbreviation?.charAt(0) || companyName?.charAt(0) || '?';
  const reviewLabel = totalReviews === 1 ? 'review' : 'reviews';

  return (
    <Link to={`/company/${companySlug}`} className="block snap-start shrink-0 w-80 group">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition duration-300">
        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 mb-5">
          {logoValid === true ? (
            <img src={logoUrl} alt={companyName} className="max-w-full max-h-full object-contain" />
          ) : logoValid === false ? (
            <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-500 font-bold text-xl rounded">
              {initial}
            </div>
          ) : (
            <Skeleton className="h-full w-full rounded" />
          )}
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{companyName}</h3>
        
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
    <section className="py-20 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Reviewed Companies</h2>
            <p className="text-gray-500 text-sm">Berdasarkan ulasan mahasiswa di seluruh Indonesia</p>
          </div>
          <Link to="/companies" className="text-[#F97316] font-medium hover:underline text-sm flex items-center gap-1">
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="flex overflow-x-auto justify-between gap-6 snap-x snap-mandatory pb-4 -mx-1 px-1 custom-scrollbar">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-80">
                  <Skeleton className="h-40 rounded-xl" />
                </div>
              ))
            : companies.map(c => <TopCompanyCard key={c.companyId} {...c} />)
          }
        </div>
      </div>
    </section>
  );
}
