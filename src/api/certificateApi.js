import axiosInstance from "./axiosInstance";

const getCertificateRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/certificate/request/${id}`);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to fetch certificate request" }
    };
  }
};

export { getCertificateRequest };