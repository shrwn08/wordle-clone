// components/Stats/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import './Stats.css';

const StatsPage = ({ user}) => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchData();
   
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userStats, leaderboardData] = await Promise.all([
        gameService.getUserStats(user.id),
        gameService.getLeaderboard()
      ]);
      setStats(userStats);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  const winRate = stats?.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="stats-page">
      <div className="stats-tabs">
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          My Stats
        </button>
        <button
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'stats' ? (
        <div className="stats-content">
          <h2 className="stats-title">Your Statistics</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{stats?.gamesPlayed || 0}</div>
              <div className="stat-label">Games Played</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{stats?.gamesWon || 0}</div>
              <div className="stat-label">Games Won</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{winRate}%</div>
              <div className="stat-label">Win Rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{stats?.currentStreak || 0}</div>
              <div className="stat-label">Current Streak</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats?.maxStreak || 0}</div>
              <div className="stat-label">Best Streak</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">
                {stats?.gamesPlayed > 0 
                  ? (stats.totalAttempts / stats.gamesWon || 0).toFixed(1)
                  : 0}
              </div>
              <div className="stat-label">Avg. Attempts</div>
            </div>
          </div>

          <div className="guess-distribution">
            <h3>Guess Distribution</h3>
            <div className="distribution-chart">
              {[1, 2, 3, 4, 5, 6].map(num => {
                const count = stats?.guessDistribution?.[num] || 0;
                const maxCount = Math.max(...Object.values(stats?.guessDistribution || {}), 1);
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={num} className="distribution-row">
                    <span className="distribution-label">{num}</span>
                    <div className="distribution-bar-container">
                      <div
                        className="distribution-bar"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="distribution-count">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="leaderboard-content">
          <h2 className="stats-title">Global Leaderboard</h2>
          <div className="leaderboard-list">
            {leaderboard.length === 0 ? (
              <p className="no-data">No leaderboard data yet</p>
            ) : (
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Games Won</th>
                    <th>Win Rate</th>
                    <th>Current Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr
                      key={player.id}
                      className={player.id === user.id ? 'current-user' : ''}
                    >
                      <td className="rank">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && index + 1}
                      </td>
                      <td className="username">
                        {player.username}
                        {player._id === user._id && ' (You)'}
                      </td>
                      <td>{player.gamesWon}</td>
                      <td>{player.winRate}%</td>
                      <td>{player.currentStreak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;