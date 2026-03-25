/**
 * Authentication API Module
 *
 * Handles all authentication-related API calls (login, register, logout)
 * Returns standardized response format: { success, message, result }
 *
 * @module api/authApi
 */

import { axiosInstance } from "./axiosInstance";
import { clearAuthSession } from "./authUtils";

/**
 * User login
 *
 * @async
 * @param {Object} payload - Login credentials
 * @param {string} payload.email - User email address
 * @param {string} payload.password - User password
 * @returns {Promise<Object>} - Response with accessToken on success
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await login({ email: "user@example.com", password: "pass123" });
 * // Returns: { success: true, message: "Login successful", result: { accessToken: "..." } }
 */
export const login = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

/**
 * User registration
 *
 * @async
 * @param {Object} payload - Registration data
 * @param {string} payload.email - User email address
 * @param {string} payload.password - User password (min 8 chars)
 * @param {string} payload.fullName - User's full name
 * @returns {Promise<Object>} - Response with user data and token on success
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await register({ email: "user@example.com", password: "password123", fullName: "John Doe" });
 */
export const register = async (payload) => {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
};

/**
 * User logout and clear local session
 *
 * @async
 * @returns {Promise<void>} - Notifies backend, clears all cookies and localStorage
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * await logout();
 * // Clears accessToken and other stored data, cookies cleared by server
 */
export const logout = async () => {
  try {
    // Notify backend to invalidate session and clear server-side cookies
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Logout API call failed:", error.message);
    // Continue with client-side cleanup even if API call fails
  } finally {
    // Clear all authentication tokens and cookies
    clearAuthSession();
  }
};
