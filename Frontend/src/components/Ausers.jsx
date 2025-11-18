import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// ✅ Import sidebar icons
import {
  FaTachometerAlt,
  FaUsers,
  FaExchangeAlt,
  FaPlug,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";

const Ausers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // ✅ Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://real-fraud-backend.onrender.com/api/auth/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Logout Functionality
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


        <ul className="menu">
          <li onClick={() => navigate("/Admindashboard")}>
            <FaTachometerAlt className="menu-icon" /> Dashboard
          </li>

          <li onClick={() => navigate("/Aprofile")}>
            <FaUserCircle className="menu-icon" /> Profile
          </li>

          <li className="active" onClick={() => navigate("/Ausers")}>
            <FaUsers className="menu-icon" /> Users
          </li>

          <li onClick={() => navigate("/AdminLiveTransactions")}>
            <FaExchangeAlt className="menu-icon" /> Live Transactions
          </li>

          <li onClick={() => navigate("/Aapis")}>
            <FaPlug className="menu-icon" /> APIs
          </li>

          <li onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" /> Logout
          </li>
        </ul>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="admin-content fullscreen-content">
        <header className="admin-header">
          <h1>All Registered Users</h1>
          <p>View and manage all users and admins in the system.</p>
        </header>

        {/* ===== Users Table ===== */}
        <section className="table-section fullscreen-table">
          <h2>User Management</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email / Login ID</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.userId}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email || user.loginId}</td>
                    <td className={user.role === "admin" ? "fraud" : "legit"}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isActive ? "active" : "active"
                        }`}
                      >
                        {user.isActive ? "Active" : "active"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Ausers;
