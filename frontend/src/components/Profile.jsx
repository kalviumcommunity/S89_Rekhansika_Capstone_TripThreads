import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
    } else {
      setUser(userData);
      setForm({
        name: userData.name || userData.displayName || "",
        email:
          userData.email ||
          (userData.emails && Array.isArray(userData.emails) && userData.emails[0]?.value) ||
          "",
        username: userData.username || "",
      });
      setImagePreview(userData.image || null);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // In a real app, send updated data to backend here
    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
      username: form.username,
      image: imagePreview,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  if (!user) return null;

  return (
    <>
    <header
        style={{
          width: "1280px",
          background: "black",
          color: "#fff",
          padding: "18px 0",
          textAlign: "left",
          fontSize: "2rem",
          fontWeight: "bold",
          letterSpacing: "1px",
          cursor: "pointer",
          marginBottom: 32,
        }}
        onClick={() => navigate("/home")}
      >
        TripThreads
      </header>
    <div className="profile-container" style={{
      maxWidth: 400,
      margin: "60px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      padding: 32,
      textAlign: "center"
    }}>
      <div style={{ marginBottom: 16 }}>
        <img
          src={imagePreview || "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name || "User")}
          alt="Profile"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #0077cc",
            marginBottom: 8,
          }}
        />
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              style={{
                display: "block",
                margin: "8px auto",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "4px 12px",
                cursor: "pointer"
              }}
              onClick={() => fileInputRef.current.click()}
            >
              Upload Image
            </button>
          </>
        )}
      </div>
      <div>
        <label style={{ fontWeight: "bold" }}>Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{ width: "90%", margin: "6px 0", padding: "6px" }}
          />
        ) : (
          <div style={{ marginBottom: 8 }}>{form.name}</div>
        )}
      </div>
      <div>
        <label style={{ fontWeight: "bold" }}>Email:</label>
        {editMode ? (
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: "90%", margin: "6px 0", padding: "6px" }}
          />
        ) : (
          <div style={{ marginBottom: 8 }}>{form.email}</div>
        )}
      </div>
      <div>
        <label style={{ fontWeight: "bold" }}>Username:</label>
        {editMode ? (
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={{ width: "90%", margin: "6px 0", padding: "6px" }}
          />
        ) : (
          <div style={{ marginBottom: 8 }}>{form.username || <span style={{ color: "#aaa" }}>Not set</span>}</div>
        )}
      </div>
      {editMode ? (
        <button
          onClick={handleSave}
          style={{
            background: "#0077cc",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            fontSize: 16,
            cursor: "pointer",
            marginTop: 16
          }}
        >
          Save
        </button>
      ) : (
        <button
          onClick={handleEdit}
          style={{
            background: "#eee",
            color: "#0077cc",
            border: "1px solid #0077cc",
            borderRadius: 6,
            padding: "10px 24px",
            fontSize: 16,
            cursor: "pointer",
            marginTop: 16,
            marginRight: 8
          }}
        >
          Edit
        </button>
      )}
      <button
        onClick={handleLogout}
        style={{
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 24px",
          fontSize: 16,
          cursor: "pointer",
          marginTop: 16,
          marginLeft: 8
        }}
      >
        Logout
      </button>
    </div>
    
    </>
    
  );
};

export default Profile;