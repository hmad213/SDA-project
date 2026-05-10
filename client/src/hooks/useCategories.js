import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";

const useCategories = (params) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories(params);
      setCategories(data.result || data || []); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};

export default useCategories;