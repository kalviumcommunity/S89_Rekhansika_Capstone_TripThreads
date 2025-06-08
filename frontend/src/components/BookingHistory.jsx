import React, { useEffect, useState } from 'react';
import './Booking.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchBookingHistory = async () => {
    const userEmail = localStorage.getItem('userEmail') || "user@example.com"; // Get from localStorage or use a default
    try {
      const response = await fetch(`/api/bookings/history/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking history');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchBookingHistory();
}, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="booking-history">
      <h2>Your Booking History</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <h3>Booking ID: {booking._id}</h3>
              <p>Transportation: {booking.transportation.mode_of_transportation}</p>
              <p>Hotel: {booking.hotels.map(hotel => hotel.type_of_hotel).join(', ')}</p>
              <p>Start Date: {new Date(booking.transportation.start_date).toLocaleDateString()}</p>
              <p>End Date: {new Date(booking.transportation.end_date).toLocaleDateString()}</p>
              <p>Location: {booking.transportation.location}</p>
              <p>Booked On: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;