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