// App.jsx
import React, { useState, useEffect } from 'react';
import AuthPage from './components/Auth/AuthPage';
import GamePage from './components/Game/GamePage';
import StatsPage from './components/Stats/StatsPage';
import Navbar from './components/Layout/Navbar';
import { authService } from "./services/authServices.js";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('game');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.verifyToken(token);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('game');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`app ${theme}`}>
      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="app-content">
        {currentView === 'game' ? (
          <GamePage user={user} theme={theme} />
        ) : (
          <StatsPage user={user} theme={theme} />
        )}
      </div>
    </div>
  );
}

export default App;
