import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import {
  FaTachometerAlt,
  FaUsers,
  FaExchangeAlt,
  FaPlug,
  FaLifeRing,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserShield,
  FaUserCircle
} from "react-icons/fa";
import "./AdminLiveTransactions.css";

const socket = io("https://real-fraud-backend.onrender.com");

const AdminLiveTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://real-fraud-backend.onrender.com/api/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    socket.emit("registerAdmin");
    socket.on("adminTransaction", (txn) => {
      setTransactions((prev) => [txn, ...prev]);
    });

    return () => socket.off("adminTransaction");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // alert("You have been logged out.");
    navigate("/home");
  };

  return (
    <div className="admin-dashboard fullscreen">
      {/* ===== Sidebar ===== */}
      <aside className="admin-sidebar fullscreen-sidebar">
        <div className="sidebar-header">
          <FaShieldAlt className="sidebar-logo-icon" />
          <h2 className="logo-text">Fraud Detection</h2>
        </div>

        {/* <h3 className="admin-name">
          <FaUserShield /> Admin: {admin ? admin.firstName : "Admin"}
        </h3> */}

        <ul className="menu">
          <li onClick={() => navigate("/adminDashboard")}>
            <FaTachometerAlt className="menu-icon" /> Dashboard
          </li>
           <li onClick={() => navigate("/Aprofile")}>
            <FaUserCircle className="menu-icon" /> Profile
           </li>
          <li onClick={() => navigate("/Ausers")}>
            <FaUsers className="menu-icon" /> Users
          </li>
          <li className="active" onClick={() => navigate("/AdminLiveTransactions")}>
            <FaExchangeAlt className="menu-icon" /> Live Transactions
          </li>
          <li onClick={() => navigate("/Aapis")}>
            <FaPlug className="menu-icon" /> APIs
          </li>
          {/* <li onClick={() => navigate("/Ahelp")}>
            <FaLifeRing className="menu-icon" /> Help & Support
          </li>
          <li onClick={() => navigate("/Asettings")}>
            <FaCog className="menu-icon" /> Settings
          </li> */}
          <li onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" /> Logout
          </li>
        </ul>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="admin-content fullscreen-content">
        <header className="admin-header">
          <h1>📊 Live Transactions Feed</h1>
          <p>All system-wide transactions updated in real-time.</p>
        </header>

        {/* ===== Loader before data fetch ===== */}
        {loading ? (
          <div className="loader-container">
            <div className="inline-loader">
              <div className="moving-loader"></div>
              <p className="loading-text">Loading transactions...</p>
            </div>
          </div>
        ) : (
          <section className="transactions-section">
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Fraud</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr
                        key={t._id}
                        className={t.fraud_detected ? "fraud-row" : ""}
                      >
                        <td>{t.user}</td>
                        <td>₹{t.amount}</td>
                        <td>{t.type}</td>
                        <td>{t.status}</td>
                        <td>{t.fraud_detected ? "🚨 Fraud" : "✅ Legit"}</td>
                        <td>{new Date(t.date).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        <div className="inline-loader small">
                          <div className="moving-loader small"></div>
                          <p className="loading-text">Loading transactions...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminLiveTransactions;
