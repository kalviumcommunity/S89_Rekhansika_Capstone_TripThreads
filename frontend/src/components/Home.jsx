import React from 'react';
import './Home.css';
import Header from '../sections/header';
import axios from 'axios';
import { useEffect } from 'react';

const Home = () => {

  useEffect(() => {
    // Only fetch if user is not already in localStorage
    if (!localStorage.getItem("user")) {
      axios.get("http://localhost:3000/auth/status", { withCredentials: true })
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

      <footer className="footer">
        <div className="about">
          <h4>About our website..</h4>
          <p>
            TripThreads is more than a tool—it’s your companion for exploring, discovering, and creating memories around
            the globe. Whether you're seeking hidden gems or planning the perfect vacation, we've got you covered.
          </p>
        </div>
        <div className="contact">
          <p>
            Contact us: <span>+91 9963204753, +91 9884807800</span>
          </p>
          <div className="social-icons">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-youtube"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;