import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css';
import Header from '../sections/header';

const Booking = () => {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'http://localhost:8000/bookings/search',
        { params: { query } }
      );

      // Adjust this depending on the actual API response structure
      if (response.data?.data?.length > 0) {
        setDestinations(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDestinations(response.data);
      } else {
        setDestinations([]);
        setError('No destinations found.');
      }
    } catch (error) {
      setError('Failed to fetch destinations. Please try again later.',error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <Header />

      <main className="booking-content">
        <div className="search-bar-main">
          <input
            type="text"
            placeholder="Search destination..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {destinations.length > 0 && (
          <div className="search-results">
            <h3>Results:</h3>
            <ul>
              {destinations.map((dest, idx) => (
                <li key={idx}>{dest.name || dest.label || 'Unknown'}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="about">
          <h4>About our website</h4>
          <p>
            TripThreads is more than a tool—it's your companion for exploring, discovering, and creating memories around the globe.
          </p>
        </div>
        <div className="contact">
          <h4>Contact us :</h4>
          <p>+91 9963204753, +91 9884807800</p>
          <div className="social-icons">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-youtube"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Booking;