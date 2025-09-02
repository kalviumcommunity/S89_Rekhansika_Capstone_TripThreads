
import React, { useEffect, useState } from 'react';
import './Booking.css';
import Header from '../sections/Header';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('hotels'); // 'hotels' or 'transportation'

  useEffect(() => {
    const fetchBookingHistory = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://s89-rekhansika-capstone-tripthreads-1.onrender.com/api/bookings/history/${user.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking history');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching booking history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter bookings for each tab
  const hotelBookings = bookings.filter(b => b.hotels && b.hotels.length > 0);
  const transportBookings = bookings.filter(b => b.transportation && b.transportation.mode_of_transportation);

  return (
    <div className="booking-history">
      <Header />
      <div style={{ padding: '2rem', marginTop: '80px' }}>
        <h2>Your Booking History</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setTab('hotels')}
          style={{
            marginRight: '1rem',
            background: tab === 'hotels' ? '#0077b6' : '#eee',
            color: tab === 'hotels' ? '#fff' : '#222',
            padding: '0.5rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Hotels
        </button>
        <button
          onClick={() => setTab('transportation')}
          style={{
            background: tab === 'transportation' ? '#0077b6' : '#eee',
            color: tab === 'transportation' ? '#fff' : '#222',
            padding: '0.5rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Transportation
        </button>
      </div>

      {tab === 'hotels' ? (
        hotelBookings.length === 0 ? (
          <p>No hotel bookings found.</p>
        ) : (
          <ul>
            {hotelBookings.map((booking) =>
              booking.hotels.map((hotel, idx) => (
                <li key={booking._id + idx} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
                  <h3>Booking ID: {booking._id}</h3>
                  <p><strong>Hotel Type:</strong> {hotel.type_of_hotel}</p>
                  <p><strong>Location:</strong> {hotel.location}</p>
                  <p><strong>From:</strong> {new Date(hotel.start_date).toLocaleDateString()}</p>
                  <p><strong>To:</strong> {new Date(hotel.end_date).toLocaleDateString()}</p>
                  <p><strong>Price:</strong> ₹{hotel.price}</p>
                  <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                </li>
              ))
            )}
          </ul>
        )
      ) : (
        transportBookings.length === 0 ? (
          <p>No transportation bookings found.</p>
        ) : (
          <ul>
            {transportBookings.map((booking) => (
              <li key={booking._id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
                <h3>Booking ID: {booking._id}</h3>
                <p><strong>Mode:</strong> {booking.transportation.mode_of_transportation}</p>
                <p><strong>From:</strong> {booking.transportation.start_point}</p>
                <p><strong>To:</strong> {booking.transportation.end_point}</p>
                <p><strong>Start Date:</strong> {new Date(booking.transportation.start_date).toLocaleDateString()}</p>
                <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )
      )}
      </div>
    </div>
  );
};

export default BookingHistory;
