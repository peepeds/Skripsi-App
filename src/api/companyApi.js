import { axiosInstance } from "./axiosInstance";

export const getCompanyRequest = async (requestId) => {
  const response = await axiosInstance.get(`/company/request/${requestId}`);
  return response.data;
};

export const approveCompanyRequest = async (requestId, reviewNote = "") => {
  const response = await axiosInstance.patch(`/company/request/${requestId}/approve`, {
    reviewNote
  });
  return response.data;
};

export const rejectCompanyRequest = async (requestId, reviewNote = "") => {
  const response = await axiosInstance.patch(`/company/request/${requestId}/reject`, {
    reviewNote
  });
  return response.data;
};

export const getCompanies = async (cursor = null, limit = 15) => {
  const params = { limit };
  if (cursor !== null) {
    params.cursor = cursor;
  }
  const response = await axiosInstance.get("/company", { params });
  return response.data;
};

export const searchCompanies = async (query) => {
  const response = await axiosInstance.get("/company", {
    params: { search: query }
  });
  return response.data;
};

export const getCompanyBySlug = async (slug) => {
  const response = await axiosInstance.get(`/company/${slug}`);
  return response.data;
};

export const getCompaniesBySubcategory = async (subCategoryName, type, page = 0, size = 20) => {
  const response = await axiosInstance.get(`/subcategory/${encodeURIComponent(subCategoryName)}/companies`, {
    params: { type, page, size }
  });
  return response.data;
};

export const getTopRatedCompanies = async () => {
  const response = await axiosInstance.get('/company/top-ratings');
  return response.data;
};

export const createCompanyRequest = async (payload) => {
  const response = await axiosInstance.post('/company/requests', payload);
  return response.data;
};
