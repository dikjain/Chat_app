import { useState, useCallback } from "react";

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

