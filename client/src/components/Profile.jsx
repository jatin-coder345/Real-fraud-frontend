import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaUser, FaArrowLeft, FaEdit } from "react-icons/fa";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const [message, setMessage] = useState(""); // ✅ success/error message

  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [previewImage, setPreviewImage] = useState("");

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser);
      setPreviewImage(storedUser.profileImage || "");
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save updated profile
  const handleSave = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setMessage("Please fill all required fields!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/auth/update/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsEditing(false);

      // ✅ Success message
      setMessage("Profile updated successfully!");
      setMessageType("success");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Failed to update profile.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="profile-avatar">
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="profile-photo" />
          ) : (
            <FaUser size={90} color="#2563eb" />
          )}
        </div>

        {/* ✅ Message Box */}
        {message && <div className={`message-box ${messageType}`}>{message}</div>}

        {!isEditing ? (
          <>
            <h2>{user.firstName || "User"}</h2>
            <p className="role-text">{user.role}</p>

            <div className="profile-info">
              <p>
                <FaEnvelope /> <strong>Email:</strong> {user.email}
              </p>
              <p>
                <FaPhone /> <strong>Contact:</strong> {user.phone || "Not provided"}
              </p>
              <p>
                <FaUser /> <strong>User ID:</strong> {user._id}
              </p>
              <p>
                <FaUser /> <strong>Username/Login ID:</strong> {user.userId}
              </p>
            </div>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <h2>Edit Profile</h2>
            <div className="edit-form">
              <label>First Name*</label>
              <input
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
              />

              <label>Last Name*</label>
              <input
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                name="email"
                value={formData.email || ""}
                disabled // ✅ email cannot be edited
              />

              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />

              <label>Profile Photo</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              <div className="edit-actions">
                <button onClick={handleSave}>Save</button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
