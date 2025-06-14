import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    countries: 0,
    cities: 0,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showList, setShowList] = useState(false);
  const [listType, setListType] = useState(""); // "followers" or "following"
  const [listUsers, setListUsers] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:3000/user/profile", {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => {
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          username: res.data.username || "",
          countries: res.data.countries || 0,
          cities: res.data.cities || 0,
        });
        setImagePreview(res.data.image || null);
      })
      .catch(() => {
        setUser(null);
      });
  }, [navigate]);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      countries: user.countries || 0,
      cities: user.cities || 0,
    });
    setImagePreview(user.image || null);
    setImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "countries" || name === "cities" ? Number(value) : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    try {
      let imageUrl = user.image;
      if (image) {
        imageUrl = imagePreview;
      }
      const res = await axios.put(
        "http://localhost:3000/user/profile",
        {
          name: form.name,
          email: form.email,
          username: form.username,
          countries: form.countries,
          cities: form.cities,
          image: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setUser(res.data);
      setEditMode(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setSuccessMsg("Failed to update profile.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleShowList = async (type) => {
    setListType(type);
    setShowList(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const res = await axios.get(
      `http://localhost:3000/user/${type}`,
      { headers: { Authorization: `Bearer ${userData.token}` } }
    );
    setListUsers(res.data);
  };

  const handleCloseList = () => {
    setShowList(false);
    setListUsers([]);
  };

  if (!user) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  return (
    <>
      {/* Header Section */}
      <header
        style={{
          width: "100vw",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.2rem 2rem 0.5rem 2rem",
          background: "black",
          borderBottom: "1px solidrgb(0, 0, 0)",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(27,141,193,0.04)",
          position: "relative",
          left: "50%",
          right: "50%",
          transform: "translateX(-50%)",
        }}
      >
         <img src="/logo.png" alt="TripThreads Logo" style={{ height: "30px" ,borderRadius:'10px'}} />
        <Link
          to="/home"
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: "1.5rem",
            textDecoration: "none",
            letterSpacing: "1px",
            cursor: "pointer"
          }}
        >
          TripThreads
        </Link>
      </header>
      {/* Profile Main Content */}
      <div style={{ maxWidth: 500, margin: "2.5rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(27,141,193,0.08)", padding: "2rem" }}>
        {successMsg && <div className="profile-toast">{successMsg}</div>}
        <h2 style={{ color: "#1b8dc1", textAlign: "center", marginBottom: "2rem" }}>My Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <img
              src={imagePreview || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || user.email)}
              alt="Profile"
              style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "2px solid #1b8dc1" }}
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
                  type="button"
                  style={{ marginTop: "0.5rem", display: "block", background: "#1b8dc1", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 1rem", cursor: "pointer" }}
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Photo
                </button>
              </>
            )}
          </div>
          <div className="profile-details" style={{ flex: 1 }}>
            {editMode ? (
              <form onSubmit={handleSave}>
                <div>
                  <b>Name:</b> <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <b>Email:</b> <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                  <b>Username:</b> <input type="text" name="username" value={form.username} onChange={handleChange} />
                </div>
                <div>
                  <b>Countries:</b> <input type="number" name="countries" value={form.countries} onChange={handleChange} min="0" />
                </div>
                <div>
                  <b>Cities:</b> <input type="number" name="cities" value={form.cities} onChange={handleChange} min="0" />
                </div>
                <button type="submit" style={{ marginTop: "1rem", background: "#1b8dc1", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.5rem", cursor: "pointer" }}>Save</button>
                <button type="button" onClick={handleCancel} style={{ marginLeft: "1rem", background: "#eee", color: "#333", border: "none", borderRadius: 6, padding: "0.5rem 1.5rem", cursor: "pointer" }}>Cancel</button>
              </form>
            ) : (
              <>
                <div><b>Name:</b> {user.name}</div>
                <div><b>Email:</b> {user.email}</div>
                <div><b>Username:</b> {user.username}</div>
                <div><b>Countries:</b> {user.countries}</div>
                <div><b>Cities:</b> {user.cities}</div>
                <div>
                  <b>
                    <span
                      style={{ color: "#1b8dc1", cursor: "pointer" }}
                      onClick={() => handleShowList("followers")}
                    >
                      Followers: {user.followers ? user.followers.length : 0}
                    </span>
                  </b>
                  &nbsp;|&nbsp;
                  <b>
                    <span
                      style={{ color: "#1b8dc1", cursor: "pointer" }}
                      onClick={() => handleShowList("following")}
                    >
                      Following: {user.following ? user.following.length : 0}
                    </span>
                  </b>
                </div>
                <button
                  type="button"
                  style={{ marginTop: "1rem", background: "#1b8dc1", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.5rem", cursor: "pointer" }}
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
        {/* Followers/Following Modal */}
        {showList && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={handleCloseList}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "2rem",
                minWidth: 300,
                maxWidth: 400,
                maxHeight: "70vh",
                overflowY: "auto",
                boxShadow: "0 4px 24px rgba(27,141,193,0.15)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ color: "#1b8dc1", marginBottom: "1rem" }}>
                {listType.charAt(0).toUpperCase() + listType.slice(1)}
              </h3>
              {listUsers.length === 0 ? (
                <div style={{ color: "#888" }}>No users found.</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {listUsers.map(u => (
                    <li key={u._id} style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                      <img
                        src={
                          u.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            u.username || u.name || u.email
                          )}&background=1b8dc1&color=fff`
                        }
                        alt="Profile"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "0.7rem",
                          border: "2px solid #1b8dc1",
                          background: "#e6f2fa",
                        }}
                      />
                      <span>{u.username || u.name || u.email}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                style={{
                  marginTop: "1rem",
                  background: "#1b8dc1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5rem 1.5rem",
                  cursor: "pointer",
                }}
                onClick={handleCloseList}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;