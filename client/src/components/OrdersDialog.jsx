import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getOrdersByRetailer } from "../services/orderService";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/ProductsDialog.module.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function OrdersDialog({ isOpen, onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await getOrdersByRetailer(user.id);
        setOrders(data.result);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View All Orders">
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td>#{order.order_id}</td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>${Number(order.price).toFixed(2)}</td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>{formatDate(order.delivery_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
