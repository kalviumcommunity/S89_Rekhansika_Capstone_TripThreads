import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css"; // Import your CSS file for styles

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stats, setStats] = useState({ countries: 12, cities: 38 }); 
  const [successMsg, setSuccessMsg] = useState("");
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
      setStats({
      countries: userData.countries || 0,
      cities: userData.cities || 0,
    });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // <-- Add this
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async() => {
    if (!form.username.trim()) {
      alert("UserName is required.");
      return;
    }
    const updatedUser = {
      ...user,
      name: form.name, // <-- Always keep the name!
      email: form.email, 
      username: form.username,
      countries: Number(stats.countries), // Ensure numbers
      cities: Number(stats.cities), 
      image: imagePreview
    };
     try {
    const response = await axios.put('http://localhost:3000/user/profile', updatedUser, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setUser(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
    setEditMode(false);
    setSuccessMsg("Changes saved successfully!");
setTimeout(() => setSuccessMsg(""), 3000);
  } catch (error) {
    alert("Failed to save profile. Please try again.",error);
  }
  };

  if (!user) return null;

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      height: '900px',
      width: '99vw',
      margin: 0,
      padding: 0,
     background: 'url("https://i.pinimg.com/736x/79/e4/d9/79e4d96b8b1a32aaa09434d571a5d109.jpg") center center/cover no-repeat fixed',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      
    },
    header: {
      backgroundColor: "black", /* Black background */
      color: "white",    
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      padding: '13px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      cursor: 'pointer',
      color: 'white',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoImage: {
      height: '35px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    logoText: {
  fontSize: '1.8rem',
  fontWeight: '700',
  color: "white", // <-- ensure this is set
  letterSpacing: '0.5px'
},
    profileContainer: {
      maxWidth: '700px',
      margin: '40px auto',
      background: 'rgba(255, 255, 255, 0.44)',
      backdropFilter: 'blur(15px)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      padding: '40px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    profileHeader: {
      marginBottom: '30px',
      position: 'relative'
    },
    profileImageContainer: {
      position: 'relative',
      display: 'inline-block',
      marginBottom: '20px'
    },
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #fff',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    uploadButton: {
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s ease'
    },
    travelBadge: {
      display: 'inline-block',
      background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
    },
    formGroup: {
      marginBottom: '24px',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#2c3e50',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      background: 'rgba(255,255,255,0.5)',
      boxSizing: 'border-box',
      color: 'black' 
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      background: 'white'
    },
    displayValue: {
      padding: '12px 16px',
      background: 'rgba(102, 126, 234, 0.05)',
      borderRadius: '12px',
      color: '#2c3e50',
      fontSize: '16px',
      minHeight: '20px',
      border: '2px solid transparent'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginTop: '30px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      minWidth: '100px'
    },
    // ...inside styles object...
primaryButton: {
  background: 'linear-gradient(45deg, #62a3b1, #4b8fa2)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(98, 163, 177, 0.4)'
},
secondaryButton: {
  background: 'rgba(102, 126, 234, 0.08)',
  color: '#4b8fa2',
  border: '2px solid #62a3b1'
},
dangerButton: {
  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
},
    decorativeElement: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '100px',
      height: '100px',
      background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
      borderRadius: '50%',
      zIndex: -1
    },
    travelStats: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '20px 0',
      marginTop: '20px',
      borderTop: '1px solid rgba(102, 126, 234, 0.1)'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#667eea',
      display: 'block'
    },
    statLabel: {
      fontSize: '12px',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  };

  return (
    <div style={styles.pageContainer}>
    {successMsg && (
  <div className="profile-toast">
    {successMsg}
  </div>
)}
      <header style={styles.header}>
        <div style={styles.headerContent} onClick={() => navigate("/home")}>
          <div style={styles.logo}>
            <img src="/logo.png" alt="TripThreads Logo" style={styles.logoImage} />
            <span style={styles.logoText}>TripThreads</span>
          </div>
        </div>
      </header>

      <div style={styles.profileContainer}>
        <div style={styles.decorativeElement}></div>
        
        <div style={styles.profileHeader}>
          <div style={styles.travelBadge}>✈️ Travel Explorer</div>
          
          <div style={styles.profileImageContainer}>
            <img
              src={imagePreview || "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name || "User") + "&background=667eea&color=fff&size=200"}
              alt="Profile"
              style={styles.profileImage}
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
                  style={styles.uploadButton}
                  onClick={() => fileInputRef.current.click()}
                  title="Upload new photo"
                >
                  📷
                </button>
              </>
            )}
          </div>
        </div>

        

        <div style={styles.formGroup}>
  <label style={styles.label}>🏷️ Full Name</label>
  <div style={styles.displayValue}>{form.name}</div>
</div>

<div style={styles.formGroup}>
  <label style={styles.label}>📧 Email Address</label>
  <div style={styles.displayValue}>{form.email}</div>
</div>

<div style={styles.formGroup}>
  <label style={styles.label}>👤 Username</label>
  {editMode ? (
    <input
      type="text"
      name="username"
      value={form.username}
      onChange={handleChange}
      style={styles.input}
      placeholder="Choose a username"
    />
  ) : (
    <div style={styles.displayValue}>
      {form.username || <span style={{ color: "#aaa", fontStyle: 'italic' }}>Not set</span>}
    </div>
  )}
</div>

<div style={styles.travelStats}>
  <div style={styles.statItem}>
    <span style={styles.statNumber}>
      {editMode ? (
        <input
          type="number"
          min="0"
          name="countries"
          value={stats.countries}
          onChange={e => setStats({ ...stats, countries: e.target.value })}
          style={{ ...styles.input, width: 60, textAlign: 'center', padding: 0,color:"black" }}
        />
      ) : stats.countries}
    </span>
    <span style={styles.statLabel}>Countries</span>
  </div>
  <div style={styles.statItem}>
    <span style={styles.statNumber}>
      {editMode ? (
        <input
          type="number"
          min="0"
          name="cities"
          value={stats.cities}
          onChange={e => setStats({ ...stats, cities: e.target.value })}
          style={{ ...styles.input, width: 60, textAlign: 'center', padding: 0 ,color:"black"}}
        />
      ) : stats.cities}
    </span>
    <span style={styles.statLabel}>Cities</span>
  </div>
  
</div>

        <div style={styles.buttonGroup}>
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                style={{...styles.button, ...styles.primaryButton}}
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                style={{...styles.button, ...styles.secondaryButton}}
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              ✏️ Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{...styles.button, ...styles.dangerButton}}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;