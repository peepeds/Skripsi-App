import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import { SkeletonCircle, SkeletonLine } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { submitCertificate } from "@/api/userApi";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInformationCard from "@/components/profile/PersonalInformationCard";
import AcademicDetailsCard from "@/components/profile/AcademicDetailsCard";
import CampusLocationCard from "@/components/profile/CampusLocationCard";
import CertificateModal from "@/components/profile/CertificateModal";
import CertificateCard from "@/components/profile/CertificateCard";

export default function Profile() {
  // Get user info and loading state from UserContext
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State for certificate modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // File upload hook
  const {
    selectedFile,
    fileName,
    setFileName,
    requestingUrl,
    uploading,
    compressing,
    result,
    handleFileChange,
    handleUpload: uploadToMinio,
  } = useFileUpload();
  
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2 space-y-4">
            <SkeletonLine height="h-40" />
          </div>
          <SkeletonLine height="h-24" />
          <SkeletonLine height="h-24" />
        </div>
      </div>
    );
  }

  // Main profile page with three sections: header, personal info, academic info, campus location
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProfileHeader user={user} onSubmitCertificate={() => setIsModalOpen(true)} />

      {/* ===== PROFILE INFORMATION CARDS ===== */}
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          <PersonalInformationCard user={user} />
          <AcademicDetailsCard user={user} />
          <CampusLocationCard user={user} />
          <CertificateCard user={user} />
        </div>
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
