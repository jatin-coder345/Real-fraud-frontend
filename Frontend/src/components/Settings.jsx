import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
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
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate hook

  const [settings, setSettings] = useState({
    changePassword: true,
    twoFactorAuth: true,
    notificationPref: false,
    languageTime: false,
    riskThreshold: true,
    modelSelection: true,
    updateModelFreq: false,
    realtimeDetection: false,
    loginActivity: true,
    sessionTimeout: true,
    accountLock: false,
    mfa: false,
    emailSmsAlert: true,
    alertFrequency: true,
    priorityFilter: true,
    autoEscalation: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  // ✅ Fixed Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-section">
          <FaUserCircle className="user-icon" />
          <h3>Welcome</h3>
          <p>User Panel</p>
        </div>

        <nav className="nav-menu">
          <a href="/Userdashboard">
            <FaTachometerAlt /> Dashboard
          </a>
          <a href="/Transactions">
            <FaExchangeAlt /> Transactions
          </a>
          <a href="/Reports">
            <FaChartBar /> Reports
          </a>
          <a href="/Help">
            <FaQuestionCircle /> Help & Support
          </a>
          <a href="/Settings" className="active">
            <FaCog /> Settings
          </a>
          <a href="/Change-Password">
            <FaLock /> Change Password
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Settings Content */}
      <main className="settings-page">
        <div className="settings-container">
          <h2>⚙️ Settings</h2>

          <div className="settings-grid">
            {/* === User Profile Settings === */}
            <div className="settings-section">
              <h3>User Profile Settings</h3>
              {[
                ["Change password", "changePassword"],
                ["Two-factor authentication", "twoFactorAuth"],
                ["Notification preferences", "notificationPref"],
                ["Language and timezone selection", "languageTime"],
              ].map(([label, key]) => (
                <div className="setting-item" key={key}>
                  <span>{label}</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => toggleSetting(key)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            {/* === Fraud Detection Configuration === */}
            <div className="settings-section">
              <h3>Fraud Detection Configuration</h3>
              {[
                ["Risk score threshold", "riskThreshold"],
                ["Model selection", "modelSelection"],
                ["Update model frequency", "updateModelFreq"],
                ["Enable real-time detection", "realtimeDetection"],
              ].map(([label, key]) => (
                <div className="setting-item" key={key}>
                  <span>{label}</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => toggleSetting(key)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            {/* === Security Settings === */}
            <div className="settings-section">
              <h3>Security Settings</h3>
              {[
                ["Login activity toggle", "loginActivity"],
                ["Session timeout duration", "sessionTimeout"],
                ["Account lock threshold", "accountLock"],
                ["Enable multi-factor authentication", "mfa"],
              ].map(([label, key]) => (
                <div className="setting-item" key={key}>
                  <span>{label}</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => toggleSetting(key)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            {/* === Alert & Notification Settings === */}
            <div className="settings-section">
              <h3>Alert & Notification Settings</h3>
              {[
                ["Email/SMS alert toggle", "emailSmsAlert"],
                ["Alert frequency", "alertFrequency"],
                ["Priority level filter", "priorityFilter"],
                ["Auto-escalation rules", "autoEscalation"],
              ].map(([label, key]) => (
                <div className="setting-item" key={key}>
                  <span>{label}</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => toggleSetting(key)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
