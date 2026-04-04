import React, { useState, useEffect } from 'react';
import { User, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentReviews } from '@/api/reviewApi';

const RecentReviewCard = ({ testimony, createdBy, averageRating, companyName, companyWebsite, jobTitle }) => {
  const initials = createdBy ? createdBy.substring(0, 2).toUpperCase() : '';

  return (
    <div className="snap-start shrink-0 w-[420px] max-w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow h-auto">
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
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Reviews</h2>
            <p className="text-gray-500 text-sm">Cerita nyata dari mereka yang telah magang</p>
          </div>
          <a href="#" className="text-[#F97316] font-medium hover:underline text-sm flex items-center gap-1">
            Read more reviews <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="flex overflow-x-auto justify-between gap-6 snap-x snap-mandatory pb-4 -mx-1 px-1 custom-scrollbar">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-80">
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
