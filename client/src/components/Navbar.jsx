import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Navbar.module.css";
import SearchIcon from "../assets/search.svg";
import cartIcon from "../assets/cart.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <Link to="/login">
            <button className={`${styles["nav-btn"]} ${styles["login-btn"]}`}>
              Login
            </button>
          </Link>
        ) : (
          <div className={styles["dropdown-wrapper"]} ref={dropdownRef}>
            <button
              className={styles["nav-btn"]}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user.username} ▾
            </button>

            {dropdownOpen && (
              <div className={styles["dropdown-menu"]}>
                <Link
                  to="/orders"
                  className={styles["dropdown-item"]}
                  onClick={() => setDropdownOpen(false)}
                >
                  Orders
                </Link>
                <button
                  className={styles["dropdown-item"]}
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
