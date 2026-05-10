import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getRetailers, deleteUser } from "../services/userService";
import styles from "../styles/ProductsDialog.module.css";

export default function RetailersDialog({ isOpen, onClose }) {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchRetailers = async () => {
      setLoading(true);
      try {
        const { data } = await getRetailers();
        setRetailers(data.result);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch retailers");
      } finally {
        setLoading(false);
      }
    };
    fetchRetailers();
  }, [isOpen]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this retailer?")) {
      setDeleting(id);
      try {
        await deleteUser(id);
        setRetailers((prev) => prev.filter((r) => r.user_id !== id));
      } catch (err) {
        console.error("Failed to delete retailer:", err);
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View All Retailers">
      {loading ? (
        <p>Loading retailers...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {retailers.length > 0 ? (
                retailers.map((retailer) => (
                  <tr key={retailer.user_id}>
                    <td>{retailer.username}</td>
                    <td>{retailer.name}</td>
                    <td>{retailer.city}</td>
                    <td>{retailer.address}</td>
                    <td>{retailer.phone_number}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(retailer.user_id)}
                        disabled={deleting === retailer.user_id}
                      >
                        {deleting === retailer.user_id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No retailers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
