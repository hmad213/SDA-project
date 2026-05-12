import React, { useState } from "react";
import Modal from "./Modal";
import {
  deleteCategory,
  createCategory,
  updateCategory,
} from "../services/categoryService";
import styles from "../styles/ProductsDialog.module.css";

const EMPTY_FORM = { category_name: "" };

export default function CategoryDialog({
  isOpen,
  onClose,
  categories,
  isLoading,
  error,
  refetch,
}) {
  const [deleting, setDeleting] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setDeleting(id);
      try {
        await deleteCategory(id);
        refetch();
      } catch (err) {
        console.error("Failed to delete category:", err);
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormMode("add");
    setFormError(null);
  };

  const handleEdit = (category) => {
    setEditingId(category.brand_id);
    setFormData({ category_name: category.brand_name });
    setFormMode("edit");
    setFormError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (formMode === "add") {
        await createCategory({ name: formData.brand_name });
      } else {
        await updateCategory(editingId, { name: formData.brand_name });
      }
      refetch();
      setFormMode(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setFormError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormMode(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Brand">
      {isLoading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : formMode ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{formMode === "add" ? "Add New Brand" : "Edit Brand"}</h3>
          {formError && <p className={styles.error}>{formError}</p>}

          <div className={styles.formGroup}>
            <label>Brand Name</label>
            <input
              name="category_name"
              value={formData.brand_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.addBtn}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : formMode === "add"
                  ? "Add Brand"
                  : "Save Changes"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <button className={styles.addBtn} onClick={handleAdd}>
            + Add New
          </button>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.brand_id}>
                      <td>{category.brand_name}</td>
                      <td className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            handleDeleteCategory(category.brand_id)
                          }
                          disabled={deleting === category.brand_id}
                        >
                          {deleting === category.brand_id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}
