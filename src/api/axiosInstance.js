import axios from "axios";

// Read API base URL from Vite env variable `VITE_API_BASE_URL`, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const AUTH_EXCEPTION_ENDPOINTS = ["/auth/login"];

const refreshAccessToken = async () => {
  const res = await axios.post(
    "/auth/refresh",
    {},
    { baseURL: API_BASE_URL, withCredentials: true }
  );


  if (res.data?.success) {
    console.info("Token refreshed successfully.");
    localStorage.setItem("accessToken", res.data.result.accessToken);
    return res.data.result.accessToken;
  } else {
    console.error("Token refresh failed:", res.data?.message || "Unknown error");
  }

  throw new Error("Refresh failed");
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // Exclude auth endpoints from automatic token attachment
    const isAuthEndpoint = config.url === "/auth/login" || config.url === "/auth/register";
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isFirstTry = !originalRequest._retry;
    const isAuthException = AUTH_EXCEPTION_ENDPOINTS.includes(originalRequest.url);

    if (!is401 || !isFirstTry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Jika error pada endpoint auth → logout
    if (isAuthException) {
      localStorage.removeItem("accessToken");
      return Promise.reject(error);
    }

    console.info("Access token expired, attempting to refresh...");
    try {
      const newToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (err) {
      console.error("Refresh token failed:", err.message);
      //redirectToLogin();
      return Promise.reject(err);
    }
  }
);

export default axiosInstance;
