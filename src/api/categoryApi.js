/**
 * Category API Module
 *
 * Handles category operations for company classification
 * Returns standardized response format: { success, message, result }
 *
 * @module api/categoryApi
 */

import { axiosInstance } from './axiosInstance';

/**
 * Get all categories with subcategories
 *
 * @async
 * @returns {Promise<Object>} - Hierarchical list of categories and subcategories
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getCategories();
 * // Returns: { success: true, message: "...", result: [...] }
 */
export const getCategories = async () => {
  const response = await axiosInstance.get('/category?IncludeSubCategories=1');
  return response.data;
};