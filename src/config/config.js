// Configuration file for API endpoints and environment settings

const config = {
  // API Base URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,

  // API endpoints
  API_ENDPOINTS: {
    PROFILE: '/api/settings/profile/', // used for login check
    USER: '/api/user',
    BUSINESS: '/api/business',
    REPORT: '/api/report',
    INCOME: '/api/income',
    EXPENSE: '/api/expense',
    UDHARI: '/api/udhari',
    CONTENT: '/api/content',
    NOTIFICATION: '/api/notification',
    SUBSCRIPTION: '/api/subscription',
    STOCK: '/api/stock',
    DATA: '/api/data',
    DATA_PAGE: '/api/data-page',
  },

  // Full API URLs (constructed from base URL and endpoints)
  get API_URLS() {
    return {
      PROFILE: `${this.API_BASE_URL}${this.API_ENDPOINTS.PROFILE}`,
      USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.USER}`,
      BUSINESS: `${this.API_BASE_URL}${this.API_ENDPOINTS.BUSINESS}`,
      REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.REPORT}`,
      INCOME: `${this.API_BASE_URL}${this.API_ENDPOINTS.INCOME}`,
      EXPENSE: `${this.API_BASE_URL}${this.API_ENDPOINTS.EXPENSE}`,
      UDHARI: `${this.API_BASE_URL}${this.API_ENDPOINTS.UDHARI}`,
      CONTENT: `${this.API_BASE_URL}${this.API_ENDPOINTS.CONTENT}`,
      NOTIFICATION: `${this.API_BASE_URL}${this.API_ENDPOINTS.NOTIFICATION}`,
      SUBSCRIPTION: `${this.API_BASE_URL}${this.API_ENDPOINTS.SUBSCRIPTION}`,
      STOCK: `${this.API_BASE_URL}${this.API_ENDPOINTS.STOCK}`,
      DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA}`,
      DATA_PAGE: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA_PAGE}`,
    };
  },

  // Environment settings
  ENVIRONMENT: {
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  },

  // CORS settings
  CORS: {
    WITH_CREDENTIALS: false, // not needed for BasicAuth
    HEADERS: {
      'Content-Type': 'application/json',
    },
  },

  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_PRODUCT: 4,
  },

  // Validation Configuration
  VALIDATION: {
    MIN_PRICE: 0,
    MAX_DESCRIPTION_LENGTH: 1000,
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
  },

  // Error Messages
  ERRORS: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_CREDENTIALS: 'Invalid email or password',
    SERVER_ERROR: 'An error occurred on the server',
    NETWORK_ERROR: 'Network connection error. Please try again.',
  },
};

export default config;