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
    <Link to={`/company/${companySlug}`} className="block snap-start shrink-0 w-96">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow h-full">
        <div className="h-10 flex items-start mb-3">
          {logoValid === true ? (
            <img src={logoUrl} alt={companyName} className="h-8 w-auto max-w-[8rem] object-contain" />
          ) : logoValid === false ? (
            <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-semibold text-base">
              {initial}
            </div>
          ) : (
            <Skeleton className="h-8 w-16 rounded" />
          )}
        </div>
        <p className="font-semibold text-base text-gray-900 leading-snug mb-0.5">{companyName}</p>
        <p className="text-sm text-gray-500 mb-2">{subcategoryName}</p>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-base font-medium text-gray-900">{rating?.toFixed(1).replace('.', ',')}</span>
          <StarRating rating={rating} size="sm" />
          <span className="text-sm text-gray-500">· {totalReviews} {reviewLabel}</span>
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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Top Reviewed Companies</h2>
          <Link to="/companies" className="text-green-600 hover:underline text-sm">Lihat semua</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 -mx-1 px-1">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-96">
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
