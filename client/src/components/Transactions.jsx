import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  // ✅ Helper to detect active menu
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes("/transactions")) return "transactions";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/help")) return "help";
    if (path.includes("/change-password")) return "change-password";
    return "dashboard";
  };

  // ✅ Navigator function
  const goTo = (path) => navigate(path);

  return (
    <div className="dashboard-container">
      {/* === SIDEBAR === */}
      <aside className="sidebar">
        <div className="user-section">
          <FaUserCircle className="user-icon" />
          <h3></h3>
          <p></p>
        </div>

        {/* === Navigation === */}
        <nav className="nav-menu">

          <div
            className={`nav-item ${
              getActiveMenu() === "dashboard" ? "active" : ""
            }`}
            onClick={() => goTo("/userdashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </div>

          <div
            className={`nav-item ${
              getActiveMenu() === "transactions" ? "active" : ""
            }`}
            onClick={() => goTo("/transactions")}
          >
            <FaExchangeAlt /> Transactions
          </div>

          <div
            className={`nav-item ${
              getActiveMenu() === "reports" ? "active" : ""
            }`}
            onClick={() => goTo("/reports")}
          >
            <FaChartBar /> Reports
          </div>

          <div
            className={`nav-item ${
              getActiveMenu() === "help" ? "active" : ""
            }`}
            onClick={() => goTo("/help")}
          >
            <FaQuestionCircle /> Help & Support
          </div>

          <div
            className={`nav-item ${
              getActiveMenu() === "change-password" ? "active" : ""
            }`}
            onClick={() => goTo("/change-password")}
          >
            <FaLock /> Change Password
          </div>
        </nav>

        {/* === Logout Button === */}
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
