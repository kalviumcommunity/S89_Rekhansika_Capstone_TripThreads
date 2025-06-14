import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FollowOthers.css";
import Header from "../sections/Header";

const FollowOthers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all users and following list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        navigate("/login");
        return;
      }
      try {
        // Get all users except self
        const resUsers = await axios.get("http://localhost:3000/user/all", {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setUsers(resUsers.data.filter(u => u._id !== (userData._id || userData.id)));

        // Get following list (array of user IDs)
        const resFollowing = await axios.get(
          `http://localhost:3000/user/${userData._id || userData.id}/following`,
          { headers: { Authorization: `Bearer ${userData.token}` } }
        );
        setFollowing(resFollowing.data.following || []);
      } catch {
        setUsers([]);
        setFollowing([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  // Follow handler
  const handleFollow = async (userId) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.post(
        "http://localhost:3000/user/follow",
        { userId },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      setFollowing(prev => [...prev, String(userId)]);
    } catch {
      // Optionally show error
    }
  };

  // Check if following
  const isFollowing = (userId) => following.map(String).includes(String(userId));

  // Filter users by search
  const filteredUsers = users.filter(u =>
    (u.username || u.name || u.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="follow-others-page-wrapper">
        <Header/>
      <div className="follow-others-container">
        <h2>Follow Others</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "30%",
            padding: "0.7rem 1rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #cce3f6",
            fontSize: "1rem",
            marginLeft: "20rem",
          }}
        />
        {loading ? (
          <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>
        ) : (
          <ul className="follow-others-list">
            {filteredUsers.length === 0 ? (
              <li style={{ color: "#888", textAlign: "center" }}>No users found.</li>
            ) : (
              filteredUsers.map((u) => (
                <li key={u._id}>
                  <img
                    src={
                      u.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        u.username || u.name || u.email
                      )}&background=1b8dc1&color=fff`
                    }
                    alt="Profile"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "0.6rem",
                      border: "2px solid #1b8dc1",
                      background: "#e6f2fa",
                    }}
                  />
                  <span
                    className="follow-others-username"
                    onClick={() => navigate(`/user/${u._id}/posts`)}
                  >
                    {u.username || u.name || u.email}
                  </span>
                  {isFollowing(u._id) ? (
                    <span className="following-label">Following</span>
                  ) : (
                    <button className="follow-btn" onClick={() => handleFollow(u._id)}>
                      Follow
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowOthers;