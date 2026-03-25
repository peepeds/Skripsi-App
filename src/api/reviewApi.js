/**
 * Review API Module
 *
 * Handles all review submission-related API calls
 *
 * @module api/reviewApi
 */

import { axiosInstance } from "./axiosInstance";

export const buildReviewPayload = (formData = {}) => ({
  internshipType: formData.internshipType || "",
  workScheme: formData.workScheme || "",
  duration: parseInt(formData.duration) || 0,
  year: Number(formData.year) || 0,
  jobTitle: formData.jobTitle || "",
  SubCategoryIds: formData.subcategories || [],
  ratings: {
    workCulture: formData.ratings?.workCulture || 0,
    learningOpp: formData.ratings?.learningOpp || 0,
    mentorship: formData.ratings?.mentorship || 0,
    benefit: formData.ratings?.benefit || 0,
    workLifeBalance: formData.ratings?.workLifeBalance || 0,
  },
  recruitmentProcess: formData.recruitmentProcess || [],
  interviewDifficulty: formData.interviewDifficulty || 0,
  testimony: formData.testimony || "",
  pros: formData.pros || "",
  cons: formData.cons || "",
});

/**
 * Get job title suggestions/options
 *
 * @async
 * @param {string} query - Search query for job titles
 * @returns {Promise<Object>} - Response with array of job titles
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getJobOptions("software");
 * // Returns: { success: true, result: [{ jobTitle: "Software Engineer" }, { jobTitle: "Software Architect" }] }
 */
export const getJobOptions = async (query) => {
  const response = await axiosInstance.get("/review/jobOptions", { params: { query } });
  return response.data;
};

/**
 * Submit a review
 *
 * @async
 * @param {string} companySlug - The company slug
 * @param {Object} payload - Review data
 * @returns {Promise<Object>} - Response with review data on success
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await submitReview("bank-rakyat-indonesia", { internshipType: "FULL_TIME", ... });
 */
export const submitReview = async (companySlug, payload) => {
  const response = await axiosInstance.post(`/review/${companySlug}`, payload);
  return response.data;
};
