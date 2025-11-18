


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsSection from "./StatsSection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import scamDashboard from "../assets/scam_dashboard.png";
import logo from "../assets/logo.jpeg";
import Login from "./Login";
import "./Home.css";

/* ================================
   🧠 Dynamic Fraud Chart Component
================================ */
const DynamicFraudChart = () => {
  const [chartData, setChartData] = useState([]);

  const getMonthName = (date) =>
    date.toLocaleString("default", { month: "short" });

  const generateData = () => {
    const today = new Date();
    const newData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      newData.push({
        month: getMonthName(d),
        frauds: Math.floor(40 + Math.random() * 80),
        safe: Math.floor(400 + Math.random() * 300),
      });
    }
    return newData;
  };

  useEffect(() => {
    setChartData(generateData());
    const interval = setInterval(() => {
      setChartData(generateData());
    }, 900000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="frauds"
            stroke="#E74C3C"
            strokeWidth={3}
            dot={{ r: 4 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="safe"
            stroke="#2ECC71"
            strokeWidth={3}
            dot={{ r: 4 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ================================
   🌐 Main Dashboard Component
================================ */
const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setSuccessMessage("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="dashboard-page">
      {/* ===== Navbar ===== */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Company Logo" className="logo-img" />
          <span>Fraud Detection System</span>
        </div>
        <div className="nav-links">
          <button className="nav-btn login-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className="nav-btn signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      {showLogin && <Login closePopup={() => setShowLogin(false)} />}

      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Secure Your Transactions with AI Intelligence</h1>
          <p>
            Monitor, detect, and prevent fraudulent activities in real-time. Our
            AI-driven system ensures your financial safety.
          </p>
        </div>
      </section>

      {/* ===== Banner ===== */}
      <section className="banner-section">
        <img src={scamDashboard} alt="Scam Alert" className="banner-image" />
      </section>

      <StatsSection />

      {/* ===== Chart Section ===== */}
      <section className="chart-section">
        <h2>Fraud Detection Trend (Last 6 Months)</h2>
        <p className="chart-description">
          Real-time fraud detection statistics, automatically adjusted based on
          system trends.
        </p>
        <DynamicFraudChart />
      </section>

      {/* ===== Contact Us Section ===== */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>
          Have questions or need support? Get in touch with our fraud detection
          experts.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && <span className="error">{formErrors.name}</span>}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <span className="error">{formErrors.email}</span>}

          <textarea
            name="message"
            placeholder="Your Message..."
            value={formData.message}
            onChange={handleChange}
            required
          />
          {formErrors.message && <span className="error">{formErrors.message}</span>}

          <button type="submit">Send Message</button>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <p>© 2025 Fraud Detection System | Built with 💙 AI & Data Security</p>
      </footer>
    </div>
  );
};

export default Home;


