import styles from "../styles/products.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Product({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/product/${product.product_id}`)}
    >
      <div className={styles.imgContainer}>
        <img src={product.image_url} alt="" />
      </div>
      <div className={styles.info}>
        <h2>{product.product_name}</h2>
        <span>${product.price}</span>
        <div className={styles.location}>
          <span>{product.location}</span>
        </div>
      </div>
    </div>
  );
}