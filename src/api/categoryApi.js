import { axiosInstance } from './axiosInstance';

export const getCategories = async (opts = {}) => {
  if (typeof opts === 'string') {
    const type = opts;
    const response = await axiosInstance.get('/category', {
      params: { IncludeSubCategories: 1, type },
    });
    return response.data;
  }

  const { type = 'jobs', IncludeSubCategories = 1, ...rest } = opts || {};
  const params = { IncludeSubCategories, type, ...rest };
  const response = await axiosInstance.get('/category', { params });
  return response.data;
};

export const getTopCategories = async () => {
  const response = await axiosInstance.get('/top-categories');
  return response.data;
};

export const getSubCategorySummary = async (subCategoryName) => {
  const response = await axiosInstance.get(`/subcategory/${encodeURIComponent(subCategoryName)}/summary`);
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await axiosInstance.post('/category', payload);
  return response.data;
};

export const updateCategory = async (categoryId, payload) => {
  const response = await axiosInstance.patch(`/category/${categoryId}`, payload);
  return response.data;
};

export const deleteCategory = async (categoryId, payload = {}) => {
  const response = await axiosInstance.delete(`/category/${categoryId}`, { data: payload });
  return response.data;
};

export const createSubCategory = async (payload) => {
  const response = await axiosInstance.post('/subcategory', payload);
  return response.data;
};

export const updateSubCategory = async (subCategoryId, payload) => {
  const response = await axiosInstance.put(`/subcategory/${subCategoryId}`, payload);
  return response.data;
};

export const deleteSubCategory = async (subCategoryId) => {
  // Some servers expect a request body for DELETE even if unused (Spring optional @RequestBody).
  // Provide an empty body to avoid binding issues.
  const response = await axiosInstance.delete(`/subcategory/${subCategoryId}`, { data: {} });
  return response.data;
};

export const getSubCategories = async () => {
  const response = await axiosInstance.get('/subcategory');
  return response.data;
};

export const categoryApi = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};