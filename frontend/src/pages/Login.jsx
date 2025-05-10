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
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                name: response.data.name,
                id: response.data.id,
                email: formData.email,
            }));
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
                <p className="signup-link">
                    Don’t have an account? <a href="/signup">Sign up now!</a>
                </p>
            </div>
        </div>
    );
};

export default Login;