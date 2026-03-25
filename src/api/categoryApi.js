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
 * @param {string} type - Category type: 'jobs' or 'companies' (default: 'jobs')
 * @returns {Promise<Object>} - Hierarchical list of categories and subcategories
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getCategories('jobs');
 * // Returns: { success: true, message: "...", result: [...] }
 */
export const getCategories = async (type = 'jobs') => {
  const response = await axiosInstance.get('/category', {
    params: { IncludeSubCategories: 1, type },
  });
  return response.data;
};