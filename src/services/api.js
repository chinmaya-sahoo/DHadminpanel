// services/api.js
import axios from "axios";
import config from "../config/config";

// Create axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Auth manager
const authManager = {
  get: () =>
    sessionStorage.getItem("authHeader") ||
    localStorage.getItem("authHeader"),

  set: (authHeader, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("authHeader", authHeader);
    } else {
      sessionStorage.setItem("authHeader", authHeader);
    }
    api.defaults.headers.common["Authorization"] = authHeader;
  },

  clear: () => {
    sessionStorage.removeItem("authHeader");
    localStorage.removeItem("authHeader");
    delete api.defaults.headers.common["Authorization"];
  },

  init: () => {
    const authHeader = authManager.get();
    if (authHeader) {
      api.defaults.headers.common["Authorization"] = authHeader;
    }
  },
};

// Attach auth header before every request
api.interceptors.request.use((cfg) => {
  const authHeader = authManager.get();
  if (authHeader) cfg.headers.Authorization = authHeader;
  return cfg;
});

// Redirect to login if unauthorized
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      authManager.clear();
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

// API service
const apiService = {
  // Change 'email' parameter to 'username'
  login: async (username, password, rememberMe = false) => {
    // Construct the auth header using 'username'
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const res = await api.get(config.API_ENDPOINTS.PROFILE, {
        headers: { Authorization: authHeader },
      });

      authManager.set(authHeader, rememberMe);

      return { success: true, user: res.data };
    } catch (err) {
      if (err.response?.status === 401) {
        throw new Error("Invalid username or password");
      }
      throw new Error("Login failed. Please try again.");
    }
  },

  logout: () => {
    authManager.clear();
    window.location.href = "/admin/login";
  },

  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  delete: (url) => api.delete(url),
  isAuthenticated: () => !!authManager.get(),
  verifyAuth: async () => {
    try {
      await api.get(config.API_ENDPOINTS.PROFILE);
      return true;
    } catch (error) {
      throw new Error("Auth verification failed");
    }
  },
};

// Initialize on app load
authManager.init();

export default apiService;