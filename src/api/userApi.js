import axiosInstance from "./axiosInstance";

const updateProfile = async (payload) => {
  try {
    const response = await axiosInstance.put("/auth/profile", payload);

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
};

const getMe = async () => {
  try {
    const response = await axiosInstance.get("/user/me");

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }

};
const checkEmail = async (email) => {
  console.log("Checking email:", email);
  try {
    const response = await axiosInstance.post("/user/check-email", {email});

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response.data
    };
  }
}

export { updateProfile, getMe, checkEmail };
