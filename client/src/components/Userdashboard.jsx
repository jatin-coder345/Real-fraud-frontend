import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
const COLORS = ["#22c55e", "#ef4444"]; // Success = Green, Failed = Red

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

  // ===== Load logged-in user =====
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

    return () => {
      socket.off("newTransaction");
    };
  }, [navigate]);

  // ===== Fetch transactions =====
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

  // ===== Update summary whenever transactions change =====
  useEffect(() => {
    if (transactions.length > 0) {
      const totalTransactions = transactions.length;
      const failedTransactions = transactions.filter(
        (t) => t.status === "failed"
      ).length;
      const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
      const totalCredits = transactions
        .filter((t) => t.type === "credit")
        .reduce((acc, t) => acc + t.amount, 0);
      const totalDebits = transactions
        .filter((t) => t.type === "debit")
        .reduce((acc, t) => acc + t.amount, 0);

      setSummary({
        totalTransactions,
        failedTransactions,
        totalAmount,
        totalCredits,
        totalDebits,
      });
    }
  }, [transactions]);

  // ===== Charts Data =====
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

  // ===== Sidebar and Logout =====
  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  const handleMenuClick = (menu, path) => {
    navigate(path);
  };

  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes("/transactions")) return "transactions";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/help")) return "help";
    if (path.includes("/change-password")) return "change-password";
    return "dashboard";
  };

  // ===== Transaction filters =====
  const filteredTransactions =
    activeTab === "failed"
      ? transactions.filter((t) => t.status === "failed")
      : transactions;

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div
          className="user-profile top-profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          <FaUserCircle className="user-icon" />
          <div>
            <p className="user-name">{user?.firstName || "Guest User"}</p>
            <span className="user-role">{user?.role || "Member"}</span>
          </div>
        </div>

        {showProfile && (
          <div className="profile-popup">
            <FaUserCircle className="popup-avatar" />
            <h4>{user?.firstName || "Guest User"}</h4>
            <p>{user?.loginId || "user@example.com"}</p>
            <button onClick={() => navigate("/Aprofile")}>
              View Profile
            </button>
            {/* <button
              onClick={() => handleMenuClick("settings", "/settings")}
            >
              Settings
            </button> */}
            {/*<button className="logout-popup" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>*/}
          </div>
        )}

        <h2 className="logo">SmartFraud</h2>

        <ul className="menu">
          <li
            className={getActiveMenu() === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard", "/userdashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </li>
          <li
            className={getActiveMenu() === "transactions" ? "active" : ""}
            onClick={() => handleMenuClick("transactions", "/transactions")}
          >
            <FaExchangeAlt /> Transactions
          </li>
          <li
            className={getActiveMenu() === "reports" ? "active" : ""}
            onClick={() => handleMenuClick("reports", "/reports")}
          >
            <FaChartBar /> Reports
          </li>
          <li
            className={getActiveMenu() === "help" ? "active" : ""}
            onClick={() => handleMenuClick("help", "/help")}
          >
            <FaQuestionCircle /> Help & Support
          </li>
          <li
            className={getActiveMenu() === "change-password" ? "active" : ""}
            onClick={() =>
              handleMenuClick("change-password", "/change-password")
            }
          >
            <FaCog /> Change Password
          </li>
        </ul>

        <div className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content">
        <div className="header">
          <h2>📊 User Transaction Dashboard</h2>
          <p>Real-time insights into your activity</p>
        </div>

        {/* ===== Overview Cards ===== */}
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

        {/* ===== Graphs ===== */}
        <div className="graph-section">
          <div className="graph-box">
            <h3>📈 Transaction Amount Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Amount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Transactions Table ===== */}
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
