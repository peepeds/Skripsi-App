/**
 * Audit API Module
 *
 * Handles audit log operations for tracking entity changes and user actions
 * Returns standardized response format: { success, message, result }
 *
 * @module api/auditApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get audit log for a specific entity
 *
 * @async
 * @param {string} entity - Entity type (e.g., "company", "user", "certificate")
 * @param {string|number} id - Entity ID to retrieve audit log for
 * @returns {Promise<Object>} - Array of audit log entries
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getAuditLog("company", "comp-123");
 * // Returns: { success: true, message: "...", result: [...] }
 */
export const getAuditLog = async (entity, id) => {
  const response = await axiosInstance.get(`/audit`, {
    params: {
      entity,
      id
    }
  });
  return response.data;
};
