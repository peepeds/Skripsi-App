import { axiosInstance } from "./axiosInstance";

export const getInbox = async () => {
  const response = await axiosInstance.get("/inbox");
  return response.data;
};

export const markAsRead = async (inboxId) => {
  const response = await axiosInstance.patch(`/inbox/${inboxId}/read`);
  return response.data;
};

export const deleteInbox = async (inboxId) => {
  const response = await axiosInstance.delete(`/inbox/${inboxId}`);
  return response.data;
};
