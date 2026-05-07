import { axiosInstance } from "./axiosInstance";

export const getCertificateRequest = async (id) => {
  const response = await axiosInstance.get(`/user/certificate/request/${id}`);
  return response.data;
};

export const getCertificateVerificationList = async ({ search = "", status = "" } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  const response = await axiosInstance.get("/user/certificate/requests", { params });
  return response.data;
};

export const approveCertificateRequest = async (id, reviewNote = "") => {
  const response = await axiosInstance.patch(`/user/certificate/requests/${id}/approve`, { reviewNote });
  return response.data;
};

export const rejectCertificateRequest = async (id, reviewNote = "") => {
  const response = await axiosInstance.patch(`/user/certificate/requests/${id}/reject`, { reviewNote });
  return response.data;
};