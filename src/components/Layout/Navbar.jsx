// components/Layout/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = ({ user, currentView, setCurrentView, onLogout, theme, toggleTheme }) => {
  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">WordMaster</h1>
        </div>

        <div className="navbar-center">
          <button
            className={`nav-btn ${currentView === 'game' ? 'active' : ''}`}
            onClick={() => setCurrentView('game')}
          >
            🎮 Game
          </button>
          <button
            className={`nav-btn ${currentView === 'stats' ? 'active' : ''}`}
            onClick={() => setCurrentView('stats')}
          >
            📊 Stats
          </button>
        </div>

        <div className="navbar-right">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="user-info">
            <span className="username">👤 {user.username}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;