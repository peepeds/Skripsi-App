import axiosInstance from "./axiosInstance";

const getRegions = async () => {
  try {
    const response = await axiosInstance.get("/region/options");

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
};

export { getRegions };