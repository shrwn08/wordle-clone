
import { authService } from './authServices';

const API_URL = 'https://wordle-backend-1fjz.onrender.com';

export const gameService = {
  async saveGameResult(gameData) {
    try {
      console.log(gameData);
      const token = authService.getToken();

       const { won, guesses, word } = gameData;

      const response = await fetch(`${API_URL}/stats/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ won, guesses, word }),
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