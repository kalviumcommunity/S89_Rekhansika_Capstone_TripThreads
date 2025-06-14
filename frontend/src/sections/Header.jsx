import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './Header.css';

const placesData = [
  { name: "Hyderabad", info: "City of pearls, Charminar, Biryani." },
  { name: "Goa", info: "Beaches, nightlife, water sports." },
  { name: "Delhi", info: "Capital of India, Red Fort, street food." },
  { name: "Mumbai", info: "Gateway of India, Bollywood, Marine Drive." },
  { name: "Jaipur", info: "Pink City, forts, palaces." },
  // Add more places as needed
];

const Header = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Add this

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      const filtered = placesData.filter(place =>
        place.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  // Add this handler for Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/location', { state: { search } });
      setSearch('');
      setResults([]);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="TripThreads Logo" style={{ height: "30px" ,borderRadius:'10px'}} />
        <span>TripThreads</span>
      </div>
      <div className="nav-links">
        <a href="/home">Home</a>
        <a href="/bookings">Bookings</a>
        <a href="/experiences">Experiences</a>
        <a href="/chatbox">AI ChatBox</a>
        <a href="/follow-others">Follow Others</a>
      </div>
      <div className="nav-right" style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // Add this
          className="location-search-input"
        />
        
        <div
          className="user-icon"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >👤</div>
      </div>
    </nav>
    
  );
};

export default Header;