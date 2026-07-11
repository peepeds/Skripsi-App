import { useState, useEffect, useCallback, useRef } from "react";
import { getCompanyReviews } from "@/api/reviewApi";

export const useCompanyReviews = (companySlug) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef(null);
  const initializedRef = useRef(false);
  const isFetchingRef = useRef(false);

  const fetchMore = useCallback(async (currentCursor = null) => {
    if (!companySlug || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {

      const params = {
        limit: 15,
        ...(currentCursor ? { cursor: currentCursor } : {}),
      };

      const res = await getCompanyReviews(companySlug, params);

      if (res.success) {
        const newItems = res.result ?? [];

        // Hindari data duplikat
        setItems((prev) => {
          const ids = new Set(prev.map((item) => item.internshipDetailId));

          const filtered = newItems.filter(
            (item) => !ids.has(item.internshipDetailId)
          );

          return [...prev, ...filtered];
        });

        setHasMore(res.meta?.hasMore ?? false);

        const last = newItems.at(-1);

        if (last) {
          cursorRef.current = last.internshipDetailId;
        }
      } else {
        setError(res.message || "Failed to load reviews");
      }
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [companySlug]);

  useEffect(() => {
    if (!companySlug) return;

    initializedRef.current = true;
    cursorRef.current = null;
    isFetchingRef.current = false;
    setItems([]);
    setHasMore(true);
    setError(null);

    fetchMore(null);
  }, [companySlug, fetchMore]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;

    fetchMore(cursorRef.current);
  }, [fetchMore, hasMore]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
  };
};