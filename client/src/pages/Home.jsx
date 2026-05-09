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
  //const { products, loading, error } = useProducts({limit: 4});

  const products = [
    {
      id: 1,
      product_name: "Wireless Headphones",
      price: 79.99,
      description:
        "Over-ear noise cancelling wireless headphones with 30hr battery life.",
      rating: 4.5,
      category_id: 1,
      retailer_id: 1,
      image_url: "https://placehold.co/300x300?text=Headphones",
    },
    {
      id: 2,
      product_name: "Mechanical Keyboard",
      price: 129.99,
      description:
        "TKL mechanical keyboard with RGB backlight and blue switches.",
      rating: 4.7,
      category_id: 1,
      retailer_id: 1,
      image_url: "https://placehold.co/300x300?text=Keyboard",
    },
    {
      id: 3,
      product_name: "Running Shoes",
      price: 89.99,
      description: "Lightweight running shoes with memory foam insole.",
      rating: 4.2,
      category_id: 2,
      retailer_id: 2,
      image_url: "https://placehold.co/300x300?text=Shoes",
    },
    {
      id: 4,
      product_name: "Yoga Mat",
      price: 34.99,
      description: "Non-slip eco-friendly yoga mat, 6mm thick.",
      rating: 4.0,
      category_id: 2,
      retailer_id: 2,
      image_url: "https://placehold.co/300x300?text=Yoga+Mat",
    },
  ];

  let loading = false;

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
