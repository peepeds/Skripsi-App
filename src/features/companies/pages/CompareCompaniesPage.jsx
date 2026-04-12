import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareCompanies } from "../hooks/useCompareCompanies";
import { ComparisonDataGrid } from "../components/ComparisonDataGrid";
import { CompanySelectModal } from "../components/CompanySelectModal";
import { ArrowLeft, ArrowLeftRight, Star } from "lucide-react";

const formatDifficulty = (difficulty) => {
  if (!difficulty || difficulty.rating === null || difficulty.rating === undefined) return "-";
  const count = difficulty.count ?? 0;
  return `${difficulty.rating.toFixed(1)} / 5.0 (${count} reviews)`;
};

const formatObjectEntries = (value) => {
  if (!value || typeof value !== "object") return "-";

  const entries = Object.entries(value);
  if (entries.length === 0) return "-";

  return entries.map(([key, val]) => `${key}: ${val}`).join(" | ");
};

const SectionCard = ({ title, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] md:p-6">
    <h2 className="mb-4 font-plus-jakarta text-[24px] font-bold text-slate-900">{title}</h2>
    {children}
  </div>
);

const CompanyHeader = ({ data }) => {
  const company = data?.company;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <CompanyLogo
          website={company?.website}
          companyName={company?.companyName}
          companyAbbreviation={company?.companyAbbreviation}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white"
          imgClassName="h-11 w-11 object-contain"
          fallbackClassName="text-xl font-bold text-slate-600"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-plus-jakarta text-[26px] font-bold text-slate-900">
            {company?.companyName || "Unknown Company"}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{company?.subcategoryName || "No category"}</span>
            <span>{company?.totalReviews || 0} reviews</span>
          </div>
        </div>

        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-inter text-sm font-semibold text-slate-800">
          <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
          {company?.rating !== null && company?.rating !== undefined
            ? company.rating.toFixed(1)
            : "-"}
        </div>
      </div>
    </div>
  );
};

const CompareLoading = () => (
  <Container className="py-10">
    <div className="space-y-4">
      <Skeleton className="h-7 w-52" />
      <Skeleton className="h-10 w-96" />
      <Skeleton className="h-6 w-[500px]" />
    </div>
    <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-14 w-14 rounded-xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
    <div className="mt-6 space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <Skeleton key={item} className="h-52 rounded-2xl" />
      ))}
    </div>
  </Container>
);

