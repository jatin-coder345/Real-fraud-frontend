// Reports.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
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
import "./Reports.css";

const socket = io("https://real-fraud-backend.onrender.com");
const COLORS = ["#ef4444", "#facc15", "#22c55e"]; // red, yellow, green

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    totalReports: 0,
    fraudDetected: 0,
    reviewPending: 0,
    resolvedCases: 0,
    detectionAccuracy: 0,
  });

  const [trendData, setTrendData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // ===== Load user and fetch data =====
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserReports(parsedUser._id);

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

  // ===== Fetch user's reports (transactions) =====
  const fetchUserReports = async (userId) => {
    try {
      const res = await axios.get(
        `https://real-fraud-backend.onrender.com/api/transactions/user/${userId}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // ===== Calculate Stats =====
  useEffect(() => {
    if (transactions.length === 0) return;

    const totalReports = transactions.length;
    const fraudDetected = transactions.filter((t) => t.fraud_detected).length;
    const reviewPending = transactions.filter(
      (t) => t.status === "pending" || t.status === "under-review"
    ).length;
    const resolvedCases = transactions.filter(
      (t) => t.status === "completed" || t.status === "resolved"
    ).length;

    const detectionAccuracy = totalReports
      ? (((totalReports - fraudDetected) / totalReports) * 100).toFixed(1)
      : 0;

    setSummary({
      totalReports,
      fraudDetected,
      reviewPending,
      resolvedCases,
      detectionAccuracy,
    });

    // ===== Prepare Chart Data =====
    const dailyMap = {};

    transactions.forEach((t) => {
      const rawDate = t.createdAt || t.date || t.timestamp;
      const parsedDate = new Date(rawDate);

      // ✅ Only include valid dates
      if (!isNaN(parsedDate)) {
        const day = parsedDate.toLocaleDateString("en-US", { weekday: "short" });
        dailyMap[day] = (dailyMap[day] || 0) + 1;
      } else {
        console.warn("Invalid date found:", t);
      }
    });

    const trendArr = Object.keys(dailyMap).map((d) => ({
      name: d,
      value: dailyMap[d],
    }));
    setTrendData(trendArr);

    // --- Risk level breakdown
    const high = transactions.filter(
      (t) => t.risk_level === "high" || (t.fraud_detected && !t.risk_level)
    ).length;
    const medium = transactions.filter((t) => t.risk_level === "medium").length;
    const low = transactions.filter((t) => t.risk_level === "low").length;

    setPieData([
      { name: "High Risk", value: high },
      { name: "Medium Risk", value: medium },
      { name: "Low Risk", value: low },
    ]);
  }, [transactions]);

  // ===== Logout (updated – no popup) =====
  const handleLogout = () => {
    localStorage.clear();
    navigate("/home"); // instantly redirects to home page
  };

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="user-section">
          <FaUserCircle className="user-icon" />
        </div>

        <nav className="nav-menu">
          <a href="/userdashboard">
            <FaTachometerAlt /> Dashboard
          </a>
          <a href="/transactions">
            <FaExchangeAlt /> Transactions
          </a>
          <a href="/reports" className="active">
            <FaChartBar /> Reports
          </a>
          <a href="/help">
            <FaQuestionCircle /> Help & Support
          </a>
          <a href="/change-password">
            <FaLock /> Change Password
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="reports-page">
        <div className="reports-header">
          <h1>📊 Real-Time Fraud Reports</h1>
          <p>Live analytics generated from your recent transactions</p>
        </div>

        {/* ===== Summary Cards ===== */}
        <div className="summary-cards">
          <div className="summary-card" style={{ borderTop: "4px solid #6366f1" }}>
            <h4>Total Reports</h4>
            <p>{summary.totalReports}</p>
          </div>
          <div className="summary-card" style={{ borderTop: "4px solid #ef4444" }}>
            <h4>Fraud Detected</h4>
            <p>{summary.fraudDetected}</p>
          </div>
          <div className="summary-card" style={{ borderTop: "4px solid #facc15" }}>
            <h4>Review Pending</h4>
            <p>{summary.reviewPending}</p>
          </div>
          <div className="summary-card" style={{ borderTop: "4px solid #22c55e" }}>
            <h4>Resolved Cases</h4>
            <p>{summary.resolvedCases}</p>
          </div>
          <div className="summary-card" style={{ borderTop: "4px solid #0ea5e9" }}>
            <h4>Detection Accuracy</h4>
            <p>{summary.detectionAccuracy}%</p>
          </div>
        </div>

        {/* ===== Charts Section ===== */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>📈 Weekly Transaction Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>🧠 Risk Level Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Detailed Table ===== */}
        <div className="table-section">
          <h3>📋 Recent Reports</h3>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Fraud</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((t) => {
                const transactionDate =
                  t.createdAt || t.date || t.timestamp || null;
                const parsedDate = new Date(transactionDate);
                return (
                  <tr key={t._id}>
                    <td>{t._id.slice(-6).toUpperCase()}</td>
                    <td>
                      {!isNaN(parsedDate)
                        ? parsedDate.toLocaleString()
                        : "N/A"}
                    </td>
                    <td>₹{t.amount}</td>
                    <td className={t.status === "failed" ? "failed" : "success"}>
                      {t.status}
                    </td>
                    <td>{t.fraud_detected ? "🚨" : "✅"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Reports;
