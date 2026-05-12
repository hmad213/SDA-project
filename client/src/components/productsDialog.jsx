import React, { useState } from "react";
import Modal from "./Modal";
import {
  deleteProduct,
  createProduct,
  updateProduct,
} from "../services/productService";
import styles from "../styles/ProductsDialog.module.css";
import { useAuth } from "../contexts/AuthContext";

const EMPTY_FORM = {
  type: "",
  price: "",
  description: "",
  milage: "",
  brand_id: "",
  image_url: "",
};

export default function ProductsDialog({
  isOpen,
  onClose,
  products,
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

  const { user } = useAuth();

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeleting(id);
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        console.error("Failed to delete product:", err);
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleAdd = () => {
    setFormData({ ...EMPTY_FORM, retailer_id: user.id });
    setEditingId(null);
    setFormMode("add");
    setFormError(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.vehicle_id);
    setFormData({
      product_name: product.type,
      price: product.price,
      description: product.description,
      rating: product.mileage,
      category_id: product.brand_id,
      retailer_id: product.retailer_id,
      image_url: product.image_url,
    });
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
        await createProduct(formData);
      } else {
        await updateProduct(editingId, formData);
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
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Vehicles">
      {isLoading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : formMode ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{formMode === "add" ? "Add New vehicle" : "Edit vehicle"}</h3>
          {formError && <p className={styles.error}>{formError}</p>}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                name="product_name"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Rating (0-5)</label>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Brand ID</label>
              <input
                name="category_id"
                type="number"
                value={formData.brand_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image URL</label>
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
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
                  ? "Add Product"
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
                  <th>Price</th>
                  <th>Mileage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(products) && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.vehicle_id}>
                      <td>{product.type}</td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>{product.mileage}</td>
                      <td className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            handleDeleteProduct(product.product_id)
                          }
                          disabled={deleting === product.product_id}
                        >
                          {deleting === product.product_id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No vehicles found.</td>
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
