import { useRef, useCallback } from "react";

const useFileUpload = (onFileSelect) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!fileInputRef.current) {
        reject(new Error("File input not available"));
        return;
      }
      
      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const data = await onFileSelect(file);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        }
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fileInputRef.current?.removeEventListener('change', handleFileChange);
      };

      fileInputRef.current.addEventListener('change', handleFileChange);
      fileInputRef.current.click();
    });
  }, [onFileSelect]);

  return {
    handleFileUpload,
    fileInputRef,
  };
};

export default useFileUpload;

