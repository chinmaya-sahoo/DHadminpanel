// services/api.js
import axios from "axios";
import config from "../config/config";

// Create axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: config.CORS.HEADERS,
  withCredentials: config.CORS.WITH_CREDENTIALS,
});

// Token management utilities
const tokenManager = {
  getToken: () => localStorage.getItem(config.AUTH.TOKEN_KEY),
  
  setToken: (token) => {
    localStorage.setItem(config.AUTH.TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  },
  
  clearToken: () => {
    localStorage.removeItem(config.AUTH.TOKEN_KEY);
    localStorage.removeItem(config.AUTH.ADMIN_FLAG);
    delete api.defaults.headers.common['Authorization'];
  },
  
  isAuthenticated: () => {
    const token = tokenManager.getToken();
    const adminFlag = localStorage.getItem(config.AUTH.ADMIN_FLAG) === "true";
    return !!(token && adminFlag);
  },
  
  // Initialize token on app load
  initialize: () => {
    const token = tokenManager.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      tokenManager.clearToken();
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = config.ERRORS.NETWORK_ERROR;
    }
    
    return Promise.reject(error);
  }
);

// API Services
const apiService = {
  // Authentication
  login: async (email, password) => {
    try {
      // Create basic auth header for login
      const basicToken = btoa(`${email}:${password}`);
      
      const response = await api.post(
        config.API_ENDPOINTS.LOGIN,
        {},
        {
          headers: {
            Authorization: `Basic ${basicToken}`,
          },
        }
      );

      if (response.data && response.data.token) {
        // Set token and admin flag
        tokenManager.setToken(response.data.token);
        localStorage.setItem(config.AUTH.ADMIN_FLAG, "true");
        
        return {
          success: true,
          data: response.data,
          message: "Login successful"
        };
      }
      
      throw new Error(config.ERRORS.INVALID_CREDENTIALS);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(config.ERRORS.INVALID_CREDENTIALS);
      } else if (error.response?.status >= 500) {
        throw new Error(config.ERRORS.SERVER_ERROR);
      }
      throw new Error(error.message || config.ERRORS.SERVER_ERROR);
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.VERIFY_TOKEN);
      return response.data;
    } catch (error) {
      tokenManager.clearToken();
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Optional: Call backend logout endpoint
      await api.post(config.API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error('Logout API call failed:', error);
    } finally {
      tokenManager.clearToken();
    }
  },

  // Check authentication status
  isAuthenticated: tokenManager.isAuthenticated,

  // Initialize API service
  initialize: tokenManager.initialize,

  // Generic API methods
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  delete: (url) => api.delete(url),

  // User services
  getUser: async () => {
    const response = await api.get(config.API_ENDPOINTS.USER);
    return response.data;
  },

  // Business services
  getBusiness: async () => {
    const response = await api.get(config.API_ENDPOINTS.BUSINESS);
    return response.data;
  },

  // Subscription services
  getSubscriptions: async () => {
    const response = await api.get(config.API_ENDPOINTS.SUBSCRIPTION);
    return response.data;
  },

  updateSubscription: async (id, data) => {
    const response = await api.put(`${config.API_ENDPOINTS.SUBSCRIPTION}${id}/`, data);
    return response.data;
  },

  // Income services
  getIncomes: async () => {
    const response = await api.get(config.API_ENDPOINTS.INCOME);
    return response.data;
  },

  // Expense services
  getExpenses: async () => {
    const response = await api.get(config.API_ENDPOINTS.EXPENSE);
    return response.data;
  },

  // Reports
  getReports: async () => {
    const response = await api.get(config.API_ENDPOINTS.REPORT);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get(config.API_ENDPOINTS.NOTIFICATION);
    return response.data;
  },
};

// Initialize token management when module loads
tokenManager.initialize();

export default apiService;