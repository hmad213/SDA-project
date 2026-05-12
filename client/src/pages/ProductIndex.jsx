import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { getProduct } from "../services/productService";
import { postOrder } from "../services/orderService";  
import { useAuth } from "../contexts/AuthContext";  
import styles from "../styles/ProductIndex.module.css";

export default function ProductPage() {
  const { index } = useParams();
  const  navigate  = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false); 
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handleOrder = async () => {   
    if (!user) {
      navigate("/login");
      return;
    }
    setOrdering(true);
    try {
    await postOrder(product.vehicle_id); 
    setOrderSuccess(true);
  } catch (err) {
    console.log("Full error:", err);       
    console.log("Error response:", err.response?.data);
    alert(err.response?.data?.error || "Failed to place order");
  } finally {
    setOrdering(false);
  }
  };

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
            <h1 className={styles.name}>{product.type}</h1>

            <div className={styles.rating}>
              <span className={styles.ratingNumber}>{product.mileage} km</span> 
            </div>

            <p className={styles.price}>${Number(product.price).toFixed(2)}</p>

            <hr className={styles.divider} />

            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} />

            {orderSuccess ? (
              <div>
                <p style={{ color: "green" }}>Order placed successfully!</p>
                <button onClick={() => navigate("/orders")} className={styles.orderBtn}>
                  View My Orders
                </button>
              </div>
            ) : (
              <button
                onClick={handleOrder}
                disabled={ordering}
                className={styles.orderBtn}
              >
                {ordering ? "Placing Order..." : "Place Order"}
              </button>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
