import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { getProduct } from "../services/productService";
import styles from "../styles/ProductIndex.module.css";

export default function ProductPage() {
  const { index } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(index);
        setProduct(data.result);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [index]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <>
      <Navbar />
      <main className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.imageSection}>
            <img
              src={product.image_url}
              alt={product.product_name}
              className={styles.image}
            />
          </div>

          <div className={styles.detailsSection}>
            <h1 className={styles.name}>{product.product_name}</h1>

            <div className={styles.rating}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>
                  {i < Math.round(product.rating) ? "★" : "☆"}
                </span>
              ))}
              <span className={styles.ratingNumber}>{product.rating}</span>
            </div>

            <p className={styles.price}>${Number(product.price).toFixed(2)}</p>

            <hr className={styles.divider} />

            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} />

          </div>
        </div>
      </main>
    </>
  );
}
