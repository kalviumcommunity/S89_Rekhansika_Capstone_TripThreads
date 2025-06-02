import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Add this line for styles

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/user/login', formData);
            alert(response.data.message);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/home';
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="login-container">
            <header className="navbar">
                <a href="/" className="logo">TripThreads</a>
            </header>
            <div className="login-box">
                <h2>Welcome Back!</h2>
                <p>Login with your email.</p>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" >Login</button>
                </form>

                <button 
                  onClick={() => window.location.href = 'http://localhost:3000/auth/google/'}
                  className="google-signin-button"
                >
                  <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.82 2.36 30.28 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.36 13.36 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.03l7.19 5.59C43.29 37.29 46.1 31.46 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.09-3.22-1.09-6.7 0-9.92l-7.98-6.2C.64 16.18 0 19.02 0 22c0 2.98.64 5.82 1.79 8.42l8.88-7.13z"/><path fill="#EA4335" d="M24 44c6.28 0 11.56-2.08 15.41-5.66l-7.19-5.59c-2.01 1.35-4.59 2.15-8.22 2.15-6.27 0-11.64-3.86-13.33-9.29l-8.88 7.13C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                  </span>
                  Sign in with Google
                </button>

                <p className="signup-link">
                    Don’t have an account? <a href="/signup">Sign up now!</a>
                </p>
            </div>
        </div>
    );
};

export default Login;