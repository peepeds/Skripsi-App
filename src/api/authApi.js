import axiosInstance from "./axiosInstance";

const login = async (payload) => {
  try {
    const response = await axiosInstance.post("/auth/login", payload);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
};

const register = async (payload) => {
  try {
    const response = await axiosInstance.post("/auth/register", payload);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
};


const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout"); 
  } finally {
    localStorage.clear();
  }

  return { success: true };
};

export { login, register, logout };
