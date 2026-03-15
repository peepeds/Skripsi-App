/**
 * Company API Module
 *
 * Handles all company-related API calls including listing, searching, and approval workflows
 * Returns standardized response format: { success, message, result }
 *
 * @module api/companyApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get company registration request details
 *
 * @async
 * @param {string|number} requestId - Unique company request identifier
 * @returns {Promise<Object>} - Company request details
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getCompanyRequest("req-123");
 */
export const getCompanyRequest = async (requestId) => {
  const response = await axiosInstance.get(`/company/request/${requestId}`);
  return response.data;
};

/**
 * Approve a company registration request
 *
 * @async
 * @param {string|number} requestId - Company request ID to approve
 * @param {string} [reviewNote=""] - Optional review notes from reviewer
 * @returns {Promise<Object>} - Updated request with approval details
 * @throws {Error} - Axios will throw if response status is not 2xx (e.g., 403 Forbidden if not authorized)
 *
 * @example
 * const response = await approveCompanyRequest("req-123", "Looks good");
 */
export const approveCompanyRequest = async (requestId, reviewNote = "") => {
  const response = await axiosInstance.patch(`/company/request/${requestId}/approve`, {
    reviewNote
  });
  return response.data;
};

/**
 * Reject a company registration request
 *
 * @async
 * @param {string|number} requestId - Company request ID to reject
 * @param {string} [reviewNote=""] - Optional rejection reason
 * @returns {Promise<Object>} - Updated request with rejection details
 * @throws {Error} - Axios will throw if response status is not 2xx (e.g., 403 Forbidden if not authorized)
 *
 * @example
 * const response = await rejectCompanyRequest("req-123", "Invalid documentation");
 */
export const rejectCompanyRequest = async (requestId, reviewNote = "") => {
  const response = await axiosInstance.patch(`/company/request/${requestId}/reject`, {
    reviewNote
  });
  return response.data;
};

/**
 * Get paginated list of companies
 *
 * @async
 * @param {number} [page=0] - Page number (0-indexed)
 * @param {number} [size=15] - Number of results per page
 * @returns {Promise<Object>} - Paginated list with { data: [...], pagination: { ... } }
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getCompanies(0, 20);
 * // Returns: { success: true, message: "...", result: { data: [...], pagination: {...} } }
 */
export const getCompanies = async (page = 0, size = 15) => {
  const response = await axiosInstance.get("/company", {
    params: { page, size }
  });
  return response.data;
};

/**
 * Search companies by query string
 *
 * @async
 * @param {string} query - Search query (company name, keywords, etc.)
 * @returns {Promise<Object>} - Array of matching companies
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await searchCompanies("tech company");
 * // Returns: { success: true, message: "...", result: [...companies] }
 */
export const searchCompanies = async (query) => {
  const response = await axiosInstance.get("/company", {
    params: { search: query }
  });
  return response.data;
};

/**
 * Get company details by slug
 *
 * @async
 * @param {string} slug - Company URL slug (unique identifier)
 * @returns {Promise<Object>} - Complete company details with reviews and ratings
 * @throws {Error} - Axios will throw if response status is not 2xx (404 if not found)
 *
 * @example
 * const response = await getCompanyBySlug("google-indonesia");
 * // Returns: { success: true, message: "...", result: { id, name, slug, ...details } }
 */
export const getCompanyBySlug = async (slug) => {
  const response = await axiosInstance.get(`/company/${slug}`);
  return response.data;
};
