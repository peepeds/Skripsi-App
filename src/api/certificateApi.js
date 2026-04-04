import { axiosInstance } from "./axiosInstance";

export const getCertificateRequest = async (id) => {
  const response = await axiosInstance.get(`/user/certificate/request/${id}`);
  return response.data;
};