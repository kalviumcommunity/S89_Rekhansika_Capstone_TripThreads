import React from 'react';
import './Home.css';
import Header from '../sections/Header';
import axios from 'axios';
import { useEffect } from 'react';

const Home = () => {

  const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const name = params.get('name');
const email = params.get('email');
if (token && email) {
  localStorage.setItem('user', JSON.stringify({ token, name, email }));
  // Optionally, remove query params from URL
  window.history.replaceState({}, document.title, "/home");
}

  useEffect(() => {
    // Only fetch if user is not already in localStorage
    if (!localStorage.getItem("user")) {
      axios.get("https://s89-rekhansika-capstone-tripthreads-1.onrender.com/auth/status", { withCredentials: true })
        .then(res => {
          if (res.data.authenticated && res.data.user) {
            localStorage.setItem("user", JSON.stringify({
              name: res.data.user.displayName || res.data.user.name,
              email: res.data.user.emails ? res.data.user.emails[0].value : res.data.user.email,
              id: res.data.user._id || res.data.user.id,
            }));
          }
        })
        .catch((err) => {
          console.log("Failed to fetch user data:", err);
        });
    }
  }, []);
  return (
    <div className="home">
      <Header />

      <section className="welcome-section">
        <h1>Welcome to TripThread!!</h1>
        <p>
          Your Gateway to Discover, Connect, and Explore ...we believe travel is more than just reaching a destination—
          it’s about the journey, the connections, and the memories you create along the way. Our app brings everything
          you need for a perfect travel experience right to your fingertips.
        </p>
        <p>
          Dive into a world designed for travelers, dreamers, and adventurers like you.
        </p>
      </section>

      <section className="features">
        <h2>Features You’ll Love:</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="https://img.icons8.com/dusk/64/train-ticket.png" alt="Book" />
            <h3>Book your tickets</h3>
            <p>Effortlessly book travel tickets, hotels, and other essentials—everything in one place.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/64/robot-2.png" alt="ChatBot" />
            <h3>AI ChatBox</h3>
            <p>Our AI chat assistant provides instant answers and personalized recommendations.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/color/64/marker--v1.png" alt="Location" />
            <h3>Location</h3>
            <p>Find specific destinations tailored to your interests and preferences.</p>
          </div>
          <div className="feature-card">
            <img src="https://i.pinimg.com/736x/fd/a0/dd/fda0dd72802bace4e1a865fc1710064c.jpg" alt="Share" />
            <h3>Share your own experiences</h3>
            <p>Document your travel stories and share them with a vibrant community of wanderers.</p>
          </div>
          <div className="feature-card full-width">
            <img src="https://img.icons8.com/fluency/64/add-user-group-man-man.png" alt="Follow" />
            <h3>Follow each other and build new friends</h3>
            <p>Stay updated on your friends’ travel experiences and adventures.</p>
          </div>
        </div>
      </section>

      <footer className="experience-footer">
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

export default Home;