import { config as appConfig } from "@/constants/config";

/**
 * Upload an image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("File is required");
  }

  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    throw new Error("File must be a JPEG or PNG image");
  }

  if (!appConfig.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not configured");
  }

  if (!appConfig.CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("CLOUDINARY_UPLOAD_PRESET is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", appConfig.CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", appConfig.CLOUDINARY_CLOUD_NAME);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${appConfig.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url.toString();
};

