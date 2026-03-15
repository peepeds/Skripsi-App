/**
 * Region API Module
 *
 * Handles geographic region/location options
 * Returns standardized response format: { success, message, result }
 *
 * @module api/regionApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get available regions/locations
 *
 * @async
 * @returns {Promise<Object>} - Array of region options with ids and names
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getRegions();
 * // Returns: { success: true, message: "...", result: [...] }
 */
export const getRegions = async () => {
  const response = await axiosInstance.get("/region/options");
  return response.data;
};