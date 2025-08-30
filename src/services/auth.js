// services/auth.js
import api from "./api";
import config from "../config";

const { AUTH, API_URLS } = config;

const authService = {
  login: async (username, password) => {
    try {
      // Basic Auth header for login
      const basicToken = btoa(`${username}:${password}`);
      const response = await api.post(
        API_URLS.LOGIN,
        {},
        {
          headers: {
            Authorization: `Basic ${basicToken}`,
          },
        }
      );

      if (response.data && response.data.token) {
        localStorage.setItem(AUTH.TOKEN_KEY, response.data.token);
        return response.data;
      }
      throw new Error("Invalid login response");
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH.TOKEN_KEY);
    localStorage.removeItem(AUTH.USERNAME);
    localStorage.removeItem(AUTH.PASSWORD);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH.TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(AUTH.TOKEN_KEY);
  },
};

export default authService;
