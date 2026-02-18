import axiosInstance from "./axiosInstance";

const pingServer = async () => {
  try {
    const response = await axiosInstance.get("/ping");

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
};

export { pingServer };