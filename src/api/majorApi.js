/**
 * Major API Module
 *
 * Handles academic major/program options for user profile
 * Returns standardized response format: { success, message, result }
 *
 * @module api/majorApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get available academic majors/programs
 *
 * @async
 * @returns {Promise<Object>} - Array of major options with ids and names
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getMajors();
 * // Returns: { success: true, message: "...", result: [...] }
 */
export const getMajors = async () => {
  const response = await axiosInstance.get("/major/options");
  return response.data;
};