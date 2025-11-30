import { useCallback } from "react";
import { useAuthStore } from "../stores";
import { useLogin, useSignup } from "./mutations/useAuthMutations";

const useAuth = () => {
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const setUser = useAuthStore((state) => state.setUser);

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

  const getSession = useCallback(() => {
    try {
      // Get from Zustand store (which syncs with sessionStorage)
      return useAuthStore.getState().getUser();
    } catch (err) {
      console.error("Failed to retrieve session:", err);
      return null;
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      // Zustand persist middleware handles sessionStorage cleanup
      useAuthStore.getState().clearUser();
    } catch (err) {
      console.error("Failed to clear session:", err);
    }
  }, []);

  const validateEmail = useCallback((email) => {
    const validDomains = ["@gmail.com", "@yahoo.com", "@outlook.com"];
    return validDomains.some(domain => email.endsWith(domain));
  }, []);

  const handleLogin = useCallback(async (email, password, toast) => {
    // Validation
    if (!email || !password) {
      const errorMsg = "Please Fill all the Fields";
      toast({
        title: errorMsg,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    loginMutation.mutate({ email, password });
  }, [loginMutation]);

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

  const handleSignup = useCallback(async (formData, toast) => {
    // Validate form data
    if (!validateSignup(formData, toast)) {
      return;
    }

    const { name, email, password, pic } = formData;
    signupMutation.mutate({ name, email, password, pic: pic || "" });
  }, [signupMutation, validateSignup]);

  return {
    // Actions
    handleLogin,
    handleSignup,
    storeSession,
    getSession,
    clearSession,
    
    // State from mutations
    loading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error,
    
    // Utilities
    validateEmail,
    validateSignup,
  };
};

export default useAuth;

