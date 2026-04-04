import { axiosInstance } from './axiosInstance';

export const getCategories = async (type = 'jobs') => {
  const response = await axiosInstance.get('/category', {
    params: { IncludeSubCategories: 1, type },
  });
  return response.data;
};