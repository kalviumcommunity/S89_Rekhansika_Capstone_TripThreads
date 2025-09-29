
import React, { useState,useEffect } from 'react';
import './Booking.css';
import Header from '../sections/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const transportModes = [
  { key: 'bus', label: 'Bus' },
  { key: 'train', label: 'Train' },
  { key: 'flight', label: 'Flight' },
  { key: 'taxi', label: 'Taxi' }
];

const hotelOptions = [
  {
    key: 'hotel1',
    name: 'Grand Palace',
    location: 'Goa',
    roomTypes: [
      { type: 'AC Rooms', price: 2500 },
      { type: 'Non AC Rooms', price: 2000 }
    ]
  },
  {
    key: 'hotel2',
    name: 'Sea View',
    location: 'Goa',
    roomTypes: [
      { type: 'Non AC Rooms', price: 1800 }
    ]
  },
  {
    key: 'hotel3',
    name: 'City Inn',
    location: 'Vizag',
    roomTypes: [
      { type: 'AC Rooms', price: 2200 }
    ]
  }
];


const Booking = () => {

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      window.location.href = '/login';
    }
  }, []);

    const [message, setMessage] = useState('');

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(''), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }
}, [message]);

  const [mainTab, setMainTab] = useState('');
  const [transportType, setTransportType] = useState('');
  const [form, setForm] = useState({ start_date : '',start: '', end: '' });
  const [hotelType, setHotelType] = useState('');
  const [hotelForm, setHotelForm] = useState({ from: '', to: '', location: '' ,price:''});

  const navigate = useNavigate();
  
  const [availableTransports, setAvailableTransports] = useState([]);
  const [showTransportOptions, setShowTransportOptions] = useState(false);

  const [availableHotels, setAvailableHotels] = useState([]);
 const [showHotelOptions, setShowHotelOptions] = useState(false);

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
  
};

const handleClearTransport = () => {
  setTransportType('');
  setForm({ start_date: '', start: '', end: '' });
  setAvailableTransports([]);
  setShowTransportOptions(false);
  if (mainTab === 'transport') setMessage('');
};

const handleClearHotel = () => {
  setHotelType('');
  setHotelForm({ from: '', to: '', location: '', price: '' });
  setAvailableHotels([]);
  setShowHotelOptions(false);
  if (mainTab === 'hotel') setMessage('');
};

const handleHotelSearch = (e) => {
  e.preventDefault();
  if (new Date(hotelForm.to) <= new Date(hotelForm.from)) {
    setMessage('End date must be after start date.');
    return;
  }
  // Filter hotels by location if needed
  const filtered = hotelOptions.filter(hotel =>
    !hotelForm.location || hotel.location.toLowerCase().includes(hotelForm.location.toLowerCase())
  );
  setAvailableHotels(filtered);
  setShowHotelOptions(true);
};

