import React from "react";
import { useRouteError, Link } from "react-router-dom";
import styles from "../styles/ErrorPage.module.css";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className={styles["error-container"]}>
      <div className={styles["error-content"]}>
        <h1 className={styles.heading}>Uhm...</h1>
        <br></br>
        <p className={styles.subtext}>
          Looks like an error here
        </p>

        <p className={styles["error-message"]}>
          <i>{error?.statusText || error?.message || "Unknown Err"}</i>
        </p>

        <Link to="/" className={styles["home-button"]}>
          Back To Home
        </Link>
      </div>
    </div>
  );
}
