// Start coding here
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaUser, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // upload spinner
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        phone: storedUser.phone,
        userId: storedUser.userId,
      });
      setProfileImage(storedUser.profilePhoto || null);
    }
  }, []);

  // Handle text changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload Profile Photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true); // start spinner

    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL);

    try {
      const formDataImg = new FormData();
      formDataImg.append("photo", file);

      const token = localStorage.getItem("token");

      const uploadRes = await axios.post(
        `https://real-fraud-backend.onrender.com/api/auth/upload-photo/${user._id}`,
        formDataImg,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const uploadedURL = uploadRes.data.url;

      const updatedUser = {
        ...user,
        profilePhoto: uploadedURL,
      };

      setUser(updatedUser);
      setProfileImage(uploadedURL);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoading(false); // stop spinner

      setMessage("Profile photo updated!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setMessage("Failed to upload.");
      setMessageType("error");
    }
  };

  // REMOVE PHOTO (LOCAL ONLY)
  const handleRemovePhoto = () => {
    const updatedUser = {
      ...user,
      profilePhoto: null,
    };

    setProfileImage(null);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setMessage("Profile photo removed.");
    setMessageType("success");
    setTimeout(() => setMessage(""), 2500);
  };

  // Save Edited Fields
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://real-fraud-backend.onrender.com/api/auth/update/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = {
        ...response.data.user,
        profilePhoto: profileImage,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);

      setMessage("Profile updated!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2500);
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
          {profileImage ? (
            <img src={profileImage} alt="profile" className="profile-photo" />
          ) : (
            <FaUser size={85} color="#2563eb" />
          )}

          <div className="upload-container">
            <label className="upload-btn">
              Upload Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
            </label>

            {loading && <div className="spinner"></div>}
          </div>
        </div>

        {message && <div className={`message-box ${messageType}`}>{message}</div>}

        {!isEditing ? (
          <>
            <h2>{user.firstName}</h2>
            <p className="role-text">{user.role}</p>

            <div className="profile-info">
              <p><FaEnvelope /> <strong>Email:</strong> {user.email}</p>
              <p><FaPhone /> <strong>Phone:</strong> {user.phone}</p>
              <p><FaUser /> <strong>User ID:</strong> {user._id}</p>
              <p><FaUser /> <strong>Username:</strong> {user.userId}</p>
            </div>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <h2>Edit Profile</h2>

            <div className="edit-form">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} />

              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} />

              <label>Email (Locked)</label>
              <input value={user.email} disabled />

              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />

              {/* Remove Photo Button */}
              <button className="remove-btn" onClick={handleRemovePhoto}>
                <FaTrash /> Remove Photo
              </button>

              <div className="edit-actions">
                <button onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
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
