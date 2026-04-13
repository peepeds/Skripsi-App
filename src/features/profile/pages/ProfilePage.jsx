import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import { SkeletonCircle, SkeletonLine } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getMyReviews, getSavedCompanies, submitCertificate } from "@/api/userApi";
import { unsaveCompany } from "@/api/companyApi";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInformationCard } from "@/components/profile/PersonalInformationCard";
import { AcademicDetailsCard } from "@/components/profile/AcademicDetailsCard";
import { CampusLocationCard } from "@/components/profile/CampusLocationCard";
import { CertificateModal } from "@/components/profile/CertificateModal";
import { CertificateCard } from "@/components/profile/CertificateCard";
import { RecentReviewsCard } from "@/components/profile/RecentReviewsCard";
import { SavedCompaniesCard } from "@/components/profile/SavedCompaniesCard";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const getCompanySlug = (company) =>
  company?.companySlug ?? company?.slug ?? company?.company?.companySlug;

export function ProfilePage() {
  // Get user info and loading state from UserContext
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State for certificate modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentReviews, setRecentReviews] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [recentUnavailable, setRecentUnavailable] = useState(false);
  const [savedError, setSavedError] = useState(null);
  const [unsaveLoadingSlug, setUnsaveLoadingSlug] = useState(null);
  
  // File upload hook
  const {
    selectedFile,
    fileName,
    setFileName,
    requestingUrl,
    uploading,
    compressing,
    handleFileChange,
    handleUpload: uploadToMinio,
  } = useFileUpload();

  useEffect(() => {
    if (!user) return;

    const fetchProfileHistories = async () => {
      setHistoryLoading(true);
      setHistoryError(null);
      setRecentUnavailable(false);
      setSavedError(null);
      setRecentReviews([]);

      try {
        const [reviewsResult, savedResult] = await Promise.allSettled([
          getMyReviews(),
          getSavedCompanies(),
        ]);

        if (reviewsResult.status === "fulfilled") {
          const parsedReviews = handleApiResponse(reviewsResult.value);
          if (parsedReviews.success) {
            setRecentReviews(normalizeList(parsedReviews.data));
          } else {
            const reviewsMessage = parsedReviews.message || "Gagal memuat riwayat review";
            if (reviewsMessage.includes("No endpoint GET /user/my-reviews")) {
              setRecentUnavailable(true);
            } else {
              setHistoryError(reviewsMessage);
            }
          }
        } else {
          const reviewsMessage = normalizeErrorMessage(
            reviewsResult.reason,
            "Gagal memuat riwayat review"
          );
          if (reviewsMessage.includes("No endpoint GET /user/my-reviews")) {
            setRecentUnavailable(true);
          } else {
            setHistoryError(reviewsMessage);
          }
        }

        if (savedResult.status === "fulfilled") {
          const parsedSaved = handleApiResponse(savedResult.value);
          if (!parsedSaved.success) {
            setSavedError(parsedSaved.message || "Gagal memuat perusahaan tersimpan");
          } else {
            setSavedCompanies(normalizeList(parsedSaved.data));
          }
        } else {
          setSavedError(
            normalizeErrorMessage(savedResult.reason, "Gagal memuat perusahaan tersimpan")
          );
        }
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchProfileHistories();
  }, [user]);

  const handleUnsaveFromProfile = async (company) => {
    const companySlug = getCompanySlug(company);

    if (!companySlug) {
      toast.error("Slug company tidak ditemukan untuk proses unsave");
      return;
    }

    setUnsaveLoadingSlug(companySlug);
    try {
      const response = await unsaveCompany(companySlug);
      const { success, message } = handleApiResponse(response);

      if (!success) {
        toast.error(message || "Gagal menghapus simpanan company");
        return;
      }

      setSavedCompanies((prev) => prev.filter((item) => getCompanySlug(item) !== companySlug));
      toast.success("Company berhasil dihapus dari simpanan");
    } catch (error) {
      toast.error(normalizeErrorMessage(error, "Gagal menghapus simpanan company"));
    } finally {
      setUnsaveLoadingSlug(null);
    }
  };
  
  // Handle certificate submission
  const handleSubmitCertificate = async (data) => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    
    console.log("Starting certificate submission...");
    
    try {
      // First upload file to MinIO and get result
      console.log("Uploading to MinIO...");
      const uploadResult = await uploadToMinio();
      console.log("Upload result:", uploadResult);
      
      // Check if upload was successful
      // if (!uploadResult || !uploadResult.publicUrl) {
      //   console.error("Upload failed:", uploadResult);
      //   toast.error("Failed to upload file to MinIO");
      //   return;
      // }

      console.log("Upload successful, publicUrl:", uploadResult.publicUrl);

      // Submit certificate with MinIO URL
      const certificateData = {
        issuer: data.issuer,
        certificateUrl: uploadResult.presignedResponse.result.fileName,
        certificateName: data.certificateName,
        fileSize: selectedFile?.size || 0,
      };

      console.log("Submitting certificate data:", certificateData);

      const submitResponse = await submitCertificate(certificateData);
      console.log("Submit response:", submitResponse);

      if (submitResponse.data.success) {
        toast.success("Certificate submitted successfully");
        setIsModalOpen(false);
      } else {
        toast.error(submitResponse.data.message || "Failed to submit certificate");
      }
    } catch (error) {
      console.error("Error in handleSubmitCertificate:", error);
      toast.error("An error occurred while submitting certificate");
    }
  };

  // Protect route: redirect to login if not authenticated
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  // Show animated skeleton while fetching user data
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <SkeletonCircle size={80} className="shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine height="h-6" width="w-1/3" />
              <SkeletonLine height="h-4" width="w-1/4" />
            </div>
          </div>
          <Separator />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-3">
            <SkeletonLine height="h-40" />
          </div>
          <SkeletonLine height="h-24" />
          <SkeletonLine height="h-24" />
          <div className="lg:col-span-3">
            <SkeletonLine height="h-28" />
          </div>
        </div>
      </div>
    );
  }

  // Main profile page with three sections: header, personal info, academic info, campus location
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <ProfileHeader user={user} onSubmitCertificate={() => setIsModalOpen(true)} />

      {/* ===== PROFILE INFORMATION CARDS ===== */}
      <div>
        <div className="grid gap-5 lg:grid-cols-3">
          <PersonalInformationCard user={user} />
          <AcademicDetailsCard user={user} />
          <CampusLocationCard user={user} />
          <CertificateCard user={user} />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <RecentReviewsCard
          reviews={recentReviews}
          loading={historyLoading}
          error={historyError}
          unavailable={recentUnavailable}
        />
        <SavedCompaniesCard
          companies={savedCompanies}
          loading={historyLoading}
          error={savedError}
          onUnsave={handleUnsaveFromProfile}
          unsaveLoadingSlug={unsaveLoadingSlug}
        />
      </div>

      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitCertificate}
        selectedFile={selectedFile}
        fileName={fileName}
        setFileName={setFileName}
        handleFileChange={handleFileChange}
        compressing={compressing}
        requestingUrl={requestingUrl}
        uploading={uploading}
      />
    </div>
  );
}