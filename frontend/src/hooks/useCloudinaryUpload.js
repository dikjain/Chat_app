import { useState } from "react";
import { uploadImage as uploadImageAPI } from "@/api/cloudinary";
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
      const url = await uploadImageAPI(file);
      setImageUrl(url);
      setIsUploading(false);
      return url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Image Upload Failed", {
        description: error.message || "Please try again later",
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

