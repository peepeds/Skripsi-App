import axiosInstance from "./axiosInstance";

const getAuditLog = async (entity, id) => {
  try {
    const response = await axiosInstance.get(`/audit`, {
      params: {
        entity,
        id
      }
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to fetch audit log" }
    };
  }
};

export { getAuditLog };
