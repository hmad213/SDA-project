import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";

const useProducts = (params) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts(params);
        setProducts(data.result);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { products, loading, error };
};

export default useProducts;
