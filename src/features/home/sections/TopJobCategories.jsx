import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories } from '@/api/categoryApi';

const DEFAULT_ICONS = [
  <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />,
  <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />,
  <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />,
  <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />,
  <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />,
  <BriefcaseBusiness className="w-6 h-6 text-[#F97316]" />,
];

export function TopJobCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempting to fetch categories, falling back to dummy if empty layout
    getCategories('jobs')
      .then(data => {
        if (data.success && data.result?.length > 0) {
          setCategories(data.result.slice(0, 6)); // Top 6
        } else {
          // Use mocked data for layout
          setCategories([
            { id: 1, name: 'Software Development', reviews: 500, slug: 'software-development' },
            { id: 2, name: 'Design', reviews: 400, slug: 'design' },
            { id: 3, name: 'Marketing & Sales', reviews: 300, slug: 'marketing-sales' },
            { id: 4, name: 'Business Strategy', reviews: 200, slug: 'business-strategy' },
            { id: 5, name: 'Data & Analytics', reviews: 100, slug: 'data-analytics' },
            { id: 6, name: 'Finance & Accounting', reviews: 50, slug: 'finance-accounting' },
          ]);
        }
      })
      .catch(() => {
        // Mock if error to maintain layout
        setCategories([
            { id: 1, name: 'Software Development', reviews: 500, slug: 'software-development' },
            { id: 2, name: 'Design', reviews: 400, slug: 'design' },
            { id: 3, name: 'Marketing & Sales', reviews: 300, slug: 'marketing-sales' },
            { id: 4, name: 'Business Strategy', reviews: 200, slug: 'business-strategy' },
            { id: 5, name: 'Data & Analytics', reviews: 100, slug: 'data-analytics' },
            { id: 6, name: 'Finance & Accounting', reviews: 50, slug: 'finance-accounting' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between flex-wrap gap-4 items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Job Categories</h2>
            <p className="text-gray-500 text-sm">Eksplorasi magang berdasarkan bidang studimu</p>
          </div>
          <Link to="/categories" className="text-[#F97316] font-medium hover:underline text-sm flex items-center gap-1">
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border text-left p-6 rounded-2xl">
                  <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            : categories.map((cat, i) => (
                <Link key={cat.id || i} to={`/categories/${cat.slug}`} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-row items-center cursor-pointer transition hover:shadow-md">
                  <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 mr-5">
                    {DEFAULT_ICONS[i] || <BriefcaseBusiness className="w-6 h-6 text-[#ea580c]" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.name}</h3>
                    <p className="text-gray-500 text-sm">{cat.reviews || '10+'}+ reviews</p>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </section>
  );
}