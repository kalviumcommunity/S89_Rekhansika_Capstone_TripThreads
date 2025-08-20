import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [popup, setPopup] = useState({ show: false, message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showPopup = (message) => {
        setPopup({ show: true, message });
        setTimeout(() => setPopup({ show: false, message: '' }), 3000);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (formData.password !== formData.confirmPassword) {
            showPopup("Password and Confirm Password do not match");
            return;
        }
        const response = await axios.post('https://s89-rekhansika-capstone-tripthreads-1.onrender.com/user/signup', formData);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({
            name: response.data.name,
            id: response.data.id,
            email: formData.email,
        }));
        showPopup(
            <>
                User registered successfully.<br />
                <span style={{ fontSize: "0.9em" }}>Redirecting to login page...</span>
            </>
        );
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    } catch (error) {
        const msg = error.response?.data?.message || 'Something went wrong';
        showPopup(msg);
    }
};

    return (
        <div className="signup-container">
            {popup.show && (
                <div className="custom-alert">
                    {popup.message}
                </div>
            )}
            <header className="navbar">
                <a href="/" className="logo">TripThreads</a>
            </header>
            <div className="signup-box">
                <h2>Create Your Account</h2>
                <p>Sign up to start your journey with TripThreads.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name.."
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email.."
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password.."
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password.."
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Log in here!</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;