import { useState, useCallback } from "react";

/**
 * Custom hook for API calls with loading and error states
 * Provides standardized API call pattern with built-in state management
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} { execute, loading, error, data, reset }
 */
export const useApi = (apiFunction, options = {}) => {
  const { 
    onSuccess, 
    onError, 
    immediate = false,
    initialData = null 
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(initialData);

  /**
   * Execute the API call
   * @param {...any} args - Arguments to pass to the API function
   * @returns {Promise} The API call result
   */
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(initialData);
  }, [initialData]);

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
};

/**
 * Hook for multiple API calls
 * Useful when you need to manage multiple related API calls
 */
export const useApiMultiple = (apiFunctions) => {
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});

  const execute = useCallback(async (key, ...args) => {
    const apiFunction = apiFunctions[key];
    if (!apiFunction) {
      throw new Error(`API function "${key}" not found`);
    }

    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));

    try {
      const result = await apiFunction(...args);
      setData(prev => ({ ...prev, [key]: result }));
      return result;
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, [apiFunctions]);

  return {
    execute,
    loading,
    errors,
    data,
  };
};

