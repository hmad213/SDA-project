import React from "react";
import styles from "../styles/Modal.module.css";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Don't render anything if closed

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}