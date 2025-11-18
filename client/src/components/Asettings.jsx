import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Asettings.css";

const Asettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    changePassword: true,
    twoFactorAuth: true,
    notifications: true,
    languageTime: false,

    riskThreshold: true,
    modelSelection: true,
    modelFrequency: false,
    realTimeDetection: false,

    loginToggle: true,
    sessionTimeout: true,
    accountLock: false,
    mfa: false,

    emailAlert: true,
    alertFrequency: true,
    priorityFilter: false,
    autoEscalation: false,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/home");
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  return (
    <div className="admin-dashboard fullscreen">
      {/* ===== Sidebar ===== */}
      <aside className="admin-sidebar fullscreen-sidebar">
        <h2 className="logo">FraudGuard Admin</h2>
        <ul className="menu">
          <li onClick={() => navigate("/Admindashboard")}>Dashboard</li>
          <li onClick={() => navigate("/Ausers")}>Users</li>
          <li onClick={() => navigate("/AdminLiveTransactions")}>Live Transactions</li> {/* 👈 Added */}
          <li onClick={() => navigate("/Aapis")}>APIs</li>
          <li onClick={() => navigate("/Ahelp")}>Help & Support</li>
          <li className="active" onClick={() => navigate("/Asettings")}>
            Settings
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="admin-content fullscreen-content">
        <header className="admin-header">
          <h1>Settings</h1>
        </header>

        <section className="settings-grid">
          {/* ====== User Profile Settings ====== */}
          <div className="settings-box">
            <h3>User Profile Settings</h3>
            {[
              { label: "Change password", key: "changePassword" },
              { label: "Two-factor authentication", key: "twoFactorAuth" },
              { label: "Notification preferences", key: "notifications" },
              { label: "Language and timezone selection", key: "languageTime" },
            ].map(({ label, key }) => (
              <div className="setting-item" key={key}>
                <span>{label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={() => handleToggle(key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>

          {/* ====== Fraud Detection Configuration ====== */}
          <div className="settings-box">
            <h3>Fraud Detection Configuration</h3>
            {[
              { label: "Risk score threshold", key: "riskThreshold" },
              { label: "Model selection", key: "modelSelection" },
              { label: "Update model frequency", key: "modelFrequency" },
              { label: "Enable real-time detection", key: "realTimeDetection" },
            ].map(({ label, key }) => (
              <div className="setting-item" key={key}>
                <span>{label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={() => handleToggle(key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>

          {/* ====== Security Settings ====== */}
          <div className="settings-box">
            <h3>Security Settings</h3>
            {[
              { label: "Login activity toggle", key: "loginToggle" },
              { label: "Session timeout duration", key: "sessionTimeout" },
              { label: "Account lock threshold", key: "accountLock" },
              { label: "Enable multi-factor authentication", key: "mfa" },
            ].map(({ label, key }) => (
              <div className="setting-item" key={key}>
                <span>{label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={() => handleToggle(key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>

          {/* ====== Alert & Notification Settings ====== */}
          <div className="settings-box">
            <h3>Alert & Notification Settings</h3>
            {[
              { label: "Email/SMS alert toggle", key: "emailAlert" },
              { label: "Alert frequency", key: "alertFrequency" },
              { label: "Priority level filter", key: "priorityFilter" },
              { label: "Auto-escalation rules", key: "autoEscalation" },
            ].map(({ label, key }) => (
              <div className="setting-item" key={key}>
                <span>{label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={() => handleToggle(key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </section>

        <div className="save-container">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </main>
    </div>
  );
};

export default Asettings;
