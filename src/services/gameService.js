
import { authService } from './authServices';

const API_URL = 'http://localhost:8080/api';

export const gameService = {
  async saveGameResult(gameData) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/stats/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save game result');
      }

      return data;
    } catch (error) {
      console.error('Error saving game result:', error);
      throw error;
    }
  },

  async getUserStats(userId) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/stats/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      return data.stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/stats/leaderboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }

      return data.leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
};