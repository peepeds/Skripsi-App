import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getCompaniesBySubcategory } from '@/api/companyApi';
import { CompanyCard } from '@/components/cards';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { BackButton } from '@/components/common/BackButton';

export const SubCategoryCompaniesPage = () => {
  const { subCategoryName: subCategoryNameParam } = useParams();
  const location = useLocation();
  const subCategoryName = location.state?.subCategoryName || decodeURIComponent(subCategoryNameParam) || 'Subcategory';
  const type = location.state?.type || 'companies';

  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompaniesBySubcategory(subCategoryName, type);
        if (data.success) {
          setCompanies(data.result || []);
          setMeta(data.meta);
        } else {
          setError(data.message || 'Failed to fetch companies');
        }
      } catch {
        setError('Error fetching companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [subCategoryName, type]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <BackButton variant="default" label="Back" className="mb-6" />
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <BackButton variant="default" label="Back" className="mb-6" />
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <BackButton variant="default" label="Back" className="mb-6" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{subCategoryName}</h1>
        {meta && (
          <p className="text-gray-600">
            {meta.totalElements} compan{meta.totalElements === 1 ? 'y' : 'ies'} found
          </p>
        )}
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No companies found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Link
              key={company.companyId}
              to={`/company/${company.companySlug}`}
              className="no-underline hover:no-underline"
            >
              <CompanyCard
                companyName={company.companyName}
                companyAbbreviation={company.companyAbbreviation}
                website={company.website}
                isPartner={company.isPartner}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
