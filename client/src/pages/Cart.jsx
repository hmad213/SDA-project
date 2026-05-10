import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Cart.module.css";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { postOrder } from "../services/orderService";

export default function Cart() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cart, removeAllFromCart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0,
  );

  const removeItem = (item) => {
    removeAllFromCart(item);
  };

  const placeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) return;

    const formattedCart = cart.map((item) => ({
      product_id: item.product.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    setLoading(true);

    try {
      await postOrder(formattedCart);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.stateContainer}>
          <h2 className={styles.successTitle}>Order Placed!</h2>
          <p className={styles.successText}>
            Your order has been placed successfully.
          </p>
          <div className={styles.stateActions}>
            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/orders")}
            >
              View Orders
            </button>
            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/catalog")}
            >
              Browse More
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.stateContainer}>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.stateActions}>
            <button className={styles.browseBtn} onClick={() => setError(null)}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Cart</h1>
          <hr className={styles.seperatorLine} />
        </div>

        <div className={styles.gridContainer}>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.product_id} className={styles.card}>
                <img
                  className={styles.imagePlaceholder}
                  src={item.product.image_url}
                  alt={item.product.product_name}
                />
                <div className={styles.cardDetails}>
                  <h3 className={styles.itemName}>
                    {item.product.product_name}
                  </h3>
                  <p className={styles.itemPrice}>
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className={styles.cardActions}>
                    <span className={styles.quantity}>
                      Quantity: {item.quantity}
                    </span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>Your cart is empty!</p>
          )}
        </div>

        <hr className={styles.seperatorLine} />
        {cart.length > 0 && (
          <div className={styles.summaryContainer}>
            <div className={styles.summaryBox}>
              <h2>Order Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <hr className={styles.divider} />
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className={styles.checkoutBtn} onClick={placeOrder}>
                {loading ? "Proceeding..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
