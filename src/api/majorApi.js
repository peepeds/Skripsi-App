import { axiosInstance } from "./axiosInstance";

export const getMajors = async (options = {}) => {
  if (options && options.optionsOnly) {
    const response = await axiosInstance.get('/major/options');
    return response.data;
  }

  const response = await axiosInstance.get('/major');
  return response.data;
};

export const getMajorOptions = async () => {
  const response = await axiosInstance.get('/major/options');
  return response.data;
};