import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Adminstyle from "../styles/Admin.module.css";
import useProducts from "../hooks/useProducts";
import useCategory from "../hooks/useCategories";
import Modal from "../components/Modal";

import RequestsDialog from "../components/RequestsDialog";
import RetailersDialog from "../components/RetailerDialog";
import ProductsDialog from "../components/productsDialog";
import CategoryDialog from "../components/categoryDialog";

import manageProductsImg from "../assets/Manageproducts.png";
import manageRetailersImg from "../assets/Manageretailers.png";
import AdminAccessImg from "../assets/AdminAccess.png";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

import InviteAdminDialog from "../components/InviteAdminDialog";
import EditPermissionsDialog from "../components/EditPermissionsDialog";

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

      <div className={Adminstyle["page"]}>
        <main className={Adminstyle["main"]}>
          <div className={Adminstyle["Dashboard"]}>
            <h3>Dashboard</h3>
            <div className={Adminstyle["line"]}></div>

            <div className={Adminstyle["Stats"]}>
              <h2>Total Products : 5</h2>
              <h2>|</h2>
              <h2>Active Retailers : 18</h2>
              <h2>|</h2>
              <h2>Pending Approvals : 3</h2>
            </div>

            <div className={Adminstyle["maindash"]}>
              <div className={Adminstyle["ManageProducts"]}>
                <div className={Adminstyle["HeaderProducts"]}>
                  <img src={manageProductsImg} alt="Manage products" />
                </div>
                <div className={Adminstyle["body"]}>
                  <h2>New Products : 5</h2>
                  <h2>Products Status Overview</h2>
                </div>
                <table className={Adminstyle["Table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Activated</td>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>Pending</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
                <div className={Adminstyle["Footer"]}>
                  <button
                    onClick={() => setActiveModal("products")}
                    className={Adminstyle["button"]}
                  >
                    Manage Products
                  </button>
                  <button
                    onClick={() => setActiveModal("categories")}
                    className={Adminstyle["button"]}
                  >
                    Manage Categories
                  </button>
                </div>
              </div>

              <div className={Adminstyle["ManageRetailers"]}>
                <div className={Adminstyle["HeaderProducts"]}>
                  <img src={manageRetailersImg} alt="Manage Retailers" />
                </div>
                <div className={Adminstyle["body"]}>
                  <h2>Activated :</h2>
                  <h2>Pending :</h2>
                  <h2>Recent Registrations</h2>
                </div>
                <table className={Adminstyle["Table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Activated</td>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>Pending</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
                <div className={Adminstyle["Footer"]}>
                  <button
                    className={Adminstyle["button"]}
                    onClick={() => setActiveModal("retailers")}
                  >
                    View All Retailers
                  </button>
                  <button
                    className={Adminstyle["button"]}
                    onClick={() => setActiveModal("requests")}
                  >
                    Approve Requests
                  </button>
                </div>
              </div>

              <div className={Adminstyle["AccessAdmin"]}>
                <div className={Adminstyle["HeaderProducts"]}>
                  <img src={AdminAccessImg} alt="Admin Access" />
                </div>
                <div className={Adminstyle["body"]}>
                  <h2>Current Admins :</h2>
                  <h2>Access Levels :</h2>
                  {/* <h2>👥 User Management</h2> */}
                </div>

                <div className={Adminstyle["Footer"]}>
                  <button
                    className={Adminstyle["button"]}
                    onClick={() => setActiveModal("inviteAdmin")}
                  >
                    Invite New Admin
                  </button>
                  <button
                    className={Adminstyle["button"]}
                    onClick={() => setActiveModal("editPermissions")}
                  >
                    Edit Permissions
                  </button>
                </div>
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
      <InviteAdminDialog
        isOpen={activeModal === "inviteAdmin"}
        onClose={closeModal}
      />
      <EditPermissionsDialog
        isOpen={activeModal === "editPermissions"}
        onClose={closeModal}
      />
    </>
  );
}
