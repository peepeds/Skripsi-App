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

export const createMajor = async (payload) => {
  const response = await axiosInstance.post('/major', payload);
  return response.data;
};

export const updateMajor = async (majorId, payload) => {
  const response = await axiosInstance.patch(`/major/${majorId}`, payload);
  return response.data;
};

export const deleteMajor = async (majorId, payload = {}) => {
  const response = await axiosInstance.delete(`/major/${majorId}`, { data: payload });
  return response.data;
};

export const majorApi = {
  getMajors,
  createMajor,
  updateMajor,
  deleteMajor,
};