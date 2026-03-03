import { useCallback, useEffect, useMemo, useState } from "react";
import {
  approveCompanyRequest,
  getCompanyRequest,
  rejectCompanyRequest,
} from "@/api/companyApi";
import { getCertificateRequest } from "@/api/certificateApi";
import { markAsRead } from "@/api/inboxApi";
import { getAuditLog } from "@/api/auditApi";
import { toast } from "sonner";
import { buildActivityTimeline } from "@/features/inbox/utils/activityLog";

export const useInboxDetail = ({ id, type, user, userLoading, navigate }) => {
  const [requestData, setRequestData] = useState(null);
  const [reviewInformation, setReviewInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [auditLog, setAuditLog] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchRequestData = useCallback(async () => {
    setLoading(true);

    try {
      let result;
      if (type === "COMPANY_REQUEST") {
        result = await getCompanyRequest(id);
      } else if (type === "UPLOAD_CERTIFICATES") {
        result = await getCertificateRequest(id);
      } else {
        throw new Error("Unsupported request type");
      }

      if (result.data?.success) {
        setRequestData(result.data.result.requestDetails);
        setReviewInformation(result.data.result.reviewInformation);

        try {
          // Note: markAsRead should use inboxId, but we don't have it here
          // For now, skip marking as read
          // await markAsRead(inboxId);
        } catch (error) {
          console.log("Could not mark as read:", error);
        }
      } else {
        toast.error(result.data?.message || "Failed to fetch inbox details");
      }
    } catch (error) {
      console.error("Error fetching inbox details:", error);
      toast.error("An error occurred while fetching inbox details");
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  const fetchAuditTrail = useCallback(async () => {
    setAuditLoading(true);

    try {
      const auditType = type;
      const result = await getAuditLog(auditType, id);
      if (result.data?.success) {
        setAuditLog(result.data.result || []);
      } else {
        setAuditLog([]);
      }
    } catch (error) {
      console.error("Error fetching audit log:", error);
      setAuditLog([]);
    } finally {
      setAuditLoading(false);
    }
  }, [id, type]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchRequestData(), fetchAuditTrail()]);
  }, [fetchRequestData, fetchAuditTrail]);

  const handleApprove = useCallback(async () => {
    if (type !== "COMPANY_REQUEST") {
      toast.error("Approve action not supported for this request type");
      return;
    }

    setActionLoading(true);

    try {
      const result = await approveCompanyRequest(id, reviewNote);
      if (result.data?.success) {
        toast.success("Request approved successfully");
        setReviewNote("");
        await refreshAll();
      } else {
        toast.error(result.data?.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("An error occurred while approving request");
    } finally {
      setActionLoading(false);
    }
  }, [id, refreshAll, reviewNote, type]);

  const handleReject = useCallback(async () => {
    if (type !== "COMPANY_REQUEST") {
      toast.error("Reject action not supported for this request type");
      return;
    }

    setActionLoading(true);

    try {
      const result = await rejectCompanyRequest(id, reviewNote);
      if (result.data?.success) {
        toast.success("Request rejected");
        setReviewNote("");
        await refreshAll();
      } else {
        toast.error(result.data?.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("An error occurred while rejecting request");
    } finally {
      setActionLoading(false);
    }
  }, [id, refreshAll, reviewNote, type]);

  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (id && type) {
      refreshAll();
    }
  }, [id, type, navigate, refreshAll, user, userLoading]);

  const timeline = useMemo(
    () => buildActivityTimeline(auditLog, requestData, reviewInformation),
    [auditLog, requestData, reviewInformation],
  );

  return {
    requestData,
    reviewInformation,
    loading,
    actionLoading,
    reviewNote,
    setReviewNote,
    auditLoading,
    timeline,
    handleApprove,
    handleReject,
  };
};
