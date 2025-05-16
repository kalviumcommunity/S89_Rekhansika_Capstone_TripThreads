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
                <p>&copy; 2025 TripThreads. All rights reserved.</p>
            </footer>
        </>
    );
};

export default About;
