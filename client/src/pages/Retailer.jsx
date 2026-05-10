import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Adminstyle from "../styles/Retailer.module.css";

import manageProductsImg from "../assets/Manageproducts.png";
import manageRetailersImg from "../assets/Vieworders.png";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import ProductsDialog from "../components/productsDialog";
import OrdersDialog from "../components/OrdersDialog";
import { getProductsByRetailer } from "../services/productService";

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

      <div className={Adminstyle["page"]}>
        <main className={Adminstyle["main"]}>
          <div className={Adminstyle["Dashboard"]}>
            <h3>Dashboard</h3>
            <div className={Adminstyle["line"]}></div>

            <div className={Adminstyle["Stats"]}>
              <h2>Total Products : 5</h2>
              <h2>|</h2>
              <h2>Orders Completed : 18</h2>
              <h2>|</h2>
              <h2>Orders Pending : 3</h2>
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
                    className={Adminstyle["button"]}
                    onClick={() => setActiveModal("products")}
                  >
                    Manage Inventory
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
                      <td>Packed</td>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>In Transit</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Returns</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
                <div className={Adminstyle["Footer"]}>
                  <button
                    className={Adminstyle["button"]}
                    onClick={() => setActiveModal("orders")}
                  >
                    View All Orders
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

      <OrdersDialog isOpen={activeModal === "orders"} onClose={closeModal} />
    </>
  );
}
