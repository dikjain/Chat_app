import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";
import { login, signup } from "@/api/auth";

const SESSION_STORAGE_KEY = "userInfo";
const STORAGE = sessionStorage;

/**
 * Custom hook for authentication operations
 * Handles login, signup, session management, and error handling
 */
const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Safely stores user session in sessionStorage
   * @param {Object} userData - User data to store
   */
  const storeSession = useCallback((userData) => {
    try {
      if (!userData) {
        throw new Error("Invalid user data");
      }
      // Zustand persist middleware handles sessionStorage automatically
      setUser(userData);
    } catch (err) {
      console.error("Failed to store session:", err);
      throw new Error("Failed to save session");
    }
  }, [setUser]);

  /**
   * Retrieves user session from sessionStorage
   * @returns {Object|null} User data or null
   */
  const getSession = useCallback(() => {
    try {
      // Get from Zustand store (which syncs with sessionStorage)
      return useAuthStore.getState().getUser();
    } catch (err) {
      console.error("Failed to retrieve session:", err);
      return null;
    }
  }, []);

  /**
   * Clears user session from sessionStorage
   */
  const clearSession = useCallback(() => {
    try {
      // Zustand persist middleware handles sessionStorage cleanup
      useAuthStore.getState().clearUser();
    } catch (err) {
      console.error("Failed to clear session:", err);
    }
  }, []);

  /**
   * Validates email format and domain
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  const validateEmail = useCallback((email) => {
    const validDomains = ["@gmail.com", "@yahoo.com", "@outlook.com"];
    return validDomains.some(domain => email.endsWith(domain));
  }, []);

  /**
   * Handles user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Function} toast - Toast notification function
   * @returns {Promise<Object>} User data on success
   */
  const handleLogin = useCallback(async (email, password, toast) => {
    setLoading(true);
    setError(null);

    // Validation
    if (!email || !password) {
      const errorMsg = "Please Fill all the Fields";
      setError(errorMsg);
      toast({
        title: errorMsg,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      throw new Error(errorMsg);
    }

    try {
      const data = await login(email, password);
      
      // Store session
      storeSession(data);
      
      // Show success message
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Navigate to chats
      navigate("/chats");
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
      setError(errorMessage);
      
      toast({
        title: "Error Occurred!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, storeSession]);

  /**
   * Validates signup form data
   * @param {Object} formData - Form data to validate
   * @param {Function} toast - Toast notification function
   * @returns {boolean} True if valid
   */
  const validateSignup = useCallback((formData, toast) => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        title: "Password must be at least 8 characters long",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use a valid email domain (@gmail.com, @yahoo.com, or @outlook.com)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }

    return true;
  }, [validateEmail]);

  /**
   * Handles user signup
   * @param {Object} formData - Signup form data
   * @param {Function} toast - Toast notification function
   * @returns {Promise<Object>} User data on success
   */
  const handleSignup = useCallback(async (formData, toast) => {
    setLoading(true);
    setError(null);

    // Validate form data
    if (!validateSignup(formData, toast)) {
      setLoading(false);
      throw new Error("Validation failed");
    }

    try {
      const { name, email, password, pic } = formData;
      const data = await signup(name, email, password, pic || "");
      
      // Store session
      storeSession(data);
      
      // Show success message
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Navigate to chats
      navigate("/chats");
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
      setError(errorMessage);
      
      toast({
        title: "Error Occurred!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, storeSession, validateSignup]);

  return {
    // Actions
    handleLogin,
    handleSignup,
    storeSession,
    getSession,
    clearSession,
    
    // State
    loading,
    error,
    
    // Utilities
    validateEmail,
    validateSignup,
  };
};

export default useAuth;