export const CompareCompaniesPage = () => {
  const navigate = useNavigate();
  const { leftCompanySlug, rightCompanySlug } = useParams();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const isInvalidComparePair = !leftCompanySlug || !rightCompanySlug || leftCompanySlug === rightCompanySlug;

  const { leftCompanyData, rightCompanyData, loading, error } = useCompareCompanies(
    leftCompanySlug,
    rightCompanySlug
  );

  const internshipRows = useMemo(() => {
    const leftInfo = leftCompanyData?.internshipInformation;
    const rightInfo = rightCompanyData?.internshipInformation;

    return [
      {
        key: "workScheme",
        label: "Work Scheme",
        leftValue: leftInfo?.workScheme?.join(", "),
        rightValue: rightInfo?.workScheme?.join(", "),
      },
      {
        key: "duration",
        label: "Avg. Duration",
        leftValue: leftInfo?.duration,
        rightValue: rightInfo?.duration,
      },
      {
        key: "popularCategories",
        label: "Popular Categories",
        leftValue: leftInfo?.subCategories?.join(", "),
        rightValue: rightInfo?.subCategories?.join(", "),
      },
      {
        key: "internshipType",
        label: "Internship Type",
        leftValue: leftInfo?.type,
        rightValue: rightInfo?.type,
      },
    ];
  }, [leftCompanyData, rightCompanyData]);

  const ratingRows = useMemo(() => {
    const leftRatings = leftCompanyData?.ratings;
    const rightRatings = rightCompanyData?.ratings;

    return [
      { key: "workCulture", label: "Work Culture", leftValue: leftRatings?.workCulture?.toFixed(1), rightValue: rightRatings?.workCulture?.toFixed(1) },
      { key: "learningOpp", label: "Learning Opportunity", leftValue: leftRatings?.learningOpp?.toFixed(1), rightValue: rightRatings?.learningOpp?.toFixed(1) },
      { key: "mentorship", label: "Mentorship", leftValue: leftRatings?.mentorship?.toFixed(1), rightValue: rightRatings?.mentorship?.toFixed(1) },
      { key: "benefit", label: "Benefit", leftValue: leftRatings?.benefit?.toFixed(1), rightValue: rightRatings?.benefit?.toFixed(1) },
      { key: "workLifeBalance", label: "Work-Life Balance", leftValue: leftRatings?.workLifeBalance?.toFixed(1), rightValue: rightRatings?.workLifeBalance?.toFixed(1) },
    ];
  }, [leftCompanyData, rightCompanyData]);

  const difficultyRows = useMemo(
    () => [
      {
        key: "averageDifficulty",
        label: "Average Difficulty",
        leftValue: formatDifficulty(leftCompanyData?.difficulty),
        rightValue: formatDifficulty(rightCompanyData?.difficulty),
      },
    ],
    [leftCompanyData, rightCompanyData]
  );

  const recruitmentRows = useMemo(() => {
    const leftStatistics = leftCompanyData?.recruitmentStatistics;
    const rightStatistics = rightCompanyData?.recruitmentStatistics;

    return [
      {
        key: "admissionTrack",
        label: "Popular Admission Track",
        leftValue: formatObjectEntries(leftStatistics?.admissionTrack),
        rightValue: formatObjectEntries(rightStatistics?.admissionTrack),
      },
      {
        key: "recruitmentDuration",
        label: "Recruitment Duration",
        leftValue: leftStatistics?.recruitmentDuration,
        rightValue: rightStatistics?.recruitmentDuration,
      },
      {
        key: "frequentSelectionProcess",
        label: "Frequent Selection Process",
        leftValue: formatObjectEntries(leftStatistics?.frequentSelectionProcess),
        rightValue: formatObjectEntries(rightStatistics?.frequentSelectionProcess),
      },
    ];
  }, [leftCompanyData, rightCompanyData]);

  if (isInvalidComparePair) {
    return (
      <Container className="py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-plus-jakarta text-3xl font-bold text-red-700">Invalid compare pair</h1>
          <p className="mt-2 text-sm text-red-600">
            Please select two different companies to compare.
          </p>
          <Button onClick={() => navigate("/companies")} className="mt-5 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
            Back To Companies
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return <CompareLoading />;
  }

  if (error || !leftCompanyData || !rightCompanyData) {
    return (
      <Container className="py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-plus-jakarta text-3xl font-bold text-red-700">Failed to compare companies</h1>
          <p className="mt-2 text-sm text-red-600">{error || "Comparison data is unavailable."}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl border-red-300 text-red-700 hover:bg-red-100">
              Go Back
            </Button>
            <Button onClick={() => navigate(`/company/${leftCompanySlug}`)} className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
              Open {leftCompanyData?.company?.companyName || "Company"}
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-7 md:py-9">
        <Container>
          <div className="space-y-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/company/${leftCompanySlug}`)}
              className="-ml-3 h-9 rounded-xl px-3 text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {leftCompanyData.company.companyAbbreviation || "company"}
            </Button>

            <h1 className="font-plus-jakarta text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-slate-900 md:text-[36px] lg:text-[38px]">
              Compare Companies
            </h1>
            <p className="font-inter text-base text-slate-600">
              {leftCompanyData.company.companyName} vs {rightCompanyData.company.companyName}: Compare internship experiences between two companies.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-7">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPickerOpen(true)}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            Choose Different Company
          </Button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-6">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <CompanyHeader data={leftCompanyData} />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate(`/compare/${rightCompanySlug}/${leftCompanySlug}`)}
                className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-100"
                aria-label="Swap compared company positions"
                title="Swap companies"
              >
                <ArrowLeftRight className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            <CompanyHeader data={rightCompanyData} />
          </div>

          <SectionCard title="Internship Information">
            <ComparisonDataGrid
              rows={internshipRows}
              leftLabel={leftCompanyData.company.companyAbbreviation || "Left"}
              rightLabel={rightCompanyData.company.companyAbbreviation || "Right"}
            />
          </SectionCard>

          <SectionCard title="Reviews Rating">
            <ComparisonDataGrid
              rows={ratingRows}
              leftLabel={leftCompanyData.company.companyAbbreviation || "Left"}
              rightLabel={rightCompanyData.company.companyAbbreviation || "Right"}
            />
          </SectionCard>

          <SectionCard title="Average Difficulty">
            <ComparisonDataGrid
              rows={difficultyRows}
              leftLabel={leftCompanyData.company.companyAbbreviation || "Left"}
              rightLabel={rightCompanyData.company.companyAbbreviation || "Right"}
            />
          </SectionCard>

          <SectionCard title="Recruitment Process">
            <ComparisonDataGrid
              rows={recruitmentRows}
              leftLabel={leftCompanyData.company.companyAbbreviation || "Left"}
              rightLabel={rightCompanyData.company.companyAbbreviation || "Right"}
            />
          </SectionCard>
        </div>
      </Container>

      <CompanySelectModal
        open={isPickerOpen}
        currentCompanySlug={leftCompanySlug}
        onClose={() => setIsPickerOpen(false)}
        onCompare={(selectedSlug) => navigate(`/compare/${leftCompanySlug}/${selectedSlug}`)}
      />
    </>
  );
};
