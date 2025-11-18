// Start coding here
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import "./UserDashboard.css";
import "./Userdashboard.css";
import axios from "axios";
import io from "socket.io-client";
import {
  FaHome,
  FaChartBar,
  FaExchangeAlt,
  FaCog,
  FaTachometerAlt,
  FaUserCircle,
  FaExclamationTriangle,
  FaTable,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const socket = io("https://real-fraud-backend.onrender.com");
const COLORS = ["#22c55e", "#ef4444"]; // SUCCESS / FAILED

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    failedTransactions: 0,
    totalAmount: 0,
    totalCredits: 0,
    totalDebits: 0,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [showProfile, setShowProfile] = useState(false);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      fetchUserTransactions(parsedUser._id);
      socket.emit("registerUser", parsedUser._id);

      socket.on("newTransaction", (txn) => {
        if (txn.user === parsedUser._id) {
          setTransactions((prev) => [txn, ...prev]);
        }
      });
    } else {
      navigate("/login");
    }

    return () => socket.off("newTransaction");
  }, [navigate]);

  // Fetch transactions
  const fetchUserTransactions = async (userId) => {
    try {
      const res = await axios.get(
        `https://real-fraud-backend.onrender.com/api/transactions/user/${userId}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Update summary
  useEffect(() => {
    if (transactions.length > 0) {
      const totalTransactions = transactions.length;
      const failedTransactions = transactions.filter(
        (t) => t.status === "failed"
      ).length;

      const totalAmount = transactions.reduce((a, t) => a + t.amount, 0);
      const totalCredits = transactions
        .filter((t) => t.type === "credit")
        .reduce((a, t) => a + t.amount, 0);

      const totalDebits = transactions
        .filter((t) => t.type === "debit")
        .reduce((a, t) => a + t.amount, 0);

      setSummary({
        totalTransactions,
        failedTransactions,
        totalAmount,
        totalCredits,
        totalDebits,
      });
    }
  }, [transactions]);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  // Menu active highlight
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes("/transactions")) return "transactions";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/help")) return "help";
    if (path.includes("/change-password")) return "change-password";
    return "dashboard";
  };

  const pieData = [
    {
      name: "Successful",
      value: summary.totalTransactions - summary.failedTransactions,
    },
    { name: "Failed", value: summary.failedTransactions },
  ];

  const lineData = transactions.slice(0, 10).reverse().map((txn, i) => ({
    name: `Txn ${i + 1}`,
    Amount: txn.amount,
  }));

  const filteredTransactions =
    activeTab === "failed"
      ? transactions.filter((t) => t.status === "failed")
      : transactions;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div
          className="user-profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="sidebar-profile-photo"
            />
          ) : (
            <FaUserCircle className="user-icon" />
          )}

          <div>
            <p className="user-name">{user?.firstName || "Guest User"}</p>
            <span className="user-role">{user?.role || "Member"}</span>
          </div>
        </div>

        {showProfile && (
          <div className="profile-popup">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                className="popup-avatar-img"
                alt="Profile"
              />
            ) : (
              <FaUserCircle className="popup-avatar" />
            )}

            <h4>{user?.firstName}</h4>
            <p>{user?.email}</p>

            <button onClick={() => navigate("/Aprofile")}>
              View Profile
            </button>
          </div>
        )}

        <h2 className="logo">SmartFraud</h2>

        <ul className="menu">
          <li
            className={getActiveMenu() === "dashboard" ? "active" : ""}
            onClick={() => navigate("/userdashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </li>

          <li
            className={getActiveMenu() === "transactions" ? "active" : ""}
            onClick={() => navigate("/transactions")}
          >
            <FaExchangeAlt /> Transactions
          </li>

          <li
            className={getActiveMenu() === "reports" ? "active" : ""}
            onClick={() => navigate("/reports")}
          >
            <FaChartBar /> Reports
          </li>

          <li
            className={getActiveMenu() === "help" ? "active" : ""}
            onClick={() => navigate("/help")}
          >
            <FaQuestionCircle /> Help & Support
          </li>

          <li
            className={getActiveMenu() === "change-password" ? "active" : ""}
            onClick={() => navigate("/change-password")}
          >
            <FaCog /> Change Password
          </li>
        </ul>

        <div className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="header">
          <h2>📊 User Transaction Dashboard</h2>
          <p>Real-time insights into your activity</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="overview-section">
          <div className="overview-card" style={{ borderTop: "5px solid #3b82f6" }}>
            <h4>Total Transactions</h4>
            <p>{summary.totalTransactions}</p>
          </div>

          <div className="overview-card" style={{ borderTop: "5px solid #22c55e" }}>
            <h4>Total Amount</h4>
            <p>₹{summary.totalAmount.toLocaleString()}</p>
          </div>

          <div className="overview-card" style={{ borderTop: "5px solid #16a34a" }}>
            <h4>Credits</h4>
            <p>₹{summary.totalCredits.toLocaleString()}</p>
          </div>

          <div className="overview-card" style={{ borderTop: "5px solid #f97316" }}>
            <h4>Debits</h4>
            <p>₹{summary.totalDebits.toLocaleString()}</p>
          </div>

          <div className="overview-card" style={{ borderTop: "5px solid #ef4444" }}>
            <h4>Failed Transactions</h4>
            <p>{summary.failedTransactions}</p>
          </div>
        </div>

        {/* GRAPHS */}
        <div className="graph-section">
          <div className="graph-box">
            <h3>📈 Transaction Amount Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-box">
            <h3>💹 Transaction Status Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="transactions-frame">
          <div className="tab-buttons">
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              <FaTable /> All
            </button>

            <button
              className={activeTab === "failed" ? "active" : ""}
              onClick={() => setActiveTab("failed")}
            >
              <FaExclamationTriangle /> Failed
            </button>
          </div>

          <div className="transactions-section">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Fraud</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.slice(0, 8).map((t) => (
                    <tr key={t._id}>
                      <td>₹{t.amount}</td>
                      <td>{t.type}</td>

                      <td className={t.status === "failed" ? "negative" : "positive"}>
                        {t.status}
                      </td>

                      <td>{t.description}</td>
                      <td>{t.fraud_detected ? "🚨" : "✅"}</td>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
