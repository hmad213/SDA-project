import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Adminstyle from "../styles/Retailer.module.css";

import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import ProductsDialog from "../components/productsDialog";
import OrdersDialog from "../components/OrdersDialog";
import { getProductsByRetailer } from "../services/productService";
import Footer from "../components/Footer";

export default function Retailer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    if (user.role !== "admin" && user.role !== "retailer") {
      navigate("/");
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProductsByRetailer(user.id);
        setProducts(data.result);
      } catch (err) {
        setProductsError(
          err.response?.data?.error || "Failed to fetch products",
        );
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const refetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data } = await getProductsByRetailer(user.id);
      setProducts(data.result);
    } catch (err) {
      setProductsError(err.response?.data?.error || "Failed to fetch products");
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={Adminstyle.page}>
        <main className={Adminstyle.main}>
          <div className={Adminstyle.dashHeader}>
            <h2 className={Adminstyle.dashTitle}>Dashboard</h2>
            <span className={Adminstyle.retailerBadge}>RETAILER</span>
          </div>

          <p className={Adminstyle.sectionLabel}>Overview</p>
          <div className={Adminstyle.statsGrid}>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>Inventory</div>
              <div className={Adminstyle.statValue}>
                {products.length || "—"}
              </div>
              <div className={Adminstyle.statSub}>Active listings</div>
            </div>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>Processed</div>
              <div className={Adminstyle.statValue}>14</div>
              <div className={Adminstyle.statSub}>Orders completed</div>
            </div>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>In transit</div>
              <div className={Adminstyle.statValue}>0</div>
              <div className={Adminstyle.statSub}>Pending delivery</div>
            </div>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>Returns</div>
              <div className={Adminstyle.statValue}>0</div>
              <div className={Adminstyle.statSub}>Open return requests</div>
            </div>
          </div>

          <div className={Adminstyle.divider} />
          <p className={Adminstyle.sectionLabel}>Quick actions</p>

          <div className={Adminstyle.cardsGrid}>
            {/* Inventory card */}
            <div className={Adminstyle.actionCard}>
              <div className={Adminstyle.cardIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className={Adminstyle.cardContent}>
                <h3 className={Adminstyle.cardTitle}>Inventory</h3>
                <p className={Adminstyle.cardDesc}>
                  Add, update, or remove your vehicle listings.
                </p>
              </div>
              <div className={Adminstyle.cardActions}>
                <button
                  className={Adminstyle.btnPrimary}
                  onClick={() => setActiveModal("products")}
                >
                  Manage inventory
                </button>
              </div>
            </div>

            {/* Orders card */}
            <div className={Adminstyle.actionCard}>
              <div className={Adminstyle.cardIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 17H7A5 5 0 0 1 7 7h10a5 5 0 0 1 4.9 6" />
                  <path d="M14 12h8m-3-3 3 3-3 3" />
                </svg>
              </div>
              <div className={Adminstyle.cardContent}>
                <h3 className={Adminstyle.cardTitle}>Orders</h3>
                <p className={Adminstyle.cardDesc}>
                  Review and track all deals and order statuses.
                </p>
              </div>
              <div className={Adminstyle.cardActions}>
                <button
                  className={Adminstyle.btnPrimary}
                  onClick={() => setActiveModal("orders")}
                >
                  View all deals
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ProductsDialog
        isOpen={activeModal === "products"}
        onClose={closeModal}
        products={products}
        isLoading={productsLoading}
        error={productsError}
        refetch={refetchProducts}
      />
      <OrdersDialog isOpen={activeModal === "orders"} onClose={closeModal} />
      <Footer />
    </>
  );
}
