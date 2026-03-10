import axiosInstance from './axiosInstance';

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/category?IncludeSubCategories=1');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};