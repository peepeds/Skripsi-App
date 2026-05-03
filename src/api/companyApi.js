
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

export const getCompanies = async (...args) => {
  if (args.length > 0 && (typeof args[0] === 'number' || args[0] === null)) {
    const cursor = args[0];
    const limit = args[1] ?? 15;
    const sort = args[2] ?? 'all';
    const params = { limit };
    if (cursor !== null) params.cursor = cursor;
    if (sort && sort !== 'all') params.sort = sort;
    const response = await axiosInstance.get('/company', { params });
    return response.data;
  }

  const opts = args[0] || {};
  const { cursor, limit = 15, sort, search, mode } = opts;
  const params = {};
  if (limit != null) params.limit = limit;
  if (cursor != null) params.cursor = cursor;
  if (sort && sort !== 'all') params.sort = sort;
  if (search) params.search = search;
  if (mode) params.mode = mode;

  const response = await axiosInstance.get('/company', { params });
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

export const getCompanyRequests = async ({ search = "", status = "" } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
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
