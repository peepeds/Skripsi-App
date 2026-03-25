/**
 * Inbox API Module
 *
 * Handles inbox/notification operations including fetching, reading, and deletion
 * Returns standardized response format: { success, message, result }
 *
 * @module api/inboxApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get all inbox messages/notifications for current user
 *
 * @async
 * @returns {Promise<Object>} - Array of inbox items with read status
 * @throws {Error} - Axios will throw if response status is not 2xx (401 if not authenticated)
 *
 * @example
 * const response = await getInbox();
 * // Returns: { success: true, message: "...", result: [...] }
 */
export const getInbox = async () => {
  const response = await axiosInstance.get("/inbox");
  return response.data;
};

/**
 * Mark inbox message as read
 *
 * @async
 * @param {string|number} inboxId - Inbox message identifier
 * @returns {Promise<Object>} - Updated inbox item with read status
 * @throws {Error} - Axios will throw if response status is not 2xx (404 if not found)
 *
 * @example
 * const response = await markAsRead("inbox-123");
 */
export const markAsRead = async (inboxId) => {
  const response = await axiosInstance.patch(`/inbox/${inboxId}/read`);
  return response.data;
};

/**
 * Delete inbox message
 *
 * @async
 * @param {string|number} inboxId - Inbox message identifier
 * @returns {Promise<Object>} - Deletion confirmation (204 No Content response)
 * @throws {Error} - Axios will throw if response status is not 2xx (404 if not found)
 *
 * @example
 * const response = await deleteInbox("inbox-123");
 */
export const deleteInbox = async (inboxId) => {
  const response = await axiosInstance.delete(`/inbox/${inboxId}`);
  return response.data;
};
