import React, { useState } from "react";
import UserTransactions from "./UserTransactions";
import {
  FaChartBar,
  FaExchangeAlt,
  FaCog,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaLock,
} from "react-icons/fa";
import "./Transactions.css";

const Transactions = () => {

  // ✅ Updated logout — no popup, direct redirect
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home"; // instant redirect
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
          <a href="/userdashboard"><FaTachometerAlt /> Dashboard</a>
          <a href="/transactions" className="active"><FaExchangeAlt /> Transactions</a>
          <a href="/reports"><FaChartBar /> Reports</a>
          <a href="/help"><FaQuestionCircle /> Help & Support</a>
          {/* <a href="/Settings"><FaCog /> Settings</a> */}
          <a href="/change-password"><FaLock /> Change Password</a>
        </nav>

        {/* === Logout Button === */}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="transactions-page">
        {/* === USER TRANSACTIONS COMPONENT === */}
        <div>
          <UserTransactions />
        </div>
      </main>
    </div>
  );
};

export default Transactions;
