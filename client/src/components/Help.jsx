import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Help.css";
import {
  Mail,
  BookOpen,
  Phone,
  Send,
  Headphones,
} from "lucide-react";
import {
  FaChartBar,
  FaExchangeAlt,
  FaLock,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ✅ EmailJS Credentials
  const SERVICE_ID = "narmada123";
  const TEMPLATE_ID = "template_6alm0bi";
  const PUBLIC_KEY = "wu0Kidkg7ONEiz4XE";

  // ✅ Send Email Function
  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        (result) => {
          console.log("✅ Email Sent:", result.text);
          setSubmitted(true);
          e.target.reset();
          setLoading(false);
        },
        (error) => {
          console.error("❌ Email Error:", error);
          alert("Failed to send message. Please check your EmailJS IDs.");
          setLoading(false);
        }
      );
  };

  // ✅ Logout without popup
  const handleLogout = () => {
    localStorage.clear();
    navigate("/home"); // instant redirect, no confirm popup
  };

  return (
    <div className="dashboard-container">
      {/* === SIDEBAR === */}
      <aside className="sidebar">
        <div className="user-section">
          <FaUserCircle className="user-icon" />
          {/* <h3>Welcome</h3>
          <p>User Panel</p> */}
        </div>

        <nav className="nav-menu">
          <a href="/userdashboard">
            <FaTachometerAlt /> Dashboard
          </a>
          <a href="/transactions">
            <FaExchangeAlt /> Transactions
          </a>
          <a href="/reports">
            <FaChartBar /> Reports
          </a>
          <a href="/help" className="active">
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

      {/* === MAIN CONTENT === */}
      <main className="help-main">
        <div className="help-page">
          {/* === HEADER === */}
          <header className="help-header">
            <Headphones className="header-icon" />
            <h1>Help & Support Center</h1>
            <p>
              Need assistance? We're here to help you with issues, fraud alerts,
              or setup guidance. Contact us using the details below or send a message directly.
            </p>
          </header>

          {/* === SUPPORT INFO + FORM === */}
          <section className="help-section">
            <div className="help-info">
              {/* Email */}
              <div className="info-card">
                <Mail className="icon" />
                <h3>Email Support</h3>
                <p>Reach us anytime for help or queries.</p>
                <span>support@fraudshield.ai</span>
              </div>

              {/* Phone */}
              <div className="info-card">
                <Phone className="icon" />
                <h3>Call Us</h3>
                <p>Available Mon–Fri, 9AM–6PM.</p>
                <span>+91 98765 43210</span>
              </div>

              {/* Knowledge Base */}
              <div className="info-card">
                <BookOpen className="icon" />
                <h3>Knowledge Base</h3>
                <p>Explore FAQs, user guides, and tutorials.</p>
                <button className="learn-btn"  onClick={() => navigate("/knowledge-base")}>Visit Hub</button>
              </div>
            </div>

            {/* === CONTACT FORM === */}
            <div className="help-form">
              <h2>Contact Support</h2>
              <p>Submit your issue and our team will respond shortly.</p>

              <form ref={form} onSubmit={sendEmail}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="from_name"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="from_email"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Issue with transaction"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Describe your issue..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Sending..." : <><Send size={16} /> Send Message</>}
                </button>

                {submitted && (
                  <p className="success-msg">✅ Message sent successfully!</p>
                )}
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Help;
