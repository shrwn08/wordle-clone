
const API_URL = 'http://localhost:8080/api' || "https://wordle-backend-1fjz.onrender.com/api";

export const authService = {
  async signup(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  async signin(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signin failed');
      }

      localStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return data.user;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  }
};