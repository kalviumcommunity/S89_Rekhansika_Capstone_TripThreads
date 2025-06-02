import React, { useState } from 'react';
import './Booking.css';
import Header from '../sections/header';

const transportModes = [
  { key: 'bus', label: 'Bus' },
  { key: 'train', label: 'Train' },
  { key: 'flight', label: 'Flight' },
  { key: 'taxi', label: 'Taxi' }
];

const dummyResults = [
  { id: 1, name: 'Express Bus', price: '₹500', type: 'bus' },
  { id: 2, name: 'Superfast Train', price: '₹1200', type: 'train' },
  { id: 3, name: 'Indigo Flight', price: '₹3500', type: 'flight' },
  { id: 4, name: 'Ola Taxi', price: '₹800', type: 'taxi' }
];

const hotelRoomTypes = [
  { key: 'ac', label: 'AC Rooms' },
  { key: 'nonac', label: 'Non AC Rooms' }
];

const dummyHotelResults = [
  { id: 1, name: 'Hotel Paradise', price: '₹2000/night', type: 'ac', location: 'Hyderabad' },
  { id: 2, name: 'Comfort Stay', price: '₹1200/night', type: 'nonac', location: 'Hyderabad' },
  { id: 3, name: 'City Inn', price: '₹1800/night', type: 'ac', location: 'Bangalore' },
  { id: 4, name: 'Budget Lodge', price: '₹900/night', type: 'nonac', location: 'Bangalore' }
];

