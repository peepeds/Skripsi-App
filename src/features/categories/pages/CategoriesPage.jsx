import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories } from '@/api/categoryApi';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data.success) {
          setCategories(data.result);
        } else {
          setError(data.message || 'Failed to fetch categories');
        }
      } catch (err) {
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderSkeletonCard = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2 mb-2" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-9 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>{renderSkeletonCard()}</div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.categoryId} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{category.categoryName}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Subcategories:</h3>
              <ul className="list-disc list-inside space-y-1">
                {category.subCategories.map((sub) => (
                  <li key={sub.subCategoryId} className="text-sm">{sub.subCategoryName}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};