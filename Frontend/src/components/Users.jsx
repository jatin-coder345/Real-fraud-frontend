import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";
import {
  FaChartBar,
  FaExchangeAlt,
  FaCog,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaUsers,
  FaPlug,
  FaLock,
} from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("⚠️ Please log in again — token missing.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("❌ Failed to load users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);


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
          <h3></h3>
          <p></p>
        </div>

        <nav className="nav-menu">
          <a href="/Userdashboard"><FaTachometerAlt /> Dashboard</a>
          <a href="/Transactions"><FaExchangeAlt /> Transactions</a>
          <a href="/Reports"><FaChartBar /> Reports</a>
          <a href="/Help"><FaQuestionCircle /> Help & Support</a>
          {/* <a href="/Users" className="active"><FaUsers /> Users</a>
          <a href="/APIs"><FaPlug /> APIs</a> */}
          <a href="/Settings"><FaCog /> Settings</a>
          <a href="/ChangePassword"><FaLock /> Change Password</a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      {/* Main Content */}
      <main className="users-page">
        <h1 className="page-title">👥 All Registered Users</h1>

        {message && <p className="message">{message}</p>}

        {users.length > 0 ? (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.userId}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td className={`role ${user.role}`}>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !message && <p className="loading">Loading users...</p>
        )}
      </main>
    </div>
  );
};

export default Users;
