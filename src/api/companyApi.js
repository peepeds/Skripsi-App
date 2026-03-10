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

const getCompanies = async (page = 0, size = 15) => {
  try {
    const response = await axiosInstance.get("/company", {
      params: { page, size }
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || error.message
    };
  }
};

const searchCompanies = async (query) => {
  try {
    const response = await axiosInstance.get("/company", {
      params: { search: query }
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to search companies" }
    };
  }
};

const getCompanyBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/company/${slug}`);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to fetch company details" }
    };
  }
};

export { getCompanyRequest, approveCompanyRequest, rejectCompanyRequest, getCompanies, searchCompanies, getCompanyBySlug };
