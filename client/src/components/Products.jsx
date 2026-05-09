import { CartContext } from "../contexts/CartContext";
import styles from "../styles/products.module.css";
import React, { useContext } from "react";

export default function Product({ product }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  let foundIndex = cart.findIndex((item) => {
    return item.product.id == product.id;
  });

  function addProduct() {
    addToCart(product);
  }

  function removeProduct() {
    removeFromCart(product);
  }

  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        <img src={product.image_url} alt="" />
      </div>
      <div className={styles.info}>
        <h2>{product.product_name}</h2>
        <span>${product.price}</span>
        <div className={styles.rating}>
          <span>{product.rating}</span>
          <span className={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
            ))}
          </span>
        </div>
        {foundIndex === -1 ? (
          <button onClick={addProduct} className={styles.addButton}>
            Add
          </button>
        ) : (
          <>
            <div className={styles.buttons}>
              <button onClick={addProduct}>+</button>
              <input type="text" value={cart[foundIndex].quantity} disabled />
              <button onClick={removeProduct}>-</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
