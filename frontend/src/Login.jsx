import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        { email, password, remember: rememberMe },
        { withCredentials: true }
      );

      if (response.data.message === 'Login successful') {
        // Check if the logged-in user is an admin
        if (response.data.user.email === 'admin@example.com') {
          // Redirect to the Admin Panel
          navigate('/adminpanel');
        } else {
          // Redirect to the profile page for regular users
          navigate('/profile');
        }
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (err) {
      alert('An error occurred during login.');
      console.error(err);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="login-checkbox"
            />
            Remember me
          </label>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
