
import { axiosInstance } from "./axiosInstance";

export const getJobOptions = async (query) => {
  const response = await axiosInstance.get("/review/jobOptions", { params: { query } });
  return response.data;
};

export const submitReview = async (companySlug, payload) => {
  const response = await axiosInstance.post(`/review/${companySlug}`, payload);
  return response.data;
};

export const getReviewSummary = async (companySlug) => {
  const response = await axiosInstance.get(`/review/${companySlug}/summary`);
  return response.data;
};

export const getRecentReviews = async (params = {}) => {
  const response = await axiosInstance.get('/review/recent', { params });
  return response.data;
};

export const getCompanyReviews = async (companySlug, params = {}) => {
  const response = await axiosInstance.get(`/review/${companySlug}`, { params });
  return response.data;
};

export const getCompanyRecruitmentProcess = async (companySlug, params = {}) => {
  const response = await axiosInstance.get(`/review/${companySlug}/process`, { params });
  return response.data;
};

export const likeReview = async (internshipHeaderId, isLike = true) => {
  const response = await axiosInstance.post("/review/like", {
    internshipHeaderId,
    isLike,
  });
  return response.data;
};

export const unlikeReview = async (internshipHeaderId) => {
  return likeReview(internshipHeaderId, false);
};

export const getRecruitmentProcessSummary = async (companySlug) => {
  const response = await axiosInstance.get(`/review/${companySlug}/process/summary`);
  return response.data;
};
