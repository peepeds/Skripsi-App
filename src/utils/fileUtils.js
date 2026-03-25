import imageCompression from "browser-image-compression";

/**
 * Validates file type and size
 * @param {File} file - The file to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types (default: PDF only)
 * @param {number} maxSize - Max file size in bytes (default: 10MB for PDF)
 * @returns {Object} { isValid: boolean, errorMessage: string }
 */
export const validateFile = (file, allowedTypes = ["application/pdf"], maxSize = 10 * 1024 * 1024) => {
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    const typeNames = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
    return { isValid: false, errorMessage: `Hanya file ${typeNames} yang diperbolehkan` };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return { isValid: false, errorMessage: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  return { isValid: true, errorMessage: "" };
};

/**
 * Compresses an image file
 * @param {File} file - The image file to compress
 * @returns {Object} { compressedFile: File | null, error: string | null }
 */
export const compressImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 1, // Compress to under 1MB if possible
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    // Check compressed size (3MB limit for images)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (compressedFile.size > maxSize) {
      return { compressedFile: null, error: "File setelah kompresi masih melebihi 3MB" };
    }

    return { compressedFile, error: null };
  } catch (error) {
    console.error("Compression error:", error);
    return { compressedFile: null, error: "Gagal mengompresi file" };
  }
};