import { useState, useEffect, useCallback, useRef } from "react";
import { getCompanies, searchCompanies } from "@/api/companyApi";
import { isValidSearchQuery } from "@/helpers/validations";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

/**
 * Custom hook untuk fetch dan manage companies data
 * Mendukung pagination untuk list dan search functionality
 * Implements standardized error handling per BASELINE API contract
 *
 * @param {string} searchQuery - Query string untuk search
 * @returns {Object} - { companies, loading, hasMore, error, fetchCompanies, setPage, page }
 */
export const useCompanies = (searchQuery) => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const lastFetchedPage = useRef(-1);

  const fetchCompanies = useCallback(async (currentPage) => {
    // Guard: prevent duplicate requests
    if (currentPage <= lastFetchedPage.current) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = isValidSearchQuery(searchQuery)
        ? await searchCompanies(searchQuery)
        : await getCompanies(currentPage, 15);

      // Use standardized response validation
      const { success, message, data } = handleApiResponse(response);

      if (!success) {
        setError(message);
        setCompanies([]);
        return;
      }

      const newCompanies = data || [];

      if (isValidSearchQuery(searchQuery)) {
        // Search: replace all companies
        setCompanies(newCompanies);
        setHasMore(false);
      } else {
        // Pagination: append companies, avoid duplicates
        setCompanies((prev) => {
          const existingIds = new Set(prev.map((c) => c.companyId));
          const uniqueNew = newCompanies.filter(
            (c) => !existingIds.has(c.companyId)
          );
          return [...prev, ...uniqueNew];
        });
        setHasMore(response.meta?.hasNext ?? true);
      }

      lastFetchedPage.current = currentPage;
    } catch (err) {
      const errorMessage = normalizeErrorMessage(err, "Failed to fetch companies");
      console.error("Error fetching companies:", err);
      setError(errorMessage);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const resetCompanies = useCallback(() => {
    setCompanies([]);
    setPage(0);
    setHasMore(true);
    lastFetchedPage.current = -1;
    setError(null);
  }, []);

  // Reset dan refetch saat search query berubah
  useEffect(() => {
    resetCompanies();
    fetchCompanies(0);
  }, [searchQuery]); // Only depend on searchQuery, not on fetchCompanies

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