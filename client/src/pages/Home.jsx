import Navbar from "../components/Navbar";
import React from "react";
import Products from "../components/Products";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";

import image from "../assets/bannerImg1.png";

import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import useProducts from "../hooks/useProducts";

export default function Home() {
  const { products, loading, error } = useProducts({ limit: 4 });

  return (
    <>
      {console.log(products)}
      <Navbar />
      <main className={styles.Page}>
        <Banner />
        <div className={styles["Navigate"]}>
          <div className={styles.headings}>
            <h2>Featured Items</h2>
            <Link to="/Catalog" className={styles["button"]}>
              <h3>View More</h3>
            </Link>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["Featured"]}>
            <div className={styles.cardContainer}>
              {loading ? (
                <div>Loading...</div>
              ) : (
                products.map((product) => {
                  return <Products product={product} />;
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