const handleSelectHotel = (hotel) => {
  setHotelType(hotel.type);
  setHotelForm({
    from: hotelForm.from,
    to: hotelForm.to,
    location: hotel.location,
    price: Number(hotel.price)
  });
  setMessage(
    `Selected ${hotel.type} at ${hotel.name} in ${hotel.location} from ${hotelForm.from} to ${hotelForm.to}`
  );
  
};

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    console.log('userEmail:', userEmail); // Add this line
if (!userEmail) {
  setMessage('Please log in with your Google or registered account to book.');
  return;
}

    const hotels = hotelType && hotelForm.from && hotelForm.to && hotelForm.location
    ? [{
        type_of_hotel: hotelType,
        start_date: hotelForm.from,
        end_date: hotelForm.to,
        location: hotelForm.location,
         price: Number(hotelForm.price)
      }]
    : [];

    const hasTransport =
  transportType && form.start_date && form.start && form.end;

    const bookingData = {
  userEmail,
  ...(hasTransport && {
    transportation: {
      mode_of_transportation: transportType,
      start_date: form.start_date,
      start_point: form.start,
      end_point: form.end,
    }
  }),
  hotels
};

     try {
const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/bookings/book`,
      bookingData
    );    if (response.status === 201) {
      setMessage('Booking successful! A confirmation email has been sent.');
  // Reset forms
    setForm({ start_date: '', start: '', end: '' });
  setTransportType('');
  setAvailableTransports([]);
  setShowTransportOptions(false);

  setHotelForm({ from: '', to: '', location: '', price: '' });
  setHotelType('');
  setAvailableHotels([]);
  setShowHotelOptions(false);
} else {
  setMessage('Booking failed. Please try again.');
}
  } catch (error) {
    setMessage('An error occurred. Please try again later.',error);
  }
};

  return (
    <div className="booking-page">
      {message && (
      <div className="booking-toast">
        {message}
      </div>
    )}
      <Header />
      <section className="booking-intro">
        <h1>Welcome to TripThreads Booking Hub</h1>
        <p>Your one-stop platform for hassle-free travel bookings.</p>
      </section>

      <main className="booking-content">
        <h2>Book Your Tickets with Ease</h2>
        
        <div className='booking-tabs'>
          <button onClick={() => { setMainTab('transport'); setTransportType(''); }}>🚍 Transportation</button>
          <button onClick={() => setMainTab('hotel')}>🏨 Hotels</button>
          <button onClick={() => navigate('/bookingshistory')}>View Booking History</button>
        </div>

        {mainTab === 'transport' && (
          <>
          <form onSubmit={handleTransportSearch} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 400 }}>
      <div className='form-row'>
        <label htmlFor="start_date">Starting Date:</label>
        <input
          id="start_date"
          type="date"
          placeholder='Enter start date'
          value={form.start_date}
          onChange={e => setForm({ ...form, start_date: e.target.value })}
          required
        />
      </div>
      
      
      <div className='form-row'>
        <label htmlFor="start_point">Starting Stop:</label>
        <input
          id="start_point"
          type="text"
          placeholder='Enter starting stop'
          value={form.start}
          onChange={e => setForm({ ...form, start: e.target.value })}
          required
        />
      </div>
      <div className='form-row'>
        <label htmlFor="end_point">Ending Stop:</label>
        <input
          id="end_point"
          type="text"
          placeholder='Enter ending stop'
          value={form.end}
          onChange={e => setForm({ ...form, end: e.target.value })}
          required
        />
      </div>
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
     <button type="button" onClick={handleClearTransport} style={{ marginLeft:'6.5rem',marginTop:"1rem", background: '#0077cc', color: '#fff' }}>
      Clear Transportation
    </button>
          </>
          
        )}

      
{mainTab === 'hotel' && (
  <>
    <form onSubmit={handleHotelSearch} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 400 }}>
      <div className='form-row'>
        <label htmlFor="hotel_from">From Date:</label>
        <input
          id="hotel_from"
          type="date"
          placeholder='Enter start date'
          value={hotelForm.from}
          onChange={e => setHotelForm({ ...hotelForm, from: e.target.value })}
          required
        />
      </div>
      <div className='form-row'>
        <label htmlFor="hotel_to">To Date:</label>
        <input
          id="hotel_to"
          type="date"
          value={hotelForm.to}
          placeholder='Enter end date'
          onChange={e => setHotelForm({ ...hotelForm, to: e.target.value })}
          required
        />
      </div>
      <div className='form-row'>
        <label htmlFor="hotel_location">Location:</label>
        <input
          id="hotel_location"
          type="text"
          placeholder='Enter hotel location'
          value={hotelForm.location}
          onChange={e => setHotelForm({ ...hotelForm, location: e.target.value })}
          required
        />
      </div>
      <button type="submit">Show Options</button>
    </form>
    {showHotelOptions && (
  <div className="hotel-options">
    <h3>Available Hotels</h3>
    <ul>
      {availableHotels.map(hotel => (
        <li key={hotel.key}>
          <span>{hotel.name} | {hotel.location}</span>
          <ul>
            {hotel.roomTypes.map((room, idx) => (
              <li key={idx}>
                <span>{room.type} | ₹{room.price}</span>
                <button onClick={() => handleSelectHotel({
                  ...hotel,
                  type: room.type,
                  price: room.price
                })}>
                  Select
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
)}
<button type="button" onClick={handleClearHotel} style={{ marginLeft:'8.5rem',marginTop:"1rem", background: '#0077cc', color: '#fff' }}>
      Clear Hotel
    </button>
  </>
)}

       {(mainTab === 'transport' && transportType) ||
 (mainTab === 'hotel' && hotelType && hotelForm.price) ? (
  <button
    onClick={handleBookingSubmit}
    disabled={
      (mainTab === 'hotel' && (!hotelType || !hotelForm.from || !hotelForm.to || !hotelForm.location || !hotelForm.price))
    }
  >
    Confirm Booking
  </button>
) : null}
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
