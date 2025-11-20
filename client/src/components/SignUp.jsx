import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import Login from "../components/Login";
import img1 from "../assets/signup1.png";
import img2 from "../assets/signup2.png";
import img3 from "../assets/signup3.png";

const SignUp = () => {
  const navigate = useNavigate();
  const timersRef = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "", visible: false });

  const images = [img1, img2, img3];

  // Auto slider
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  // Clean timers
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.userId.trim()) newErrors.userId = "User ID required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // show timed popup message
  const showTimedMessage = ({ text, type, openLoginAfter = false }) => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    setMessage({ text, type, visible: true });

    const hideTimer = setTimeout(() => {
      setMessage((m) => ({ ...m, visible: false }));
    }, 5000);

    timersRef.current.push(hideTimer);

    if (openLoginAfter) {
      const openTimer = setTimeout(() => {
        setShowLogin(true);
      }, 5000);

      timersRef.current.push(openTimer);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({ text: "", type: "", visible: false });

    if (!validateForm()) return;

    try {
      const response = await fetch("https://real-fraud-backend.onrender.com/api/auth/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showTimedMessage({
          text: "✅ Registration successful!",
          type: "success",
          openLoginAfter: true,
        });
      } else {
        showTimedMessage({
          text: `❌ ${data.message || "Registration failed"}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      showTimedMessage({
        text: "⚠️ Error connecting to server",
        type: "error",
      });
    }
  };

  return (
    <div className="signup-container">
      {/* LEFT SLIDER */}
      <div
        className="signup-left"
        onClick={() =>
          setCurrentImage((prev) => (prev + 1) % images.length)
        }
      >
        <div className="image-slider">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="signup"
              className={`slide ${index === currentImage ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="signup-right">
        <div className="signup-box">
          <h2>Create Your Account</h2>

          {message.text && (
            <div
              className={`message-box ${message.type} ${
                message.visible ? "visible" : "hidden"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={formData.userId}
                onChange={handleChange}
              />
              {errors.userId && (
                <span className="error">{errors.userId}</span>
              )}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="input-group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                <option value="user">User</option>
              </select>
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(true);
                }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>

      {showLogin && <Login closePopup={() => setShowLogin(false)} />}
    </div>
  );
};

export default SignUp;
