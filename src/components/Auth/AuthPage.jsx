
import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './Auth.css';

const AuthPage = ({ onLogin, theme, toggleTheme }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const user = await authService.signup({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        onLogin(user);
      } else {
        const user = await authService.signin({
          email: formData.email,
          password: formData.password
        });
        onLogin(user);
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className={`auth-page ${theme}`}>
      <div className="auth-header">
        <h1 className="auth-logo">WordMaster</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isSignup ? 'Sign up to start playing' : 'Sign in to continue'}
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-form">
            {isSignup && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button
              className="auth-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Sign In')}
            </button>
          </div>

          <div className="auth-switch">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button onClick={toggleMode} className="switch-btn">
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;