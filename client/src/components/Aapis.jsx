import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Aapis.css";
import {
  FaTachometerAlt,
  FaUsers,
  FaPlug,
  FaSignOutAlt,
  FaExchangeAlt,
  FaUserCircle,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

const Aapis = () => {
  const navigate = useNavigate();
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Simulate fetching fake APIs (Mock Data)
  useEffect(() => {
    const fetchFakeApis = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const fakeApiData = [
          {
            _id: "api001",
            name: "Login Api",
            endpoint: "/api/auth/login",
            createdBy: "Admin",
            isActive: true,
          },
          {
            _id: "api002",
            name: "Signup Api",
            endpoint: "/api/auth/Signup",
            createdBy: "Admin",
            isActive: true,
          },
          {
            _id: "api003",
            name: "Change Password Api",
            endpoint: "/api/auth/change-password",
            createdBy: "Admin",
            isActive: true,
          },
          {
            _id: "api004",
            name: "User Trasanctions Api",
            endpoint: "/api/transactions/user/${userId}",
            createdBy: "Admin",
            isActive: true,
          },
          {
            _id: "api005",
            name: "Live Transaction Api",
            endpoint: "/api/transactions",
            createdBy: "Admin",
            isActive: true,
          },
        ];

        setApis(fakeApiData);
      } catch (error) {
        console.error("Error loading fake APIs:", error);
        setMessage("❌ Failed to load mock API data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFakeApis();
  }, []);

  // ✅ Logout Function
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
          <FaUserShield /> Admin Panel 🛡
        </h3> */}

        <ul className="menu">
          <li onClick={() => navigate("/admindashboard")}>
             <FaTachometerAlt className="menu-icon" /> Dashboard
          </li>
          <li onClick={() => navigate("/Aprofile")}>
             <FaUserCircle className="menu-icon" /> Profile
          </li>
          <li onClick={() => navigate("/Ausers")}>
             <FaUsers className="menu-icon" /> Users
          </li>
          <li onClick={() => navigate("/AdminLiveTransactions")}>
             <FaExchangeAlt className="menu-icon" /> Live Transactions
          </li>
          <li className="active" onClick={() => navigate("/Aapis")}>
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
          <h1>🔌 API Management</h1>
          <p>Manage system integrations and active API endpoints.</p>
        </header>

        {/* ===== API Table Section ===== */}
        <section className="api-section">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading ...</p>
            </div>
          ) : message ? (
            <p className="error">{message}</p>
          ) : (
            <div className="table-container">
              <table className="api-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>API ID</th>
                    <th>API Name</th>
                    <th>Endpoint</th>
                    <th>Created By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apis.map((api, index) => (
                    <tr key={api._id}>
                      <td>{index + 1}</td>
                      <td>{api._id}</td>
                      <td>{api.name}</td>
                      <td className="endpoint">{api.endpoint}</td>
                      <td>{api.createdBy}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            api.isActive ? "active" : "inactive"
                          }`}
                        >
                          {api.isActive ? "✅ Active" : "❌ Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Aapis;