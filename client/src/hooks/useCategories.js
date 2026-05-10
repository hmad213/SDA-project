import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    console.log("fetchCategories called");
    setLoading(true);
    try {
      const response = await getCategories();
      console.log("response:", response);
      setCategories(response.data.rows || []);
    } catch (err) {
      console.log("Full error:", err);
      setError("Failed to fetch categories");
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