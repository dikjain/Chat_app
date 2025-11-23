import axios from "axios";
import { config as appConfig } from "@/constants/config";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";

// Create centralized axios instance
const apiClient = axios.create({
  baseURL: appConfig.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store (synchronous access)
    try {
      // Dynamic import for Zustand store
      const token = useAuthStore.getState().getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from store:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors consistently
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error("Network Error", {
        description: "Please check your internet connection",
      });
      return Promise.reject(error);
    }

    // Handle HTTP errors
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Clear user from Zustand store
        try {
          useAuthStore.getState().clearUser();
        } catch (error) {
          console.error("Error clearing user:", error);
        }
        toast.error("Session Expired", {
          description: "Please login again",
        });
        if (window.location.pathname !== "/") {
          window.location.replace("/");
        }
        break;
      case 403:
        toast.error("Forbidden", {
          description: data?.message || "You don't have permission to perform this action",
        });
        break;
      case 404:
        toast.error("Not Found", {
          description: data?.message || "The requested resource was not found",
        });
        break;
      case 500:
        toast.error("Server Error", {
          description: data?.message || "Something went wrong on the server",
        });
        break;
      default:
        toast.error("Error", {
          description: data?.message || error.message || "An unexpected error occurred",
        });
    }

    return Promise.reject(error);
  }
);

export default apiClient;

