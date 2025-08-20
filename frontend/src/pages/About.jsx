import React, { useEffect, useState } from "react";
import { FaGlobe, FaRobot, FaMapMarkerAlt, FaUsers, FaBook, FaArrowUp } from "react-icons/fa";
import "./About.css";

const About = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const boxes = document.querySelectorAll(".fade-in");
    const handleScroll = () => {
      boxes.forEach((box) => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < window.innerHeight - 100) {
          box.classList.add("visible");
        }
      });
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="about-bg">
      {/* Navbar */}
      
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">TripThreads</div>
          <nav className="nav-links">
            <a href="/login" className="btn-login">Login</a>
            <a href="/signup" className="btn-signup">Sign Up</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-welcome-box">
            <h1>
            Welcome to <span className="brand-gradient">TripThreads</span> <FaGlobe />
            </h1>
          <p className="hero-tagline">Collect Memories, Not Things</p>
          
         <button
         className="hero-img animated-img"
         onClick={() => window.location.href = "/signup"}>Explore...</button>
        </div>
        </div>
        
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose TripThreads?</h2>
        <ul className="features-list">
          <li className="fade-in feature-card" onClick={() => window.location.href = "/signup"}><FaRobot /> AI-Powered Travel Assistant</li>
          <li className="fade-in feature-card" onClick={() => window.location.href = "/signup"}><FaMapMarkerAlt /> Location-Based Search & Recommendations</li>
          <li className="fade-in feature-card" onClick={() => window.location.href = "/signup"}><FaUsers /> Connect with Fellow Travelers</li>
          <li className="fade-in feature-card" onClick={() => window.location.href = "/signup"}><FaBook /> Share Your Travel Diaries</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="footer transparent-footer-box">
  <div className="footer-content">
    <div className="footer-left">
      <div className="footer-logo">TripThreads</div>
      <p className="footer-desc">
        TripThreads is your companion for exploring, discovering, and creating memories around the globe. Whether you're seeking hidden gems or planning the perfect vacation, we've got you covered.
      </p>
    </div>
    <div className="footer-center">
      <div className="footer-contact">
        <strong>Contact:</strong>
        <span>+91 9963204753</span>
        <span>+91 9884807800</span>
      </div>
      <div className="footer-social">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
          <i className="fa-brands fa-facebook"></i>
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
          <i className="fa-brands fa-youtube"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
          <i className="fa-brands fa-twitter"></i>
        </a>
      </div>
    </div>
  </div>
  <div className="footer-bottom">
    &copy; {new Date().getFullYear()} TripThreads. All rights reserved.
  </div>
</footer>

      {/* Scroll to top button */}
      {showScroll && (
        <button className="scroll-to-top" onClick={scrollToTop} title="Back to top">
          <FaArrowUp />
        </button>
      )}
      
    </div>
  );
};

export default About;