import React from "react";
import styles from "../styles/Navbar.module.css";
import SearchIcon from "../assets/search.svg";
import cartIcon from "../assets/cart.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Hammad Mart
      </Link>

      {/*SearchBar*/}
      <div className={styles["search-container"]}>
        <div className={styles["search-box"]}>
          <input
            type="text"
            placeholder="Search"
            className={styles["search-input"]}
          />
          <div className={styles.divider}></div>
          <button className={styles["search-icon-btn"]}>
            <img
              src={SearchIcon}
              alt="Search"
              className={styles["search-svg"]}
            />
          </button>
        </div>
      </div>

      {/*buttons*/}
      <div className={styles["action-buttons"]}>
        <Link className={styles.link} to="/catalog">
          <button className={styles["nav-btn"]}>Catalog</button>
        </Link>
        <Link to="/cart" className={styles.link}>
          <button className={`${styles["nav-btn"]} ${styles["cart-btn"]}`}>
            Cart
            <img src={cartIcon} alt="" className={styles.cartSVG} />
          </button>
        </Link>
        {!user ? (
          <button className={`${styles["nav-btn"]} ${styles["login-btn"]}`}>
            Login
          </button>
        ) : (
          <button>{user.username}</button>
        )}
      </div>
    </nav>
  );
}
