import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Adminstyle from "../styles/Admin.module.css";
import useProducts from "../hooks/useProducts";
import useCategory from "../hooks/useCategories";

import RequestsDialog from "../components/RequestsDialog";
import RetailersDialog from "../components/RetailerDialog";
import ProductsDialog from "../components/productsDialog";
import CategoryDialog from "../components/categoryDialog";

import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Admin() {
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategory();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />

      <div className={Adminstyle.page}>
        <main className={Adminstyle.main}>
          <div className={Adminstyle.dashHeader}>
            <h2 className={Adminstyle.dashTitle}>Dashboard</h2>
            <span className={Adminstyle.adminBadge}>ADMIN</span>
          </div>

          <p className={Adminstyle.sectionLabel}>Overview</p>
          <div className={Adminstyle.statsGrid}>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>Vehicles</div>
              <div className={Adminstyle.statValue}>14</div>
              <div className={Adminstyle.statSub}>5 new this week</div>
            </div>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>Retailers</div>
              <div className={Adminstyle.statValue}>14</div>
              <div className={Adminstyle.statSub}>0 pending approval</div>
            </div>
            <div className={Adminstyle.statCard}>
              <div className={Adminstyle.statLabel}>Admins</div>
              <div className={Adminstyle.statValue}>—</div>
              <div className={Adminstyle.statSub}>Manage access below</div>
            </div>
          </div>

          <div className={Adminstyle.divider} />
          <p className={Adminstyle.sectionLabel}>Quick actions</p>

          <div className={Adminstyle.cardsGrid}>
            {/* Vehicles card */}
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
                <h3 className={Adminstyle.cardTitle}>Vehicles</h3>
                <p className={Adminstyle.cardDesc}>
                  Add, edit, or remove vehicle listings and manage brands.
                </p>
              </div>
              <div className={Adminstyle.cardActions}>
                <button
                  className={Adminstyle.btnPrimary}
                  onClick={() => setActiveModal("products")}
                >
                  Manage vehicles
                </button>
                <button
                  className={Adminstyle.btnGhost}
                  onClick={() => setActiveModal("categories")}
                >
                  Manage brands
                </button>
              </div>
            </div>

            {/* Retailers card */}
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
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className={Adminstyle.cardContent}>
                <h3 className={Adminstyle.cardTitle}>Retailers</h3>
                <p className={Adminstyle.cardDesc}>
                  View all retailers and approve pending registration requests.
                </p>
              </div>
              <div className={Adminstyle.cardActions}>
                <button
                  className={Adminstyle.btnPrimary}
                  onClick={() => setActiveModal("retailers")}
                >
                  View retailers
                </button>
                <button
                  className={Adminstyle.btnGhost}
                  onClick={() => setActiveModal("requests")}
                >
                  Approve requests
                </button>
              </div>
            </div>

            {/* Admin access card */}
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className={Adminstyle.cardContent}>
                <h3 className={Adminstyle.cardTitle}>Admin access</h3>
                <p className={Adminstyle.cardDesc}>
                  Invite new admins and configure role permissions.
                </p>
              </div>
              <div className={Adminstyle.cardActions}>
                <Link to="/Catalog" className={Adminstyle.btnPrimary}>
                  Invite admin
                </Link>
                <Link to="/Catalog" className={Adminstyle.btnGhost}>
                  Edit permissions
                </Link>
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
      <CategoryDialog
        isOpen={activeModal === "categories"}
        onClose={closeModal}
        categories={categories}
        isLoading={categoriesLoading}
        error={categoriesError}
        refetch={refetchCategories}
      />
      <RetailersDialog
        isOpen={activeModal === "retailers"}
        onClose={closeModal}
      />
      <RequestsDialog
        isOpen={activeModal === "requests"}
        onClose={closeModal}
      />

      <Footer />
    </>
  );
}
