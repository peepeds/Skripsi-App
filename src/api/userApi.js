import { axiosInstance } from "./axiosInstance";

export const updateProfile = async (payload) => {
  const response = await axiosInstance.put("/auth/profile", payload);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data;
};

export const checkEmail = async (email) => {
  const response = await axiosInstance.post("/user/check-email", { email });
  return response.data;
};

export const submitCertificate = async (certificateData) => {
  const response = await axiosInstance.post("/user/certificate", certificateData);
  return response.data;
};
