import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Add this line for styles

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData); // Log the form data for debugging
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('http://localhost:3000/user/signup', formData);
            setSuccess(response.data.message); // Display success message
            alert('Signup successful! Redirecting to login page...');
            window.location.href = '/login'; // Redirect to login page
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="signup-container">
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
                    <button type="submit">Sign Up</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <p className="login-link">
                    Already have an account? <a href="/login">Log in here!</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;