const Booking = () => {
  const [mainTab, setMainTab] = useState('');
  const [transportType, setTransportType] = useState('');
  const [form, setForm] = useState({ start: '', end: '' ,from: '', to: ''});
  const [results, setResults] = useState([]);
  const [booked, setBooked] = useState(null);

  const [hotelType, setHotelType] = useState('');
  const [hotelForm, setHotelForm] = useState({ from: '', to: '', location: '' });
  const [hotelResults, setHotelResults] = useState([]);
  const [hotelBooked, setHotelBooked] = useState(null);

  const handleTransportSearch = (e) => {
    e.preventDefault();
    // Filter dummy results by type
    const filtered = dummyResults.filter(r => r.type === transportType);
    setResults(filtered);
    setBooked(null);
  };

  const handleBook = (option) => {
    setBooked(option);
  };

  const handleHotelSearch = (e) => {
  e.preventDefault();
  // Filter dummy hotel results by type and location
  const filtered = dummyHotelResults.filter(
    r => r.type === hotelType && r.location.toLowerCase() === hotelForm.location.trim().toLowerCase()
  );
  setHotelResults(filtered);
  setHotelBooked(null);
};

const handleHotelBook = (option) => {
  setHotelBooked(option);
};

  return (
    <div className="booking-page">
      <Header />

      <section className="booking-intro">
  <h1>Welcome to TripThreads Booking Hub</h1>
  <p>Your one-stop platform for hassle-free travel <br/> bookings—transportation and hotels <br/>tailored for your journey.</p>
</section>

<section className="booking-features">
  <div>
    <h3>🚗 Wide Range of Transport</h3>
    <p>Book buses, trains, flights, and taxis—all from one place.</p>
  </div>
  <div>
    <h3>🏨 Verified Hotels</h3>
    <p>Comfortable stays at competitive prices across major cities.</p>
  </div>
  <div>
    <h3>💳 Secure Payments</h3>
    <p>Your data is protected with industry-standard encryption.</p>
  </div>
</section>


      <main className="booking-content">
        <img src="" alt="" />
        <h2>Book Your Tickets with Ease</h2>
  <p style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '1rem' }}>
    Whether you're traveling across cities or looking for a cozy stay, TripThreads has you covered. 
    Choose your mode of transport or find the best hotels—all in a few clicks.
  </p>
  <br />
  <div className='booking-tabs' style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
    <button onClick={() => { setMainTab('transport'); setTransportType(''); setResults([]); }} className={mainTab === 'transport' ? 'active' : ''}>🚍 Transportation</button>
    <button onClick={() => setMainTab('hotel')} className={mainTab === 'hotel' ? 'active' : ''}>🏨 Hotels</button>
  </div>

        {mainTab === 'transport' && (
          <>
            {!transportType ? (
              <div className='transport-modes'>
                {transportModes.map(mode => (
                  <button key={mode.key} onClick={() => setTransportType(mode.key)}>{mode.label}</button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleTransportSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
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
                <input
          type="date"
          placeholder="From Date (e.g. 2024-06-01)"
          value={hotelForm.from}
          onChange={e => setHotelForm({ ...hotelForm, from: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="To Date (e.g. 2024-06-01)"
          value={hotelForm.to}
          onChange={e => setHotelForm({ ...hotelForm, to: e.target.value })}
          required
        />
               
                <button type="submit">Show Options</button>
                <button type="button" onClick={() => { setTransportType(''); setResults([]); }}>Back</button>
              </form>
            )}

            {results.length > 0 && (
              <div className="search-results">
                <h3>Available {transportType.charAt(0).toUpperCase() + transportType.slice(1)}s</h3>
                <ul>
                  {results.map(option => (
                    <li key={option.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{option.name} - {option.price}</span>
                      <button onClick={() => handleBook(option)}>Book</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {booked && (
              <div style={{ marginTop: '1rem', color: 'green', textAlign: 'center' }}>
                Booked: {booked.name} ({booked.price})
              </div>
            )}
          </>
        )}

        {mainTab === 'hotel' && (
  <>
    {!hotelType ? (
      <div className="transport-modes">
        {hotelRoomTypes.map(room => (
          <button key={room.key} onClick={() => setHotelType(room.key)}>{room.label}</button>
        ))}
      </div>
    ) : (
      <form onSubmit={handleHotelSearch}>
        <input
          type="text"
          placeholder="From Date (e.g. 2024-06-01)"
          value={hotelForm.from}
          onChange={e => setHotelForm({ ...hotelForm, from: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="To Date (e.g. 2024-06-05)"
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
        <button type="button" onClick={() => { setHotelType(''); setHotelResults([]); }}>Back</button>
      </form>
    )}

    {hotelResults.length > 0 && (
      <div className="search-results">
        <h3>Available {hotelType === 'ac' ? 'AC' : 'Non AC'} Rooms</h3>
        <ul>
          {hotelResults.map(option => (
            <li key={option.id}>
              <span>{option.name} - {option.price} - {option.location}</span>
              <button onClick={() => handleHotelBook(option)}>Book</button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {hotelBooked && (
      <div style={{ marginTop: '1rem', color: 'green', textAlign: 'center' }}>
        Booked: {hotelBooked.name} ({hotelBooked.price})
      </div>
    )}
  </>
)}
      </main>

      <footer className="experience-footer" style={{background:'rgba(255, 255, 255, 0.5)'}}>
        <div className="about">
          <h4>About our website..</h4>
          <p>
            TripThreads is more than a tool—it's your companion for exploring, discovering, and creating memories around the globe. Whether you're seeking hidden gems or planning the perfect vacation, we've got you covered.
          </p>
        </div>
        <div className="contact">
          <p>Contact us : <span>+91 9963204753, +91 9884807800</span></p>
          <div className="social-icons">
            <img src="https://i.pinimg.com/736x/19/42/d5/1942d5deb0f788e6228054cd92767ff6.jpg" alt="instagram" />
            <img src="https://i.pinimg.com/736x/bf/70/a6/bf70a612edf2ce2b7b80865989d6df0a.jpg" alt="facebook" />
            <img src="https://i.pinimg.com/736x/dd/26/a9/dd26a9a2100d2d4575353e0ece4ab2a1.jpg" alt="whatsapp" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Booking;