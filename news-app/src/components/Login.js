import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError('');

    if (!validateEmail(email)) return setError('Please enter a valid email.');
    if (!validatePassword(password)) return setError('Password must be at least 6 characters.');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    setError('');

    if (!validateEmail(email)) return setError('Please enter a valid email.');
    if (!validatePassword(password)) return setError('Password must be at least 6 characters.');

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsRegistering(false);
        alert('Registration successful! Please log in.');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="newsapp-container">
      <div className="navbar1">
        <span className="navbar-title1">News Aggregator</span>
      </div>
      <div className="login-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                className="login-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              className="login-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="login-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔓' : '🔒'}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <p className="toggle-text">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="toggle-button"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
