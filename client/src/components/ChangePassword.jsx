import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChartBar,
  FaExchangeAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaLock,
} from "react-icons/fa";
// import cpassword from "../assets/cpassword.jpeg";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage("❌ New passwords do not match!");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return setMessage("❌ Please log in again — token missing.");
      }

      const res = await axios.put(
        "https://real-fraud-backend.onrender.com/api/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ " + res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || "Error changing password")
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="user-section">
          <FaUserCircle className="user-icon" />
        </div>

       <nav className="nav-menu">
  <button className="nav-btn" onClick={() => navigate("/userdashboard")}>
    <FaTachometerAlt /> Dashboard
  </button>

  <button className="nav-btn" onClick={() => navigate("/transactions")}>
    <FaExchangeAlt /> Transactions
  </button>

  <button className="nav-btn active" onClick={() => navigate("/reports")}>
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

      {/* ===== Main Content ===== */}
      <main
        className="change-password-page"
        style={{
          backgroundImage: `url(https://i.ibb.co/1fxBzpCg/cpassword.jpg )`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="change-password-container simple">

          <h2>Change Password</h2>

          <form onSubmit={handleChangePassword}>
            {/* Old Password */}
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              required
            />

            {/* New Password */}
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />

            {/* Confirm Password */}
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />

            <button type="submit">Update Password</button>
          </form>

          {message && (
            <p
              className={`message ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
