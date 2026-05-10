import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  getPendingRequests,
  updateRequestStatus,
} from "../services/requestService";
import styles from "../styles/ProductsDialog.module.css";

export default function RequestsDialog({ isOpen, onClose }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await getPendingRequests();
        setRequests(data.result);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [isOpen]);

  const handleStatus = async (request_id, status) => {
    setProcessing(request_id);
    try {
      await updateRequestStatus(request_id, status);
      // remove from list since it's no longer pending
      setRequests((prev) => prev.filter((r) => r.request_id !== request_id));
    } catch (err) {
      console.error("Failed to update request:", err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Requests">
      {loading ? (
        <p>Loading requests...</p>
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
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.request_id}>
                    <td>{request.username}</td>
                    <td>{request.name}</td>
                    <td>{request.city}</td>
                    <td>{request.phone_number}</td>
                    <td>{request.status}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() =>
                          handleStatus(request.request_id, "ACCEPTED")
                        }
                        disabled={processing === request.request_id}
                      >
                        {processing === request.request_id
                          ? "Processing..."
                          : "Approve"}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          handleStatus(request.request_id, "REJECTED")
                        }
                        disabled={processing === request.request_id}
                      >
                        {processing === request.request_id
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No pending requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
