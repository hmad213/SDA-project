import React from "react";
import Modal from "./Modal";
import { deleteCategory } from "../services/categoryService";

export default function CategoryDialog({ isOpen, onClose, categories, isLoading, error, refetch }) {
  
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      {isLoading ? (
        <p>Loading categories</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <button style={{ marginBottom: "15px" }}>+ Add New Category</button>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Array.isArray(categories) && categories.map((category, index) => (
              <li key={category.category_id || category.id || index} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
                <span>{category.category_name || "Unnamed Category"}</span>
                <div>
                  <button style={{ marginRight: "10px" }}>Edit</button>
                  <button onClick={() => handleDeleteCategory(category.category_id || category.id)} style={{ color: "red" }}>Delete</button>
                </div>
              </li>
            ))}
            {(!Array.isArray(categories) || categories.length === 0) && (
              <p>No categories found in the database.</p>
            )}
          </ul>
        </div>
      )}
    </Modal>
  );
}