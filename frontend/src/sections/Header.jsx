// Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png"  />
        <span>TripThreads</span>
      </div>
      <div className="nav-links">
        <a href="/home">Home</a>
        <a href="/bookings">Bookings</a>
        <a href="/experiences">Experiences</a>
        <a href="/chatbox">AI ChatBox</a>
      </div>
      <div className="nav-right">
        <input type="text" placeholder="Search..." />
        <div className="user-icon">👤</div>
      </div>
    </nav>
  );
};

export default Header;
