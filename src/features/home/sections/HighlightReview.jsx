import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/ui/StarRating';
import { useLogoValidation } from '@/features/companies/hooks/useLogoValidation';
import { getRecentReviews } from '@/api/reviewApi';

const RecentReviewCard = ({ testimony, createdBy, averageRating, companyName, companyCategory, companyWebsite, jobTitle }) => {
  const { logoUrl, logoValid } = useLogoValidation(companyWebsite);

  return (
    <div className="snap-start shrink-0 w-96 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-base text-gray-600">{createdBy}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-base font-semibold text-gray-900">{averageRating?.toFixed(1).replace('.', ',')}</span>
          <StarRating rating={averageRating} size="sm" />
        </div>
      </div>

      <div className="flex-1">
        <p className="font-semibold text-base text-gray-900 mb-1">{jobTitle}</p>
        <p className="text-sm leading-relaxed text-gray-600">{testimony}</p>
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 flex items-center gap-3 shrink-0">
        {logoValid === true ? (
          <img src={logoUrl} alt={companyName} className="h-7 w-auto max-w-[4rem] object-contain" />
        ) : (
          <div className="h-7 w-7 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-semibold text-xs shrink-0">
            {companyName?.charAt(0) || '?'}
          </div>
        )}
        <div>
          <p className="text-base font-medium text-gray-900">{companyName}</p>
          <p className="text-sm text-gray-500">{companyCategory}</p>
        </div>
      </div>
    </div>
  );
};

export function HighlightReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentReviews()
      .then(data => { if (data.success) setReviews(data.result.items); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Recent Reviews</h2>
          <a href="#" className="text-green-600 hover:underline text-sm">Baca review lengkap</a>
        </div>
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 -mx-1 px-1">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-96">
                  <Skeleton className="h-[300px] rounded-xl" />
                </div>
              ))
            : reviews.map((review, i) => <RecentReviewCard key={i} {...review} />)
          }
        </div>
      </div>
    </section>
  );
}
