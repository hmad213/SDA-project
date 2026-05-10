import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";

const useProducts = (params) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We move the fetch function OUTSIDE the useEffect so we can export it
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(params);
      // Added a fallback [] just in case data.result is ever undefined
      setProducts(data.result || []); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Still fetches automatically on mount

  // Notice we are now returning 'refetch' as well
  return { products, loading, error, refetch: fetchProducts };
};

export default useProducts;