import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getAdmins, updateUser, deleteUser } from "../services/userService";
import styles from "../styles/AdminDialog.module.css";

export default function EditPermissionsDialog({ isOpen, onClose }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [roleEdits, setRoleEdits] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getAdmins();
        setAdmins(data.result);
        const initial = {};
        data.result.forEach((u) => {
          initial[u.user_id] = u.role;
        });
        setRoleEdits(initial);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [isOpen]);

  const handleRoleChange = (id, newRole) => {
    setSaveError(null);
    setRoleEdits((prev) => ({ ...prev, [id]: newRole }));
  };

  const handleSave = async (id) => {
    setSaving(id);
    setSaveError(null);
    try {
      await updateUser(id, { role: roleEdits[id] });
      setAdmins((prev) =>
        prev.map((u) => (u.user_id === id ? { ...u, role: roleEdits[id] } : u)),
      );
    } catch (err) {
      console.error("Failed to update role:", err);
      setSaveError(
        `Failed to save: ${err.response?.data?.error || err.message || "Unknown error"}`,
      );
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this admin?")) return;
    setDeleting(id);
    setSaveError(null);
    try {
      await deleteUser(id);
      setAdmins((prev) => prev.filter((u) => u.user_id !== id));
    } catch (err) {
      console.error("Failed to delete admin:", err);
      setSaveError(
        `Failed to remove: ${err.response?.data?.error || err.message || "Unknown error"}`,
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Permissions">
      {loading ? (
        <p>Loading admins...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          {saveError && <p className={styles.error}>{saveError}</p>}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.user_id}>
                      <td>{admin.username}</td>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>
                        <select
                          value={roleEdits[admin.user_id] ?? admin.role}
                          onChange={(e) =>
                            handleRoleChange(
                              admin.user_id,
                              Number(e.target.value),
                            )
                          }
                          className={styles.roleSelect}
                        >
                          <option value={3}>Admin</option>
                          <option value={2}>Retailer</option>
                          <option value={1}>Customer</option>
                        </select>
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={styles.saveBtn}
                          onClick={() => handleSave(admin.user_id)}
                          disabled={saving === admin.user_id}
                        >
                          {saving === admin.user_id ? "Saving..." : "Save"}
                        </button>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleDelete(admin.user_id)}
                          disabled={deleting === admin.user_id}
                        >
                          {deleting === admin.user_id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No admins found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}
