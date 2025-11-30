import { useState, useCallback } from "react";
import { searchUsers } from "../api/user";
import { toast } from "sonner";

const useUserSearch = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      toast.warning("Please Enter something in search");
      setSearchResult([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchUsers(query);
      setSearchResult(data);
      return data;
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || "Search failed";
      setError(errorMsg);
      toast.error("Search Failed", {
        description: errorMsg,
      });
      setSearchResult([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResult([]);
    setError(null);
  }, []);

  return {
    searchUsers: search,
    searchResult,
    loading,
    error,
    clearSearch,
  };
};

export default useUserSearch;

