import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTransactions from "./UserTransactions.jsx";

import {
  FaChartBar,
  FaExchangeAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaLock,
} from "react-icons/fa";

import "./Transactions.css";

const Transactions = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      {/* === SIDEBAR === */}
      <aside className="sidebar">
        <div className="user-section">
          <FaUserCircle className="user-icon" />
          <h3></h3>
          <p></p>
        </div>

        <nav className="nav-menu">
          <button className="nav-btn" onClick={() => navigate("/userdashboard")}>
            <FaTachometerAlt /> Dashboard
          </button>

          <button className="nav-btn active" onClick={() => navigate("/transactions")}>
            <FaExchangeAlt /> Transactions
          </button>

          <button className="nav-btn" onClick={() => navigate("/reports")}>
            <FaChartBar /> Reports
          </button>

          <button className="nav-btn" onClick={() => navigate("/help")}>
            <FaQuestionCircle /> Help & Support
          </button>

          <button className="nav-btn" onClick={() => navigate("/change-password")}>
            <FaLock /> Change Password
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="transactions-page">
        <UserTransactions />
      </main>
    </div>
  );
};

export default Transactions;
