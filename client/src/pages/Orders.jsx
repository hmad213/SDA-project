import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Orders.module.css";
import { getOrdersByCustomer, getOrderByIndex } from "../services/orderService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailLoading, setDetailLoading] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          navigate("/");
          return;
        }
        const { data } = await getOrdersByCustomer(user.id);
        setOrders(data.result);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleView = async (order_id) => {
    if (expandedOrder === order_id) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(order_id);

    if (orderDetails[order_id]) return;

    setDetailLoading(order_id);
    try {
      const { data } = await getOrderByIndex(order_id);
      setOrderDetails((prev) => ({ ...prev, [order_id]: data.result }));
      console.log(orderDetails)
    } catch (err) {
      console.error("Failed to fetch order details");
    } finally {
      setDetailLoading(null);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <main className={styles.orderMain}>
        <h2>My Orders</h2>
        <hr />
        <div className={styles.orderContainer}>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className={styles.order}>

                <div className={styles.orderHeader}>
                  <h3>Order #{order.order_id}</h3>
                  <span>Placed on {formatDate(order.order_date)}</span>
                  <span>Delivery: {formatDate(order.delivery_date)}</span>
                  <button onClick={() => handleView(order.order_id)}>
                    {expandedOrder === order.order_id ? "Hide ▲" : "View ▼"}
                  </button>
                </div>

                {expandedOrder === order.order_id && (
                  <div className={styles.orderDetails}>
                    {detailLoading === order.order_id ? (
                      <p>Loading details...</p>
                    ) : (
                      <table className={styles.detailTable}>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails[order.order_id]?.map((item) => (
                            <tr key={item.product_id}>
                              <td>
                                <div className={styles.productCell}>
                                  <img src={item.image_url} alt={item.product_name} />
                                  <span>{item.product_name}</span>
                                </div>
                              </td>
                              <td>{item.quantity}</td>
                              <td>${Number(item.price).toFixed(2)}</td>
                              <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3}><strong>Total</strong></td>
                            <td>
                              <strong>
                                ${orderDetails[order.order_id]
                                  ?.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
                                  .toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    )}
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}