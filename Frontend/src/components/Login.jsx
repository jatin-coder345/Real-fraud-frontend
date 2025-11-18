import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ closePopup }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "", duration: 3000 });
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // clear any previous message timer before setting new one
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (message.text) {
      timerRef.current = setTimeout(() => {
        setMessage({ text: "", type: "", duration: 3000 });
      }, message.duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [message]);

  const showMessage = (text, type, duration = 3000) => {
    setMessage({ text, type, duration });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showMessage("", "", 0);

    if (!role) {
      showMessage("❌ Invalid role selected", "error", 60000); // 1 minute
      return;
    }

    try {
      const response = await fetch("https://real-fraud-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: data.user._id,
            loginId: data.user.loginId || data.user.email,
            firstName: data.user.firstName,
            role: data.user.role,
          })
        );

        if (data.token) localStorage.setItem("token", data.token);

        showMessage(`✅ Welcome ${data.user.firstName}!`, "success");

        setTimeout(() => {
          closePopup();
          if (data.user.role === "user") navigate("/Userdashboard");
          else if (data.user.role === "admin") navigate("/Admindashboard");
        }, 1500);
      } else {
        showMessage(`❌ ${data.message || "Login failed"}`, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("⚠️ Error connecting to server", "error", 60000); // 1 minute
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={closePopup}>
          ✖
        </button>
        <h2>Login</h2>

        {message.text && (
          <div className={`message-box ${message.type}`}>{message.text}</div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Login As</label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email or User ID</label>
            <input
              type="text"
              placeholder="Enter your email or user ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="pass-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="signup-text">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                closePopup();
                navigate("/signup");
              }}
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
