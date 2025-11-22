import { useState } from "react";
import { config as appConfig } from "@/constants/config";
import { toast } from "sonner";

const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const uploadImage = async (file) => {
    if (!file) {
      toast.warning("Please Select an Image!");
      return null;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.warning("Please Select a Valid Image (JPEG or PNG)!");
      return null;
    }

    setIsUploading(true);
    setImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", appConfig.CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", appConfig.CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${appConfig.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const url = data.url.toString();
      setImageUrl(url);
      setIsUploading(false);
      return url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Image Upload Failed", {
        description: "Please try again later",
      });
      setIsUploading(false);
      return null;
    }
  };

  const reset = () => {
    setImageUrl(null);
    setIsUploading(false);
  };

  return {
    uploadImage,
    isUploading,
    imageUrl,
    reset,
  };
};

export default useCloudinaryUpload;

