import axiosInstance from "./axiosInstance";

const getInbox = async () => {
  try {
    const response = await axiosInstance.get("/inbox");

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to fetch inbox" }
    };
  }
};

const markAsRead = async (inboxId) => {
  try {
    const response = await axiosInstance.patch(`/inbox/${inboxId}/read`);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to mark as read" }
    };
  }
};

const deleteInbox = async (inboxId) => {
  try {
    const response = await axiosInstance.delete(`/inbox/${inboxId}`);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to delete inbox" }
    };
  }
};

export { getInbox, markAsRead, deleteInbox };
