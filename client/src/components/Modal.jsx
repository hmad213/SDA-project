import React from "react";
import styles from "../styles/Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  large = true,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${large ? styles.large : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
