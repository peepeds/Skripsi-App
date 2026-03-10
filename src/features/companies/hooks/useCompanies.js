import { useState, useEffect, useCallback, useRef } from "react";
import { getCompanies, searchCompanies } from "@/api/companyApi";
import { isValidSearchQuery } from "@/helpers/validations";

const useCompanies = (searchQuery) => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const lastFetchedPage = useRef(-1);

  const fetchCompanies = useCallback(async (currentPage) => {
    if (loading || (!hasMore && !isValidSearchQuery(searchQuery)) || currentPage <= lastFetchedPage.current) return;

    setLoading(true);

    try {
      let response;
      if (isValidSearchQuery(searchQuery)) {
        response = await searchCompanies(searchQuery);
      } else {
        response = await getCompanies(currentPage, 15);
      }

      if (response.data.success) {
        const newCompanies = response.data.result;

        if (isValidSearchQuery(searchQuery)) {
          // For search, replace all companies
          setCompanies(newCompanies);
          setHasMore(false); // No pagination for search
        } else {
          // For normal fetch, append
          setCompanies((prev) => {
            const existingIds = new Set(prev.map((c) => c.companyId));
            const filteredNew = newCompanies.filter(
              (c) => !existingIds.has(c.companyId)
            );
            return [...prev, ...filteredNew];
          });
          setHasMore(response.data.meta.hasNext);
        }
        lastFetchedPage.current = currentPage;
      } else {
        setError("Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, loading, hasMore]);

  const resetCompanies = useCallback(() => {
    setCompanies([]);
    setPage(0);
    setHasMore(!isValidSearchQuery(searchQuery));
    lastFetchedPage.current = -1;
    setError(null);
  }, [searchQuery]);

  useEffect(() => {
    resetCompanies();
    fetchCompanies(0);
  }, [searchQuery]);

  return {
    companies,
    loading,
    hasMore,
    error,
    fetchCompanies,
    setPage,
    page,
  };
};

export default useCompanies;