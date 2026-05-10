
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

export const getCompanyRequests = async ({ search = "", status = "", cursor = null } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (cursor !== null) params.cursor = cursor;
  const response = await axiosInstance.get('/company/requests', { params });
  return response.data;
};

export const reviewCompanyRequest = async (requestId, { status, reviewNote = "" }) => {
  const response = await axiosInstance.patch(`/company/requests/${requestId}/review`, {
    status,
    reviewNote,
  });
  return response.data;
};

export const adminGetCompanies = async ({ search = "", cursor = null, limit = 20 } = {}) => {
  const params = { limit };
  if (search) params.search = search;
  if (cursor !== null) params.cursor = cursor;
  const response = await axiosInstance.get("/admin/company", { params });
  return response.data;
};

export const getCompanyMasterData = async ({ search = "", cursor = null, limit = 15 } = {}) => {
  const params = { limit };
  if (search) params.search = search;
  if (cursor !== null) params.cursor = cursor;
  const response = await axiosInstance.get("/company/master-data", { params });
  return response.data;
};

export const adminCreateCompany = async (payload) => {
  const response = await axiosInstance.post("/company/create", payload);
  return response.data;
};

export const adminUpdateCompany = async (companyId, payload) => {
  const { companyName, companyAbbreviation, bio, website, subcategoryId, isPartner } = payload;
  const response = await axiosInstance.patch(`/company/${companyId}`, {
    companyName,
    companyAbbreviation,
    bio,
    website,
    subcategoryId,
    isPartner,
  });
  return response.data;
};

export const adminDeleteCompany = async (companyId) => {
  const response = await axiosInstance.delete(`/admin/company/${companyId}`);
  return response.data;
};
