import React, { useState } from 'react';
import './Booking.css';
import Header from '../sections/header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const transportModes = [
  { key: 'bus', label: 'Bus' },
  { key: 'train', label: 'Train' },
  { key: 'flight', label: 'Flight' },
  { key: 'taxi', label: 'Taxi' }
];

const hotelRoomTypes = [
  { key: 'ac', label: 'AC Rooms' },
  { key: 'nonac', label: 'Non AC Rooms' }
];

const Booking = () => {
  const [mainTab, setMainTab] = useState('');
  const [transportType, setTransportType] = useState('');
  const [form, setForm] = useState({ start_date : '', end_date:"",start: '', end: '' });
  const [hotelType, setHotelType] = useState('');
  const [hotelForm, setHotelForm] = useState({ from: '', to: '', location: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const [availableTransports, setAvailableTransports] = useState([]);
  const [showTransportOptions, setShowTransportOptions] = useState(false);

const handleTransportSearch = (e) => {
  e.preventDefault();
  // Example: Filter available transport modes (replace with real API if needed)
  const options = transportModes.map(mode => ({
    ...mode,
    start: form.start,
    end: form.end,
    price: Math.floor(Math.random() * 500) + 100 // Random price for demo
  }));
  setAvailableTransports(options);
  setShowTransportOptions(true);
};

const handleSelectTransport = (mode) => {
  setTransportType(mode.key);
  setMessage(`Selected ${mode.label} from ${form.start} to ${form.end}`);
  setShowTransportOptions(false);
};

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
  setMessage('Please log in with your Google or registered account to book.');
  return;
}

    const hotels = hotelType && hotelForm.from && hotelForm.to && hotelForm.location
    ? [{
        type_of_hotel: hotelType,
        start_date: hotelForm.from,
        end_date: hotelForm.to,
        location: hotelForm.location
      }]
    : [];

    const bookingData = {
      userEmail,
      transportation: {
        mode_of_transportation: transportType,
        start_date: form.start_date,
        end_date: form.end_date,
        start_point: form.start,
        end_point: form.end
      },
      hotels
    };

     try {
    const response = await axios.post('http://localhost:3000/api/bookings/book', bookingData);
    if (response.status === 201) {
      setMessage('Booking successful! A confirmation email has been sent.');
      // Reset forms or handle further actions
    } else {
      setMessage('Booking failed. Please try again.');
    }
  } catch (error) {
    setMessage('An error occurred. Please try again later.',error);
  }
};

  return (
    <div className="booking-page">
      <Header />
      <section className="booking-intro">
        <h1>Welcome to TripThreads Booking Hub</h1>
        <p>Your one-stop platform for hassle-free travel bookings.</p>
      </section>

      <main className="booking-content">
        <h2>Book Your Tickets with Ease</h2>
        <p>{message}</p>
        <div className='booking-tabs'>
          <button onClick={() => { setMainTab('transport'); setTransportType(''); }}>🚍 Transportation</button>
          <button onClick={() => setMainTab('hotel')}>🏨 Hotels</button>
          <button onClick={() => navigate('/bookingshistory')}>View Booking History</button>
        </div>

        {mainTab === 'transport' && (
          <>
          <form onSubmit={handleTransportSearch}>
            <input
              type="date"
              placeholder="Starting Date"
              value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Ending Date"
              value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Starting Stop"
              value={form.start}
              onChange={e => setForm({ ...form, start: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Ending Stop"
              value={form.end}
              onChange={e => setForm({ ...form, end: e.target.value })}
              required
            />
            <button type="submit">Show Options</button>
          </form>

          {showTransportOptions && (
      <div className="transport-options">
        <h3>Available Transport Options</h3>
        <ul>
          {availableTransports.map(option => (
            <li key={option.key}>
              <span>{option.label} | {option.start} → {option.end} | ₹{option.price}</span>
              <button onClick={() => handleSelectTransport(option)}>Select</button>
            </li>
          ))}
        </ul>
      </div>
    )}
          </>
          
        )}

        {mainTab === 'hotel' && (
          <form onSubmit={handleHotelSearch}>
            <input
              type="text"
              placeholder="From Date"
              value={hotelForm.from}
              onChange={e => setHotelForm({ ...hotelForm, from: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="To Date"
              value={hotelForm.to}
              onChange={e => setHotelForm({ ...hotelForm, to: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={hotelForm.location}
              onChange={e => setHotelForm({ ...hotelForm, location: e.target.value })}
              required
            />
            <button type="submit">Show Options</button>
          </form>
        )}

        <button onClick={handleBookingSubmit}>Confirm Booking</button>
      </main>

      <footer className="experience-footer">
        <div className="about">
          <h4>About our website..</h4>
          <p>TripThreads is more than a tool—it's your companion for exploring, discovering, and creating memories around the globe.</p>
        </div>
        <div className="contact">
          <p>Contact us : <span>+91 9963204753, +91 9884807800</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Booking;