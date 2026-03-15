/**
 * User API Module
 *
 * Handles user profile operations, validation, and certificate management
 * Returns standardized response format: { success, message, result }
 *
 * @module api/userApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Update user profile information
 *
 * @async
 * @param {Object} payload - Profile data to update
 * @param {string} [payload.fullName] - User's full name
 * @param {string} [payload.bio] - User biography/description
 * @param {string} [payload.phone] - Contact phone number
 * @param {string} [payload.profilePhoto] - Profile photo URL/file
 * @returns {Promise<Object>} - Updated user profile data
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await updateProfile({ fullName: "John Doe", bio: "Software Engineer" });
 */
export const updateProfile = async (payload) => {
  const response = await axiosInstance.put("/auth/profile", payload);
  return response.data;
};

/**
 * Get current authenticated user information
 *
 * @async
 * @returns {Promise<Object>} - Current user data including id, email, profile info
 * @throws {Error} - Axios will throw if response status is not 2xx (401 if not authenticated)
 *
 * @example
 * const response = await getMe();
 * // Returns: { success: true, message: "...", result: { id, email, fullName, ... } }
 */
export const getMe = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data;
};

/**
 * Check if email is already registered (for signup validation)
 *
 * @async
 * @param {string} email - Email address to check
 * @returns {Promise<Object>} - Validation response with availability status
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await checkEmail("user@example.com");
 * // Returns: { success: true, message: "Email available", result: { available: true } }
 */
export const checkEmail = async (email) => {
  const response = await axiosInstance.post("/user/check-email", { email });
  return response.data;
};

/**
 * Submit user certificate for verification
 *
 * @async
 * @param {Object} certificateData - Certificate details
 * @returns {Promise<Object>} - Certificate submission response
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await submitCertificate({
 *   name: "AWS Certified Solutions Architect",
 *   issuingOrganization: "Amazon",
 *   issueDate: "2023-01-15"
 * });
 */
export const submitCertificate = async (certificateData) => {
  const response = await axiosInstance.post("/user/certificate", certificateData);
  return response.data;
};
