import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./UserTransactions.css";

const socket = io("https://real-fraud-backend.onrender.com");

export default function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All"); // ✅ Dropdown filter
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search filter

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
    }

    return () => {
      socket.off("newTransaction");
    };
  }, []);

  // ✅ Fetch user's transactions
  const fetchUserTransactions = async (userId) => {
    try {
      const res = await axios.get(
        `https://real-fraud-backend.onrender.com/api/transactions/user/${userId}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching user transactions:", err);
    }
  };

  // ✅ Filter logic: first by dropdown (Completed/Failed/All), then by search
  const filteredTransactions = transactions
    .filter((t) =>
      filterStatus === "All"
        ? true
        : t.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .filter(
      (t) =>
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
    );

  return (
    <div className="user-transactions-container">
      <h2>💳 My Transactions</h2>
      {user && <p className="welcome">Welcome, {user.name}</p>}

      {/* === FILTERS SECTION (Dropdown + Search) === */}
      <div className="filter-bar">
        <div className="filter-item">
          <label htmlFor="statusFilter">Filter by Status: </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="searchBox">Search: </label>
          <input
            id="searchBox"
            type="text"
            placeholder="Search Credit, Debit, Amount, or Description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* === TRANSACTIONS TABLE === */}
      <div className="user-table-container">
        <table className="user-table">
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
              filteredTransactions.map((t) => (
                <tr key={t._id}>
                  <td>₹{t.amount}</td>
                  <td>{t.type}</td>
                  <td className={t.status === "failed" ? "failed" : "success"}>
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
  );
}