import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { getCompaniesBySubcategory } from '@/api/companyApi';
import { CompanyCardHorizontal } from '@/features/companies/components/CompanyCardHorizontal';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { BackButton } from '@/components/common/BackButton';
import { Search, Building2, Star, BriefcaseBusiness, Handshake } from 'lucide-react';

export const SubCategoryCompaniesPage = () => {
  const { subCategoryName: subCategoryNameParam } = useParams();
  const location = useLocation();
  const subCategoryName = location.state?.subCategoryName || decodeURIComponent(subCategoryNameParam) || 'Subcategory';

  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCompaniesBySubcategory(subCategoryName, 'companies', 0, 80);
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
  }, [subCategoryName]);

  const stats = React.useMemo(() => {
    const totalCompanies = companies.length;
    const totalReviews = companies.reduce((sum, item) => sum + (item?.totalReviews || 0), 0);
    const ratings = companies
      .map((item) => item?.rating)
      .filter((value) => typeof value === 'number');
    const avgRating = ratings.length
      ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
      : '-';
    const partnerCount = companies.filter((item) => item?.isPartner).length;

    return { totalCompanies, totalReviews, avgRating, partnerCount };
  }, [companies]);

  const filteredCompanies = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return companies.filter((company) => {
      const textBlob = [
        company?.companyName,
        company?.companyAbbreviation,
        company?.subcategoryName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = keyword.length === 0 || textBlob.includes(keyword);

      if (!matchesSearch) return false;

      if (activeFilter === 'partner') return Boolean(company?.isPartner);
      if (activeFilter === 'top-rated') return typeof company?.rating === 'number' && company.rating >= 4;
      if (activeFilter === 'most-reviewed') return (company?.totalReviews || 0) >= 50;

      return true;
    });
  }, [companies, search, activeFilter]);

  const filterChips = [
    { key: 'all', label: 'Semua' },
    { key: 'top-rated', label: 'Rating 4.0+' },
    { key: 'most-reviewed', label: 'Paling banyak review' },
    { key: 'partner', label: 'Partner' },
  ];

  if (loading) {
    return (
      <div className="bg-slate-50 py-10">
        <Container>
          <BackButton variant="default" label="Back" className="mb-6" />
          <Skeleton className="mb-4 h-10 w-72" />
          <Skeleton className="mb-8 h-5 w-96" />
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[186px] rounded-2xl" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 py-10">
        <Container>
        <BackButton variant="default" label="Back" className="mb-6" />
        <ErrorMessage message={error} />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-10 md:py-12">
      <Container>
        <BackButton variant="default" label="Back to Categories" className="mb-6" />

        <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 p-6 shadow-sm md:p-8">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-orange-300">Subcategory Detail</p>
          <h1 className="mt-2 font-plus-jakarta text-3xl font-bold tracking-[-0.03em] text-white md:text-[40px]">{subCategoryName}</h1>
          <p className="mt-3 max-w-2xl font-inter text-sm leading-6 text-slate-200 md:text-base">
            Temukan perusahaan terbaik di subcategory ini, bandingkan rating, dan baca review magang untuk menentukan pilihan yang tepat.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Building2 className="h-4 w-4" />
            </div>
            <p className="font-plus-jakarta text-2xl font-bold text-slate-900">{stats.totalCompanies}</p>
            <p className="font-inter text-xs text-slate-500">Total Companies</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
            <p className="font-plus-jakarta text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
            <p className="font-inter text-xs text-slate-500">Total Reviews</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Star className="h-4 w-4" />
            </div>
            <p className="font-plus-jakarta text-2xl font-bold text-slate-900">{stats.avgRating}</p>
            <p className="font-inter text-xs text-slate-500">Average Rating</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Handshake className="h-4 w-4" />
            </div>
            <p className="font-plus-jakarta text-2xl font-bold text-slate-900">{stats.partnerCount}</p>
            <p className="font-inter text-xs text-slate-500">Partner Companies</p>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari perusahaan..."
              className="h-10 rounded-xl border-slate-200 bg-white pl-10 font-inter text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setActiveFilter(chip.key)}
                className={`rounded-full border px-3 py-1.5 font-inter text-xs font-semibold transition ${
                  activeFilter === chip.key
                    ? 'border-orange-200 bg-orange-500 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 font-inter text-sm text-slate-500">
          Showing {filteredCompanies.length} of {meta?.totalElements ?? companies.length} companies
        </p>

        {filteredCompanies.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
            <p className="font-inter text-base text-slate-500">Tidak ada perusahaan yang cocok dengan filter saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCardHorizontal
                key={company.companyId}
                companyName={company.companyName}
                companyAbbreviation={company.companyAbbreviation}
                website={company.website}
                isPartner={company.isPartner}
                companySlug={company.companySlug}
                subcategoryName={company.subcategoryName}
                rating={company.rating}
                totalReviews={company.totalReviews}
              />
            ))}
          </div>
        )}
      </Container>
      </div>
    );
};
