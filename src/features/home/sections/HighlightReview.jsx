import React, { useState, useEffect } from 'react';
import { User, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentReviews } from '@/api/reviewApi';
import { getInitials } from '@/utils/avatar';

const RecentReviewCard = ({ testimony, createdBy, averageRating, companyName, jobTitle }) => {
  const initials = getInitials(createdBy);

  return (
    <div className="h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md lg:p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 font-bold text-lg">
            {initials || <User className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{createdBy || "Anonim"}</h4>
            <p className="text-slate-500 text-xs leading-tight mt-0.5">{jobTitle} di {companyName}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Magang</p>
          </div>
        </div>
        <div className="flex items-center bg-orange-50 px-2 py-1 rounded-md text-orange-600 font-bold text-sm">
          <Star className="w-3.5 h-3.5 fill-[#F97316] text-[#F97316] mr-1" />
          {averageRating?.toFixed(1).replace('.', ',')}
        </div>
      </div>
      <blockquote className="text-slate-700 text-sm leading-relaxed mt-4">
        "{testimony}"
      </blockquote>
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
    <section className="bg-slate-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-[2rem]">Recent Reviews</h2>
            <p className="text-sm text-slate-500 md:text-base">Cerita nyata dari mereka yang telah magang</p>
          </div>
          <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#F97316] transition hover:opacity-80 md:text-lg">
            Read more reviews <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-[250px] rounded-2xl" />
                </div>
              ))
            : reviews.map((review, i) => <RecentReviewCard key={i} {...review} />)
          }
        </div>
      </div>
    </section>
  );
}
