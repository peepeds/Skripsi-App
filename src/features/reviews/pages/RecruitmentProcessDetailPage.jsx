import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BackButton } from "@/components/common/BackButton";
import { RecruitmentProcessCard } from "@/features/companies/components/RecruitmentProcessCard";
import { getCompanyRecruitmentProcess } from "@/api/reviewApi";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

export const RecruitmentProcessDetailPage = () => {
  const { companySlug, internshipDetailId } = useParams();
  const [processItem, setProcessItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!internshipDetailId) return;

    const fetchProcessDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCompanyRecruitmentProcess(companySlug, { limit: 200 });
        const { success, message, data } = handleApiResponse(response);

        if (!success) {
          setError(message || "Gagal memuat detail recruitment process");
          return;
        }

        const list = Array.isArray(data) ? data : [];
        const foundProcess = list.find((item) => {
          const detailId = item?.internshipDetailId ?? item?.id ?? item?.detailId;
          return String(detailId) === String(internshipDetailId);
        });

        setProcessItem(foundProcess ?? null);
      } catch (err) {
        setError(normalizeErrorMessage(err, "Gagal memuat detail recruitment process"));
      } finally {
        setLoading(false);
      }
    };

    fetchProcessDetail();
  }, [companySlug, internshipDetailId]);

  return (
    <Container className="py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <BackButton variant="default" />
        <h1 className="font-plus-jakarta text-xl font-bold text-slate-900 md:text-2xl">
          Recruitment Process Detail
        </h1>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && !processItem && (
        <ErrorMessage message="Recruitment process tidak ditemukan." />
      )}

      {!loading && !error && processItem && (
        <RecruitmentProcessCard data={processItem} companySlug={companySlug} />
      )}
    </Container>
  );
};
