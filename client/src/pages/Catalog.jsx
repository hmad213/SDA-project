import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "../styles/Catalog.module.css";
import Product from "../components/Products";
import { getCategories } from "../services/categoryService";
import { getProducts, searchProducts } from "../services/productService";

const LIMIT = 20;

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read from URL
  const search = searchParams.get("search") || "";
  const selected = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : null;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [productError, setProductError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // helper to update URL params without losing existing ones
  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data.rows);
      } catch (err) {
        setCategoryError(
          err.response?.data?.error || "Failed to fetch categories",
        );
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductLoading(true);
      setProductError(null);
      const offset = (page - 1) * LIMIT;

      try {
        const { data } = await searchProducts({
          ...(search && { search }),
          ...(selected && { category: selected }),
          limit: LIMIT,
          offset,
        });

        const items = data.result ?? [];
        setProducts(items);
        setHasMore(items.length === LIMIT);
      } catch (err) {
        console.log(err.response?.data);
        setProductError(
          err.response?.data?.error || "Failed to fetch products",
        );
      } finally {
        setProductLoading(false);
      }
    };
    fetchProducts();
  }, [page, selected, search]);

  const handleCategory = (id) => {
    updateParams({
      category: selected === id ? null : id,
      page: 1,
    });
  };

  return (
    <>
      <Navbar />
      <main>
        <div className={styles.container}>
          <div className={styles.categories}>
            <h2>Categories</h2>
            <hr />
            <div className={styles.categoryContainer}>
              {categoryLoading ? (
                <div className={styles.stateContainer}>
                  <div className={styles.spinner} />
                  <p>Loading categories...</p>
                </div>
              ) : categoryError ? (
                <div className={styles.stateContainer}>
                  <p className={styles.errorText}>{categoryError}</p>
                </div>
              ) : (
                categories.map((item) => (
                  <button
                    key={item.category_id}
                    onClick={() => handleCategory(item.category_id)}
                    className={
                      selected === item.category_id ? styles.activeCategory : ""
                    }
                  >
                    {item.category_name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={styles.products}>
            {productLoading ? (
              <div className={styles.stateContainer}>
                <div className={styles.spinner} />
                <p>Loading products...</p>
              </div>
            ) : productError ? (
              <div className={styles.stateContainer}>
                <p className={styles.errorText}>{productError}</p>
              </div>
            ) : products.length === 0 ? (
              <div className={styles.stateContainer}>
                <p>No products found.</p>
              </div>
            ) : (
              <div className={styles.productContainer}>
                {products.map((item) => (
                  <Product key={item.id} product={item} />
                ))}
              </div>
            )}

            <div className={styles.pagination}>
              <button
                onClick={() => updateParams({ page: page - 1 })}
                disabled={page === 1}
                className={styles.pageBtn}
              >
                ← Prev
              </button>
              <span className={styles.pageNumber}>Page {page}</span>
              <button
                onClick={() => updateParams({ page: page + 1 })}
                disabled={!hasMore}
                className={styles.pageBtn}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
