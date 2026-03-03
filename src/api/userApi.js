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

const submitCertificate = async (certificateData) => {
  console.log("userApi: submitCertificate called with data:", certificateData);
  try {
    console.log("userApi: Making POST request to /user/certificate");
    const response = await axiosInstance.post("/user/certificate", certificateData);
    console.log("userApi: Response received:", response);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error("userApi: Error in submitCertificate:", error);
    return {
      data: error.response?.data || { success: false, message: "Failed to submit certificate" }
    };
  }
};

export { updateProfile, getMe, checkEmail, submitCertificate };
