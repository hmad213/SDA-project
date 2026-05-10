import React from "react";
import { Link } from "react-router-dom";
import Adminstyle from "../styles/Retailer.module.css";

import manageProductsImg from "../assets/Manageproducts.png";
import manageRetailersImg from "../assets/Vieworders.png";
import AdminAccessImg from "../assets/AdminAccess.png";

export default function Retailer() {
  return (
    <>
      <div className={Adminstyle["header"]}>
        <Link to="/" className={Adminstyle["Arrow"]}>
          ⬅️ Back to home
        </Link>
        <h1>Hammad Mart</h1>
      </div>

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
                  <h2>📦 New Products : 5</h2>
                  <h2>📈 Products Status Overview</h2>
                </div>
                <table className={Adminstyle["Table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Activated</td>
                      <td>14</td>
                      <td>❌</td>
                    </tr>
                    <tr>
                      <td>Pending</td>
                      <td>0</td>
                      <td>✔️</td>
                    </tr>
                  </tbody>
                </table>
                <div className={Adminstyle["Footer"]}>
                  <Link to="/Catalog" className={Adminstyle["button"]}>
                    Add new Products
                  </Link>
                  <Link to="/Catalog" className={Adminstyle["button"]}>
                    Inventory Log
                  </Link>
                </div>
              </div>

              <div className={Adminstyle["ManageRetailers"]}>
                <div className={Adminstyle["HeaderProducts"]}>
                  <img src={manageRetailersImg} alt="Manage Retailers" />
                </div>
                <div className={Adminstyle["body"]}>
                  <h2>ℹ️ Activated :</h2>
                  <h2>⏳ Pending :</h2>
                  <h2>🗓️ Recent Registrations</h2>
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
                  <Link to="/Catalog" className={Adminstyle["button"]}>
                    View All Orders
                  </Link>
                  <Link to="/Catalog" className={Adminstyle["button"]}>
                    View Returns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
