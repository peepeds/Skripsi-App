/**
 * Ping API Module
 *
 * Health check endpoint for server connectivity
 * Returns standardized response format: { success, message, result }
 *
 * @module api/pingApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Health check - verify server is running
 *
 * @async
 * @returns {Promise<Object>} - Server status confirmation
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await pingServer();
 * // Returns: { success: true, message: "Server is running", result: {...} }
 */
export const pingServer = async () => {
  const response = await axiosInstance.get("/ping");
  return response.data;
};