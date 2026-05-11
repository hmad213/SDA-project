import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Navbar.module.css";
import SearchIcon from "../assets/search.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { submitRequest } from "../services/requestService";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
  };

  const handleApplyRetailer = async () => {
    try {
      await submitRequest();
      alert("Your request has been submitted successfully!");
    } catch (err) {
      console.error(err.response?.data?.error || "Failed to submit request");
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Al Abid Motors
      </Link>

      <form className={styles["search-container"]} onSubmit={handleSearch}>
        <div className={styles["search-box"]}>
          <input
            type="text"
            placeholder="Search"
            className={styles["search-input"]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.divider}></div>
          <button type="submit" className={styles["search-icon-btn"]}>
            <img src={SearchIcon} alt="Search" className={styles["search-svg"]} />
          </button>
        </div>
      </form>

      <div className={styles["action-buttons"]}>
        <Link className={styles.link} to="/catalog">
          <button className={styles["nav-btn"]}>Catalog</button>
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
                {(user.role === "admin" || user.role === "retailer") && (
                  <Link
                    to="/retailer"
                    className={styles["dropdown-item"]}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Retailer Page
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={styles["dropdown-item"]}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Admin Page
                  </Link>
                )}
                {user.role === "customer" && (
                  <button
                    className={styles["dropdown-item"]}
                    onClick={handleApplyRetailer}
                  >
                    Apply for Retailer
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}