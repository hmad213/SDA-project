import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getUsers, updateUser } from "../services/userService";
import styles from "../styles/AdminDialog.module.css";

export default function InviteAdminDialog({ isOpen, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getUsers(); // GET /user
        const nonAdmins = data.result.filter((u) => Number(u.role) !== 3);
        setUsers(nonAdmins);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedId) {
      setError("Please select a user.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateUser(selectedId, { role_id: 3 });
      setSuccess(true);
      setSelectedId("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to promote user.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setSelectedId("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite New Admin"
      large={false}
    >
      {loading ? (
        <p>Loading users...</p>
      ) : success ? (
        <div className={styles.successMsg}>
          <p>✅ User promoted to Admin successfully!</p>
          <button className={styles.saveBtn} onClick={handleClose}>
            Close
          </button>
        </div>
      ) : (
        <div className={styles.formWrapper}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formGroup}>
            <label>Select User to Promote</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={styles.input}
            >
              <option value="">-- Select a user --</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.username} — {u.name} (
                  {Number(u.role) === 2 ? "Retailer" : "Customer"})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSubmit}
              disabled={saving || !selectedId}
            >
              {saving ? "Promoting..." : "Make Admin"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
