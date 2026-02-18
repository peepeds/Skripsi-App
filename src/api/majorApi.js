import axiosInstance from "./axiosInstance";

const getMajors = async () => {
  try {
    const response = await axiosInstance.get("/major/options");

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
};

export { getMajors };