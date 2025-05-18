import React from 'react';
import './About.css';

const About = () => {
    return (
        <>
            {/* Navbar */}
            <header className="navbar">
                <div className="navbar-container">
                    <div className="logo">TripThreads</div>
                    <nav className="nav-links">
                        <a href="/login">Login</a>
                        <a href="/signup">Sign Up</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to TripThreads 🌍</h1>
                    <p>Collect Memories, Not Things</p>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Why Choose TripThreads?</h2>
                <ul className="features-list">
                    <li>🌟 AI-Powered Travel Assistant</li>
                    <li>📍 Location-Based Search & Recommendations</li>
                    <li>💬 Connect with Fellow Travelers</li>
                    <li>📓 Share Your Travel Diaries</li>
                </ul>
            </section>

            {/* Footer */}
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
        </>
    );
};

export default About;
