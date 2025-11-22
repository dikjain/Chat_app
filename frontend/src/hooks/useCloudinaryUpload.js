import { useState } from "react";
import { config as appConfig } from "@/constants/config";

const useCloudinaryUpload = (toast) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const uploadImage = async (file) => {
    if (!file) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return null;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast({
        title: "Please Select a Valid Image (JPEG or PNG)!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
      toast({
        title: "Image Upload Failed",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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

