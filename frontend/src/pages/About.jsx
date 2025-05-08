import React from 'react';
import './About.css';

const About = () => {
    return (
        <>
            <header className="navbar">
                <div className="navbar-container">
                    <div className="logo">TripThreads</div>
                    <nav>
                        <a href="/login">Login</a>
                        <a href="/signup">Sign Up</a>
                    </nav>
                </div>
            </header>

            <section className="home-header">
                <div className="hero-content">
                    <h1>Welcome to TripThreads 🌍</h1>
                    <p>Collect Memories, Not Things</p>
                </div>
            </section>

            <section className="home-features">
                <div className="home-container">
                    <h2>Why Choose TripThreads?</h2>
                    <ul className="feature-list">
                        <li>🌟 AI-Powered Travel Assistant</li>
                        <li>📍 Location-Based Search & Recommendations</li>
                        <li>💬 Social Features to Connect with Travelers</li>
                        <li>📓 Share Your Travel Diaries & Experiences</li>
                    </ul>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; 2025 TripThreads. All rights reserved.</p>
            </footer>
        </>
    );
};

export default About;
