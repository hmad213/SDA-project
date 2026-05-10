import React from "react";
import Modal from "./Modal";
import { deleteProduct } from "../services/productService";

export default function ProductsDialog({ isOpen, onClose, products, isLoading, error, refetch }) {
  
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        refetch(); // Call the refetch function passed down from Admin.jsx
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Products">
      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <button style={{ marginBottom: "15px" }}>+ Add New Product</button>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Array.isArray(products) && products.map((product, index) => (
              <li key={product.product_id || product.id || index} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
                <span>{product.product_name || product.title || "Unnamed Product"}</span>
                <div>
                  <button onClick={() => handleDeleteProduct(product._id || product.id)} style={{ color: "red" }}>Delete</button>
                </div>
              </li>
            ))}
            {(!Array.isArray(products) || products.length === 0) && (
              <p>No products found in the database.</p>
            )}
          </ul>
        </div>
      )}
    </Modal>
  );
}