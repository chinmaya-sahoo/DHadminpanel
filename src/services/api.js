import axios from 'axios';
import config from '../config/config';

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('admin_logged_in');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
    if (error.response?.data?.error) {
      console.error('Server Error:', error.response.data.error);
    }
    return Promise.reject(error);
  }
);

// Helper function for file uploads
const uploadWithFiles = (url, formData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${config.API_BASE_URL}${url}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  });
};

// Helper function for file updates
const updateWithFiles = (url, formData) => {
  const token = localStorage.getItem('token');
  return axios.put(`${config.API_BASE_URL}${url}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  });
};

// Hero Carousel endpoints
const heroCarouselEndpoints = {
  getCarouselItems: () => api.get('/api/hero-carousel'),
  getCarouselItem: (id) => api.get(`/api/hero-carousel/${id}`),
  getActiveCarouselItems: () => api.get('/api/hero-carousel/active'),
  createCarouselItem: (formData) => uploadWithFiles('/api/hero-carousel', formData),
  updateCarouselItem: (id, formData) => updateWithFiles(`/api/hero-carousel/${id}`, formData),
  deleteCarouselItem: (id) => api.delete(`/api/hero-carousel/${id}`),
  toggleCarouselActive: (id) => api.patch(`/api/hero-carousel/${id}/toggle-active`),
  updateCarouselOrder: (items) => api.post('/api/hero-carousel/update-order', items)
};

// Coupon endpoints
const couponEndpoints = {
  getCoupons: () => api.get('/api/coupons'),
  createCoupon: (data) => api.post('/api/coupons', data),
  updateCoupon: (id, data) => api.put(`/api/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/api/coupons/${id}`),
};

const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    console.log('Attempting admin login with:', credentials.email);
    const response = await api.post('/api/admin/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin_logged_in', 'true');
      console.log('Admin login successful, token stored');
    }
    return response;
  },
  
  // Update admin credentials
  updateAdminCredentials: async (credentials) => {
    console.log('Attempting to update admin credentials');
    const response = await api.put('/api/admin/auth/update-credentials', credentials);
    return response;
  },
  
  // Token verification
  verifyToken: async () => {
    try {
      const response = await api.get('/api/admin/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_logged_in');
    console.log('Admin logged out, tokens cleared');
  },
  
  // Products endpoints
  getProducts: async () => {
    const response = await api.get('/api/shop');
    console.log('API getProducts response:', response.data);
    return response;
  },
  getFeaturedProducts: async () => {
    const response = await api.get('/api/shop/section/featured');
    console.log('API getFeaturedProducts response:', response.data);
    return response;
  },
  getBestSellerProducts: async () => {
    const response = await api.get('/api/shop/section/bestsellers');
    console.log('API getBestSellerProducts response:', response.data);
    return response;
  },
  getMostLovedProducts: async () => {
    const response = await api.get('/api/shop/section/mostloved');
    console.log('API getMostLovedProducts response:', response.data);
    return response;
  },
  getProductsBySection: async (section) => {
    const response = await api.get(`/api/shop/section/${section}`);
    console.log(`API getProductsBySection(${section}) response:`, response.data);
    return response;
  },
  getProduct: async (id) => {
    return api.get(`/api/shop/${id}`);
  },
  createProduct: async (formData) => {
    return uploadWithFiles('/api/shop/upload', formData);
  },
  updateProduct: async (id, formData) => {
    return updateWithFiles(`/api/shop/${id}`, formData);
  },
  updateProductSections: async (id, sections) => {
    return api.patch(`/api/shop/${id}/sections`, sections);
  },
  deleteProduct: async (id) => {
    return api.delete(`/api/shop/${id}`);
  },
  
  // Categories endpoints
  getCategories: () => api.get('/api/categories'),
  getCategory: (id) => api.get(`/api/categories/${id}`),
  createCategory: (formData) => {
    return formData instanceof FormData
      ? uploadWithFiles('/api/categories', formData)
      : api.post('/api/categories', formData);
  },
  updateCategory: (id, formData) => {
    return formData instanceof FormData
      ? updateWithFiles(`/api/categories/${id}`, formData)
      : api.put(`/api/categories/${id}`, formData);
  },
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
  
  // Orders endpoints
  getOrders: () => api.get('/api/orders/json'),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
  updateOrderStatus: (id, orderStatus) => api.put(`/api/orders/${id}/status`, { orderStatus }),
  
  // Sellers endpoints
  getSellers: () => api.get('/api/seller/all'),
  
  // Hero Carousel endpoints
  ...heroCarouselEndpoints,
  
  // Coupon endpoints
  ...couponEndpoints,
  
  // Settings endpoints
  getSettings: () => api.get('/api/settings'),
  getSetting: (key) => api.get(`/api/settings/${key}`),
  updateSetting: (key, data) => api.put(`/api/settings/${key}`, data),
  createSetting: (data) => api.post('/api/settings', data),
  deleteSetting: (key) => api.delete(`/api/settings/${key}`),
  
  // Review endpoints
  getProductReviews: async (productId) => {
    return api.get(`/api/reviews/product/${productId}`);
  },
  createReview: async (reviewData) => {
    return api.post('/api/reviews', reviewData);
  },
  updateReview: async (reviewId, reviewData) => {
    return api.put(`/api/reviews/${reviewId}`, reviewData);
  },
  deleteReview: async (reviewId) => {
    return api.delete(`/api/reviews/${reviewId}`);
  },
};

export default apiService; 