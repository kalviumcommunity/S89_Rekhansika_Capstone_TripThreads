import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams} from "react-router-dom";
import "./UserPosts.css";

const UserPosts = () => {
  const { id } = useParams(); // userId from URL
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?._id || loggedInUser?.id;

  useEffect(() => {
    setLoading(true);
    setError("");
    const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData || !userData.token) {
    setError("You must be logged in to view this page.");
    setLoading(false);
    return;
  }
    // Fetch profile WITH AUTH HEADER
    axios.get(`http://localhost:3000/user/profile/${id}`, {
      headers: { Authorization: `Bearer ${loggedInUser.token}` }
    })
      .then(res => setProfile(res.data))
      .catch(() => setError("Failed to load user profile."));

    // Fetch posts WITH AUTH HEADER
    axios.get(`http://localhost:3000/socialFeatures/user/${id}/posts`, {
      headers: { Authorization: `Bearer ${loggedInUser.token}` }
    })
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));

    // Check if following (only if not viewing own profile)
    if (loggedInUser && loggedInUser.token && id !== loggedInUserId) {
      axios.get(`http://localhost:3000/user/is-following/${id}`, {
        headers: { Authorization: `Bearer ${loggedInUser.token}` }
      })
        .then(res => setIsFollowing(res.data.isFollowing))
        .catch(() => setIsFollowing(false));
    }
  }, [id]);

  const handleFollow = async () => {
    try {
      await axios.post(
        "http://localhost:3000/user/follow",
        { userId: id },
        { headers: { Authorization: `Bearer ${loggedInUser.token}` } }
      );
      // Re-fetch following status from backend
      const res = await axios.get(`http://localhost:3000/user/is-following/${id}`, {
        headers: { Authorization: `Bearer ${loggedInUser.token}` }
      });
      setIsFollowing(res.data.isFollowing);
    } catch {
      alert("Failed to follow user.");
    }
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  if (!profile) return <div style={{ textAlign: "center" }}>User not found.</div>;

  return (
    <div className="user-posts-container">
      <div className="user-profile-header">
        <img
          src={
            profile.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.username || profile.name || ""
            )}&background=1b8dc1&color=fff`
          }
          alt="Profile"
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #1b8dc1",
            marginRight: "1.2rem"
          }}
        />
        <div className="user-profile-details">
          <h2>{profile.username || profile.name || profile.email}</h2>
          {/* Only show email if present (i.e., owner) */}
          {profile.email && (
            <div className="profile-meta">Email: {profile.email}</div>
          )}
          <div className="profile-meta">Countries: {profile.countries}</div>
          <div className="profile-meta">Cities: {profile.cities}</div>
          <div>
            <b>Followers:</b> {profile.followers ? profile.followers.length : 0} &nbsp;|&nbsp;
            <b>Following:</b> {profile.following ? profile.following.length : 0}
          </div>
        </div>
        {loggedInUserId && profile._id !== loggedInUserId && (
          isFollowing ? (
            <button className="follow-btn" style={{ background: "#2ecc40", cursor: "default" }} disabled>
              Following
            </button>
          ) : (
            <button className="follow-btn" onClick={handleFollow}>
              Follow
            </button>
          )
        )}
      </div>
      <div className="user-posts-title">Posts</div>
      {posts.length === 0 ? (
        <div className="no-posts-message">No posts yet.</div>
      ) : (
        <ul className="user-posts-list">
          {posts.map(post => (
            <li className="user-post-item" key={post._id}>
              <strong>{post.title}</strong>
              <div>{post.description}</div>
              {post.imageUrl && <img src={post.imageUrl} alt="" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;