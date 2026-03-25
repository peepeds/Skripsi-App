import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { getCategories } from '@/api/categoryApi';
import {
  PawPrint,
  Mic,
  Sofa,
  UtensilsCrossed,
  Sparkles,
  Home,
  ShoppingBag,
  Briefcase,
  Car,
  Heart,
  GraduationCap,
  Wrench,
  Tag,
} from 'lucide-react';

const COLORS = [
  { bg: 'bg-yellow-100', text: 'text-yellow-900' },
  { bg: 'bg-pink-100', text: 'text-pink-900' },
  { bg: 'bg-green-100', text: 'text-green-900' },
  { bg: 'bg-orange-100', text: 'text-orange-900' },
  { bg: 'bg-blue-100', text: 'text-blue-900' },
  { bg: 'bg-purple-100', text: 'text-purple-900' },
  { bg: 'bg-teal-100', text: 'text-teal-900' },
  { bg: 'bg-rose-100', text: 'text-rose-900' },
];

const CATEGORY_ICONS = {
  'Animals & Pets': PawPrint,
  'Events & Entertainment': Mic,
  'Home & Garden': Sofa,
  'Restaurants & Bars': UtensilsCrossed,
  'Beauty & Well-being': Sparkles,
  'Food, Beverages & Tobacco': UtensilsCrossed,
  'Home Services': Home,
  'Shopping': ShoppingBag,
  'Professional Services': Briefcase,
  'Automotive': Car,
  'Health & Medical': Heart,
  'Education': GraduationCap,
  'Repair & Construction': Wrench,
};

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
    <div className="bg-gray-100 flex flex-col items-center justify-center py-8 px-4 gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-28" />
    </div>
    <div className="bg-white divide-y divide-gray-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('companies');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        const data = await getCategories(type);

        const elapsed = Date.now() - startTime;
        if (elapsed < 300) {
          await new Promise(resolve => setTimeout(resolve, 300 - elapsed));
        }

        if (data.success) {
          setCategories(data.result);
        } else {
          setError(data.message || 'Failed to fetch categories');
        }
      } catch {
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [type]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-9 w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {type === 'jobs' ? 'Explore Jobs by category' : 'Explore Companies by category'}
          </h1>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <Toggle
              pressed={type === 'jobs'}
              onPressedChange={(pressed) => pressed && setType('jobs')}
              className="data-[state=on]:bg-white data-[state=on]:shadow-sm"
            >
              Jobs
            </Toggle>
            <Toggle
              pressed={type === 'companies'}
              onPressedChange={(pressed) => pressed && setType('companies')}
              className="data-[state=on]:bg-white data-[state=on]:shadow-sm"
            >
              Companies
            </Toggle>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const { bg, text } = COLORS[index % COLORS.length];
            const Icon = CATEGORY_ICONS[category.categoryName] ?? Tag;

            return (
              <div
                key={category.categoryId}
                className="rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className={`${bg} ${text} flex flex-col items-center justify-center py-8 px-4 gap-2`}>
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                  <span className="font-semibold text-center text-sm leading-snug">
                    {category.categoryName}
                  </span>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {category.subCategories.map((sub) => (
                    <div
                      key={sub.subCategoryId}
                      onClick={() =>
                        navigate(`/subcategory/${sub.subCategoryId}/companies`, {
                          state: { subCategoryName: sub.subCategoryName },
                        })
                      }
                      className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-orange-50 hover:text-orange-700 transition-colors"
                    >
                      {sub.subCategoryName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
