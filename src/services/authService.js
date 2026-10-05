import { apiRequest } from './api.js';

const TOKEN_KEY = 'taskflow_token';
const USER_KEY = 'taskflow_user';

export const authService = {
  // POST /api/auth/register
  register: async ({ name, email, password }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  },

  // POST /api/auth/login
  login: async ({ email, password }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  },

  // GET /api/auth/me
  getMe: async () => {
    const data = await apiRequest('/auth/me', {
      method: 'GET',
    });
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

export default authService;
