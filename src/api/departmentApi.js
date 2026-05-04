import { axiosInstance } from "./axiosInstance";

export const getDepartments = async () => {
  const response = await axiosInstance.get("/department/options");
  return response.data;
};

export const departmentApi = {
  getDepartments,
};
