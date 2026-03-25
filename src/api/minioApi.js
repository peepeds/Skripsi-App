/**
 * MinIO API Module
 *
 * Handles file upload operations using MinIO (S3-compatible) storage
 * Coordinates presigned URL generation and file upload
 * Returns standardized response format: { success, message, result }
 *
 * @module api/minioApi
 */

import { axiosInstance } from "./axiosInstance";

/**
 * Get presigned URL for direct file upload to MinIO
 *
 * @async
 * @param {string} fileName - Original file name (with extension)
 * @param {string} extension - File extension (e.g., "pdf", "jpg", "docx")
 * @returns {Promise<Object>} - Presigned URL for direct PUT upload
 * @throws {Error} - Axios will throw if response status is not 2xx
 *
 * @example
 * const response = await getPresignedUrl("resume.pdf", "pdf");
 * // Returns: { success: true, message: "...", result: { uploadUrl: "https://..." } }
 */
export const getPresignedUrl = async (fileName, extension) => {
  const response = await axiosInstance.get("/minio/upload-url", {
    params: { fileName, extension },
  });
  return response.data;
};

/**
 * Upload file directly to MinIO using presigned URL
 *
 * NOTE: This uses native fetch API (not axios) for raw file upload
 * Presigned URLs are time-limited and single-use
 *
 * @async
 * @param {string} uploadUrl - Presigned URL from getPresignedUrl
 * @param {File|Blob} file - File object to upload
 * @returns {Promise<Object>} - Upload confirmation with status
 * @throws {Error} - Throws if upload fails or URL is expired
 *
 * @example
 * const file = document.getElementById('input').files[0];
 * const response = await uploadFileToPresignedUrl("https://...", file);
 * // Returns: { success: true, message: "File uploaded successfully", status: 200 }
 */
export const uploadFileToPresignedUrl = async (uploadUrl, file) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  // Fetch API doesn't throw on non-2xx status, so we check manually
  if (!response.ok) {
    // Try to parse error message from response
    let errorMessage = "Upload failed";
    try {
      const errorBody = await response.text();
      errorMessage = errorBody || `Upload failed with status ${response.status}`;
    } catch (err) {
      // Ignore error parsing, use default message
    }
    throw new Error(errorMessage);
  }

  return {
    success: true,
    message: "File uploaded successfully",
    status: response.status,
  };
};