import axiosInstance from "./axiosInstance";

const getPresignedUrl = async (fileName, extension) => {
  try {
    const response = await axiosInstance.get("/minio/upload-url", {
      params: { fileName, extension },
    });

    return {
      data: response.data,
    };
  } catch (error) {
    return {
      data: error.response?.data || { success: false, message: "Failed to get upload URL" }
    };
  }
};

const uploadFileToPresignedUrl = async (uploadUrl, file) => {
  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return {
      data: {
        success: true,
        message: "File uploaded successfully",
        status: response.status,
      },
    };
  } catch (error) {
    return {
      data: {
        success: false,
        message: error?.message || "Failed to upload file to MinIO",
      },
    };
  }
};

export { getPresignedUrl, uploadFileToPresignedUrl };