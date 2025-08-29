// Configuration file for API endpoints and environment settings
// Change this single URL to update all API calls across the admin panel

const config = {
  // API Configuration
  API_BASE_URL:'http://127.0.0.1:8000/',
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
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
      AUTH: `${this.API_BASE_URL}${this.API_ENDPOINTS.AUTH}`,
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
  
  // Utility function to fix image URLs
  fixImageUrl: (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Remove any leading slashes
    const cleanPath = imagePath.replace(/^\/+/, '');
    
    // If it's a path to a backend data file
    if (cleanPath.includes('abc.com') || !cleanPath.includes('/')) {
      // Always use /pawnbackend/data/ prefix for backend files
      const basePath = cleanPath.startsWith('pawnbackend/data/') ? '' : 'pawnbackend/data/';
      return `${config.API_BASE_URL}/${basePath}${cleanPath}`;
    }
    
    // By default, assume it's a frontend public asset
    return `/${cleanPath}`;
  },
  
  // Environment settings
  ENVIRONMENT: {
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  },
  
  // CORS settings
  CORS: {
    WITH_CREDENTIALS: true,
    HEADERS: {
      'Content-Type': 'application/json',
    },
  },

  // Authentication Configuration
  AUTH: {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY: '1d',
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
    INVALID_TOKEN: 'Invalid or expired token',
    SERVER_ERROR: 'An error occurred on the server',
    VALIDATION_ERROR: 'Please check your input and try again',
    FILE_TOO_LARGE: 'File size is too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    REQUIRED_FIELDS: 'Please fill in all required fields',
  },
};

export default config; 