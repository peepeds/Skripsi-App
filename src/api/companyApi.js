import axiosInstance from "./axiosInstance";

const getCompanyRequest = async (requestId) => {
  try {
    const response = await axiosInstance.get(`/company/request/${requestId}`);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to fetch company request" }
    };
  }
};

const approveCompanyRequest = async (requestId, reviewNote = "") => {
  try {
    const response = await axiosInstance.patch(`/company/request/${requestId}/approve`, {
      reviewNote
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to approve request" }
    };
  }
};

const rejectCompanyRequest = async (requestId, reviewNote = "") => {
  try {
    const response = await axiosInstance.patch(`/company/request/${requestId}/reject`, {
      reviewNote
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to reject request" }
    };
  }
};

export { getCompanyRequest, approveCompanyRequest, rejectCompanyRequest };
