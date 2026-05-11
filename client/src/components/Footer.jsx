import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span className={styles.logo}>Al Abid Motors</span>
        <div className={styles.links}>
          <Link to="/catalog" className={styles.link}>Catalog</Link>
          <Link to="/about" className={styles.link}>About</Link>
          <Link to="/contact" className={styles.link}>Contact</Link>
        </div>
        <span className={styles.copy}>© 2026 Al Abid Motors. All rights reserved.</span>
      </div>
    </footer>
  );
}