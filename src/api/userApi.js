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

export const getMyReviews = async (cursor = null, limit = 10) => {
  const params = { limit };
  if (cursor !== null) {
    params.cursor = cursor;
  }

  const response = await axiosInstance.get("/user/my-reviews", { params });
  return response.data;
};

export const getSavedCompanies = async (cursor = null, limit = 20) => {
  const params = { limit };
  if (cursor !== null) {
    params.cursor = cursor;
  }

  const response = await axiosInstance.get("/user/my-bookmarks", { params });
  return response.data;
};
