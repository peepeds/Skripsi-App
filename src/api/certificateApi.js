/**
 * Certificate API Module
 *
 * Handles certificate request operations and verification
 * Returns standardized response format: { success, message, result }
 *
 * @module api/certificateApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get certificate request details by ID
 *
 * @async
 * @param {string|number} id - Certificate request identifier
 * @returns {Promise<Object>} - Certificate request details with status
 * @throws {Error} - Axios will throw if response status is not 2xx (404 if not found)
 *
 * @example
 * const response = await getCertificateRequest("cert-123");
 */
export const getCertificateRequest = async (id) => {
  const response = await axiosInstance.get(`/user/certificate/request/${id}`);
  return response.data;
};