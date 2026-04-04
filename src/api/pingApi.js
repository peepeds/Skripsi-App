import { axiosInstance } from "./axiosInstance";

export const pingServer = async () => {
  const response = await axiosInstance.get("/ping");
  return response.data;
};