import { useState, useCallback } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title, description, status = "info", duration = 5000 }) => {
    const id = Date.now();
    const newToast = {
      id,
      title,
      description,
      status,
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, status, duration, isClosable, position }) => {
      return showToast({ title, description, status, duration });
    },
    [showToast]
  );

  return { toast, toasts, removeToast };
};

export default useToast;



