import { useCallback, useState } from "react";
import { getInbox } from "@/api/inboxApi";

export const useInboxNotifications = () => {
  const [inboxData, setInboxData] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const fetchInbox = useCallback(async () => {
    if (inboxData.length > 0) {
      return;
    }

    setInboxLoading(true);
    try {
      const result = await getInbox();
      if (result.data?.success) {
        setInboxData(result.data.result || []);
      } else {
        setInboxData([]);
      }
    } catch (error) {
      console.error("Failed to fetch inbox:", error);
      setInboxData([]);
    } finally {
      setInboxLoading(false);
    }
  }, [inboxData.length]);

  const handleOpenChange = useCallback(
    (open) => {
      setIsInboxOpen(open);
      if (open) {
        fetchInbox();
      }
    },
    [fetchInbox],
  );

  return {
    inboxData,
    inboxLoading,
    isInboxOpen,
    handleOpenChange,
    fetchInbox,
  };
};
