// Configuration file for API endpoints and environment settings
// Change this single URL to update all API calls across the admin panel

const config = {
  // API Configuration
  API_BASE_URL:'https://pawnbackend-xmqa.onrender.com',
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    CART: '/api/cart',
    SHOP: '/api/shop',
    ORDERS: '/api/orders',
    CATEGORIES: '/api/categories',
    FEATURED_PRODUCTS: '/api/featured-products',
    BESTSELLER: '/api/bestseller',
    LOVED: '/api/loved',
    HERO_CAROUSEL: '/api/hero-carousel',
    SELLER: '/api/seller',
    DATA: '/api/data',
    DATA_PAGE: '/api/data-page',
    WITHDRAWAL: '/api/withdrawal',
    COMMISSION: '/api/commission'
  },
  
  // Full API URLs (constructed from base URL and endpoints)
  get API_URLS() {
    return {
      AUTH: `${this.API_BASE_URL}${this.API_ENDPOINTS.AUTH}`,
      CART: `${this.API_BASE_URL}${this.API_ENDPOINTS.CART}`,
      SHOP: `${this.API_BASE_URL}${this.API_ENDPOINTS.SHOP}`,
      ORDERS: `${this.API_BASE_URL}${this.API_ENDPOINTS.ORDERS}`,
      CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.CATEGORIES}`,
      FEATURED_PRODUCTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.FEATURED_PRODUCTS}`,
      BESTSELLER: `${this.API_BASE_URL}${this.API_ENDPOINTS.BESTSELLER}`,
      LOVED: `${this.API_BASE_URL}${this.API_ENDPOINTS.LOVED}`,
      HERO_CAROUSEL: `${this.API_BASE_URL}${this.API_ENDPOINTS.HERO_CAROUSEL}`,
      SELLER: `${this.API_BASE_URL}${this.API_ENDPOINTS.SELLER}`,
      DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA}`,
      DATA_PAGE: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA_PAGE}`,
      WITHDRAWAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.WITHDRAWAL}`,
      COMMISSION: `${this.API_BASE_URL}${this.API_ENDPOINTS.COMMISSION}`
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