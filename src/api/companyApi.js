
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

export const getCompanies = async (cursor = null, limit = 15, sort = "all") => {
  const params = { limit };
  if (cursor !== null) {
    params.cursor = cursor;
  }
  if (sort && sort !== "all") {
    params.sort = sort;
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

export const saveCompany = async (companySlug, isSave = true) => {
  const response = await axiosInstance.post(`/company/${companySlug}/save`, {
    isSave,
  });
  return response.data;
};

export const unsaveCompany = async (companySlug) => {
  return saveCompany(companySlug, false);
};

export const getCompaniesBySubcategory = async (subCategoryName, type, cursor = null, limit = 20) => {
  const params = { type, limit };
  if (cursor !== null && cursor !== undefined) {
    params.cursor = cursor;
  }

  const response = await axiosInstance.get(`/subcategory/${encodeURIComponent(subCategoryName)}/companies`, {
    params
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
