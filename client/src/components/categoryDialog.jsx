import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getCategories, deleteCategory } from "../services/categoryService";

export default function categoryDialog({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data.result || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        fetchCategories(); // Refresh list after deletion
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  // Fetch data only when the modal opens!
  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <div>
          <button style={{ marginBottom: "15px" }}>+ Add New Category</button>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Array.isArray(categories) && categories.map((category, index) => (
              <li key={category._id || category.id || index} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
                <span>{category.name}</span>
                <div>
                  <button style={{ marginRight: "10px" }}>Edit</button>
                  <button onClick={() => handleDeleteCategory(category._id || category.id)} style={{ color: "red" }}>Delete</button>
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