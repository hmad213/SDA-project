import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Cart.module.css";
import { CartContext } from "../contexts/CartContext";

export default function Cart() {
  const { cart, removeAllFromCart } = useContext(CartContext);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const removeItem = (item) => {
    removeAllFromCart(item);
  };

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
              <div key={item.product.id} className={styles.card}>
                <img
                  className={styles.imagePlaceholder}
                  src={item.product.image_url}
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
              <button className={styles.checkoutBtn}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
