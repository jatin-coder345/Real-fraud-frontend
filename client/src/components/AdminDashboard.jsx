import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaTachometerAlt,
  FaUsers,
  FaPlug,
  FaCog,
  FaSignOutAlt,
  FaChartPie,
  FaShieldAlt,
  FaUserShield,
  FaLifeRing,
  FaExchangeAlt,
  FaUserCircle, // 👈 Added for Profile
} from "react-icons/fa";
import "./AdminDashboard.css";

const socket = io("https://real-fraud-backend.onrender.com");

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    fraudCases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }

    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://real-fraud-backend.onrender.com/api/transactions");
        const data = res.data || [];
        setTransactions(data);
        updateStats(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Real-time updates
    socket.emit("registerAdmin");
    socket.on("adminTransaction", (txn) => {
      setTransactions((prev) => {
        const updated = [txn, ...prev];
        updateStats(updated);
        return updated;
      });
    });

    return () => socket.off("adminTransaction");
  }, [navigate]);

  const updateStats = (data) => {
    const totalTransactions = data.length;
    const fraudCases = data.filter((t) => t.fraud_detected || t.isFraud).length;
    const uniqueUsers = new Set(data.map((t) => t.user || t.userId)).size;

    setStats({
      totalUsers: uniqueUsers,
      totalTransactions,
      fraudCases,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // alert("You have been logged out.");
    navigate("/home");
  };

  // ===== Chart Data =====
  const barData = [
    { name: "Jan", fraud: 12, legit: 110 },
    { name: "Feb", fraud: 8, legit: 150 },
    { name: "Mar", fraud: 14, legit: 130 },
    { name: "Apr", fraud: 20, legit: 140 },
    { name: "May", fraud: 10, legit: 170 },
  ];

  const pieData = [
    { name: "Legit Transactions", value: stats.totalTransactions - stats.fraudCases },
    { name: "Fraudulent Transactions", value: stats.fraudCases },
  ];

  const COLORS = ["#2ecc71", "#e74c3c"];

  return (
    <div className="admin-dashboard fullscreen">
      {/* ===== Sidebar ===== */}
      <aside className="admin-sidebar fullscreen-sidebar">
        <div className="sidebar-header">
          <FaShieldAlt className="sidebar-logo-icon" />
          <h2 className="logo-text">Fraud Detection</h2>
        </div>

        <h3 className="admin-name">
          {/* <FaUserShield /> Admin: {admin ? admin.firstName : "Admin"} */}
        </h3>

        <ul className="menu">
          <li className="active" onClick={() => navigate("/Adashboard")}>
            <FaTachometerAlt className="menu-icon" /> Dashboard
          </li>

         {/* 🧑‍💼 New Profile Section */}
          <li onClick={() => navigate("/Aprofile")}>
            <FaUserCircle className="menu-icon" /> Profile
          </li>


          <li onClick={() => navigate("/Ausers")}>
            <FaUsers className="menu-icon" /> Users
          </li>

         
          <li onClick={() => navigate("/AdminLiveTransactions")}>
            <FaExchangeAlt className="menu-icon" /> Live Transactions
          </li>
          <li onClick={() => navigate("/Aapis")}>
            <FaPlug className="menu-icon" /> APIs
          </li>
          {/* Optional future routes */}
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
          <div>
            <h1>Welcome, {admin ? admin.firstName : "Admin"} 👋</h1>
            <p>Real-time analytics of system transactions and fraud detection.</p>
          </div>
        </header>

        {/* ===== Stats Cards ===== */}
        <section className="stats-sectionn">
          <div className="stat-card users">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card transactions">
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions}</p>
          </div>
          <div className="stat-card fraud">
            <h3>Fraud Cases</h3>
            <p>{stats.fraudCases}</p>
          </div>
        </section>

        {/* ===== Charts ===== */}
        <section className="chart-container">
          <div className="chart-card">
            <h2>Fraud vs Legit (Monthly Overview)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fraud" fill="#e74c3c" name="Fraudulent" />
                <Bar dataKey="legit" fill="#2ecc71" name="Legitimate" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Fraud Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ===== Recent Transactions ===== */}
        <section className="table-section fullscreen-table">
          <h2>Recent Transactions</h2>
          {loading ? (
            <p className="loading-text">Loading transactions...</p>
          ) : (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 8).map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn._id.slice(-6).toUpperCase()}</td>
                      <td>{txn.user || txn.userId}</td>
                      <td>₹{txn.amount}</td>
                      <td className={txn.fraud_detected || txn.isFraud ? "fraud" : "legit"}>
                        {txn.fraud_detected || txn.isFraud ? "Fraud" : "Legit"}
                      </td>
                      <td>
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleString()
                          : txn.timestamp
                          ? new Date(txn.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
