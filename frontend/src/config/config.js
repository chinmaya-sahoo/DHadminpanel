// Configuration file for API endpoints and environment settings
// Change this single URL to update all API calls across the admin panel

const config = {
  // API Configuration
  // API_BASE_URL: 'http://127.0.0.1:3000/daliyhisab/server',
  API_BASE_URL: 'https://appzetoapp.com/daliyhisab/server',
  // API_BASE_URL: 'http://localhost:3000/daliyhisab/server',

  // Special Subscription Plan Constants (these are fixed and cannot change)
  SPECIAL_PLANS: {
    FREE_TRIAL: 0,
    REFERRAL_REWARD: 1
  },

  // Account Type Constants
  ACCOUNT_TYPES: {
    PERSONAL: 1,
    BUSINESS: 2
  },

  // Account Type Labels
  ACCOUNT_TYPE_LABELS: {
    1: 'Personal',
    2: 'Business'
  },

  // Account Type Colors for UI
  ACCOUNT_TYPE_COLORS: {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800'
  },

  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    LOGIN: '/admin_login',          // Updated to match backend endpoint
    VERIFY_TOKEN: '/admin_dashboard',  // Added
    DASHBOARD: '/admin/dashboard',  // Dashboard data endpoint
    LOGOUT: '/api/auth/logout',        // Added
    USER: '/api/user',
    GET_ALL_USERS_WITH_ACCOUNTS: '/admin/get_all_users_with_accounts',
    BUSINESS: '/api/business',
    REPORT: '/api/report',
    INCOME: '/api/income',
    EXPENSE: '/api/expense',
    UDHARI: '/api/udhari',
    CONTENT: '/api/content',
    SUBSCRIPTION: '/api/subscription',
    STOCK: '/api/stock',
    DATA: '/api/data',
    DATA_PAGE: '/api/data-page',
    // Subscription Plan Management
    CREATE_SUBSCRIPTION_PLAN: '/admin/create_subscription_plan',
    UPDATE_SUBSCRIPTION_PLAN: '/admin/update_subscription_plan',
    DELETE_SUBSCRIPTION_PLAN: '/admin/delete_subscription_plan',
    GET_SUBSCRIPTION_PLANS: '/admin/get_all_subscription_plans?include_deleted=false',
    // Payment History Management
    GET_ALL_PAYMENT_HISTORY: '/admin/get_all_payment_history',
    // User Subscription History Management
    GET_ALL_USERS_SUBSCRIPTION_HISTORY: '/admin/get_all_users_subscription_history',
    // Admin Category Management
    CREATE_ADMIN_CATEGORY: '/admin/create_category',
    UPDATE_ADMIN_CATEGORY: '/admin/update_category',
    DELETE_ADMIN_CATEGORY: '/admin/delete_category',
    GET_ALL_ADMIN_CATEGORIES: '/admin/get_all_categories',

    // Support Ticket Management
    GET_ALL_SUPPORT_TICKETS: '/admin/get_all_support_tickets',
    UPDATE_SUPPORT_TICKET_STATUS: '/admin/update_support_ticket_status',
    DELETE_SUPPORT_TICKET: '/admin/delete_support_ticket',
    GET_SUPPORT_TICKET_DETAILS: '/admin/get_support_ticket_details',
    GET_SUPPORT_TICKET_STATS: '/admin/get_support_ticket_stats',

    // Notification Management
    CREATE_NOTIFICATION_CAMPAIGN: '/admin/create_notification_campaign',
    UPDATE_NOTIFICATION_CAMPAIGN: '/admin/update_notification_campaign',
    DELETE_NOTIFICATION_CAMPAIGN: '/admin/delete_notification_campaign',
    SEND_NOTIFICATION_CAMPAIGN: '/admin/send_notification_campaign',
    GET_ALL_NOTIFICATION_CAMPAIGNS: '/admin/get_all_notification_campaigns',
    GET_NOTIFICATION_PERFORMANCE_STATS: '/admin/get_notification_performance_stats',
    GET_NOTIFICATION_SYSTEM_STATS: '/admin/get_notification_system_stats',

    // Content Management
    CREATE_BANNER: '/admin/create_banner',
    GET_ALL_BANNERS: '/admin/get_all_banners',
    UPDATE_BANNER: '/admin/update_banner',
    DELETE_BANNER: '/admin/delete_banner',
    CREATE_TUTORIAL: '/admin/create_tutorial',
    GET_ALL_TUTORIALS: '/admin/get_all_tutorials',
    UPDATE_TUTORIAL: '/admin/update_tutorial',
    DELETE_TUTORIAL: '/admin/delete_tutorial',
    GET_TUTORIAL_ANALYTICS: '/admin/get_tutorial_analytics',
    TRACK_TUTORIAL_VIEW: '/track_tutorial_view',

    // Terms & Conditions Management
    GET_ALL_POLICY_CATEGORIES: '/admin/get_all_policy_categories',
    GET_POLICY_POINTS: '/admin/get_policy_points',
    CREATE_POLICY_POINT: '/admin/create_policy_point',
    UPDATE_POLICY_POINT: '/admin/update_policy_point',
    DELETE_POLICY_POINT: '/admin/delete_policy_point',
    REORDER_POLICY_POINTS: '/admin/reorder_policy_points',
    CREATE_POLICY_VERSION: '/admin/create_policy_version',
    GET_POLICY_VERSION_HISTORY: '/admin/get_policy_version_history',
    GET_POLICY_CONTENT: '/get_policy_content',
    ACCEPT_POLICY_VERSION: '/accept_policy_version',
    GET_USER_POLICY_ACCEPTANCE: '/get_user_policy_acceptance',

    // Refer & Earn System
    GET_REFERRAL_CODE: '/get_referral_code',
    GET_REFERRAL_STATS: '/get_referral_stats',
    CHECK_FREE_TRIAL_ELIGIBILITY: '/check_free_trial_eligibility',
    ACTIVATE_FREE_TRIAL: '/activate_free_trial',
    APPLY_REFERRAL_CODE: '/apply_referral_code',
    GET_REFERRAL_ANALYTICS: '/admin/get_referral_analytics',
    ACTIVATE_PENDING_REWARDS: '/admin/activate_pending_rewards',

    // Comprehensive Admin Statistics
    GET_COMPREHENSIVE_STATS: '/admin/comprehensive_stats',

    // Manual Upgrade System
    GET_AVAILABLE_PLANS: '/admin/get_available_plans',
    SEARCH_USER_BY_MOBILE: '/admin/search_user_by_mobile',
    SEARCH_USERS_AUTOCOMPLETE: '/admin/search_users_autocomplete',
    MANUAL_UPGRADE_USER: '/admin/manual_upgrade_user',
    GET_MANUAL_UPGRADE_HISTORY: '/admin/get_manual_upgrade_history',
    GET_MANUAL_UPGRADE_STATS: '/admin/get_manual_upgrade_stats',

    // Admin Report System
    GET_USER_GROWTH_REPORT: '/admin/get_user_growth_report',
    GET_USER_ACTIVITY_REPORT: '/admin/get_user_activity_report',
    GET_SUBSCRIPTION_REVENUE_REPORT: '/admin/get_subscription_revenue_report',
    GET_BUSINESS_HEALTH_REPORT: '/admin/get_business_health_report',
    GET_INCOME_EXPENSE_SUMMARY: '/admin/get_income_expense_summary',
    GET_EXPENSE_BREAKDOWN: '/admin/get_expense_breakdown',
    GET_INCOME_BREAKDOWN: '/admin/get_income_breakdown',
    GET_COMPREHENSIVE_REPORT: '/admin/get_comprehensive_report',
    EXPORT_REPORT_DATA: '/admin/export_report_data',

    GET_CONTACT_US_DATA: '/admin/get_contact_us_data',
    CREATE_CONTACT_CONFIG: '/admin/create_contact_config',
    GET_ALL_CONTACT_CONFIGS: '/admin/get_all_contact_configs',
    UPDATE_CONTACT_CONFIG: '/admin/update_contact_config',
    DELETE_CONTACT_CONFIG: '/admin/delete_contact_config',
    GET_ALL_APP_DOWNLOAD_LINKS: '/admin/get_all_app_download_links',
    CREATE_APP_DOWNLOAD_LINK: '/admin/create_app_download_link',
    UPDATE_APP_DOWNLOAD_LINK: '/admin/update_app_download_link',
    DELETE_APP_DOWNLOAD_LINK: '/admin/delete_app_download_link',

    SUBMIT_APP_RATING: '/rate_app',
    GET_ALL_APP_RATINGS: '/admin/get_app_rating_feedback',
    GET_APP_RATING_STATS: '/admin/get_app_rating_stats',
    GET_APP_RATING_HISTORY: '/admin/get_app_rating_history',
    UPDATE_APP_RATING: '/admin/update_app_rating',
    DELETE_APP_RATING: '/admin/delete_app_rating',
    GET_APP_RATING_ANALYTICS: '/admin/get_app_rating_analytics',
    GET_USER_DETAILS: '/admin/get_user_details',
    GET_DETAILED_USER_INFO: '/admin/get_detailed_user_info',
    SUSPEND_USER: '/admin/suspend_user',
    UNSUSPEND_USER: '/admin/unsuspend_user',
    MANAGE_USER_STATUS: '/admin/manage_user_status',

    // FAQ System Endpoints
    GET_FAQ_CATEGORIES: '/get_faq_categories',
    GET_FAQS_BY_CATEGORY: '/get_faqs_by_category',
    GET_FAQ_BY_ID: '/get_faq_by_id',
    SEARCH_FAQS: '/search_faqs',
    GET_ALL_FAQ_CATEGORIES: '/admin/get_all_faq_categories',
    GET_ALL_FAQS: '/admin/get_all_faqs',
    CREATE_FAQ_CATEGORY: '/admin/create_faq_category',
    CREATE_FAQ_ITEM: '/admin/create_faq_item',
    UPDATE_FAQ_ITEM: '/admin/update_faq_item',
    DELETE_FAQ_ITEM: '/admin/delete_faq_item',
    GET_FAQ_ANALYTICS: '/admin/get_faq_analytics',

    // Performance Tracking System Endpoints
    CALCULATE_PERFORMANCE_SCORE: '/calculate_performance_score',
    GET_USER_PERFORMANCE_SCORE: '/get_user_performance_score',
    GET_USER_PERFORMANCE_HISTORY: '/get_user_performance_history',
    GET_USER_PERFORMANCE_ALERTS: '/get_user_performance_alerts',
    GET_OVERALL_PERFORMANCE_STATS: '/admin/get_overall_performance_stats',
    GET_USER_PERFORMANCE_REPORT: '/admin/get_user_performance_report',
    GET_PERFORMANCE_COMPARISON: '/admin/get_performance_comparison',

    // Performance Visualization System Endpoints
    GET_PERFORMANCE_BAR_GRAPH_DATA: '/admin/get_performance_bar_graph_data',
    GET_PERFORMANCE_TRENDS: '/admin/get_performance_trends',
    GET_USER_PERFORMANCE_COMPARISON: '/admin/get_user_performance_comparison',
    GET_FEATURE_USAGE_ANALYTICS: '/admin/feature_usage_analytics',
    GET_FEATURE_USAGE_TRENDS: '/admin/feature_usage_trends',
  },

  // Full API URLs (constructed from base URL and endpoints)
  get API_URLS() {
    return {
      AUTH: `${this.API_BASE_URL}${this.API_ENDPOINTS.AUTH}`,
      LOGIN: `${this.API_BASE_URL}${this.API_ENDPOINTS.LOGIN}`,
      VERIFY_TOKEN: `${this.API_BASE_URL}${this.API_ENDPOINTS.VERIFY_TOKEN}`,
      DASHBOARD: `${this.API_BASE_URL}${this.API_ENDPOINTS.DASHBOARD}`,
      LOGOUT: `${this.API_BASE_URL}${this.API_ENDPOINTS.LOGOUT}`,
      USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.USER}`,
      GET_ALL_USERS_WITH_ACCOUNTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_USERS_WITH_ACCOUNTS}`,
      BUSINESS: `${this.API_BASE_URL}${this.API_ENDPOINTS.BUSINESS}`,
      REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.REPORT}`,
      INCOME: `${this.API_BASE_URL}${this.API_ENDPOINTS.INCOME}`,
      EXPENSE: `${this.API_BASE_URL}${this.API_ENDPOINTS.EXPENSE}`,
      UDHARI: `${this.API_BASE_URL}${this.API_ENDPOINTS.UDHARI}`,
      CONTENT: `${this.API_BASE_URL}${this.API_ENDPOINTS.CONTENT}`,
      SUBSCRIPTION: `${this.API_BASE_URL}${this.API_ENDPOINTS.SUBSCRIPTION}`,
      STOCK: `${this.API_BASE_URL}${this.API_ENDPOINTS.STOCK}`,
      DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA}`,
      DATA_PAGE: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA_PAGE}`,
      // Subscription Plan Management URLs
      CREATE_SUBSCRIPTION_PLAN: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_SUBSCRIPTION_PLAN}`,
      UPDATE_SUBSCRIPTION_PLAN: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_SUBSCRIPTION_PLAN}`,
      DELETE_SUBSCRIPTION_PLAN: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_SUBSCRIPTION_PLAN}`,
      GET_SUBSCRIPTION_PLANS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUBSCRIPTION_PLANS}`,
      // Payment History Management URLs
      GET_ALL_PAYMENT_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_PAYMENT_HISTORY}`,
      // User Subscription History Management URLs
      GET_ALL_USERS_SUBSCRIPTION_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_USERS_SUBSCRIPTION_HISTORY}`,
      // Admin Category Management URLs
      CREATE_ADMIN_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_ADMIN_CATEGORY}`,
      UPDATE_ADMIN_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_ADMIN_CATEGORY}`,
      DELETE_ADMIN_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_ADMIN_CATEGORY}`,
      GET_ALL_ADMIN_CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_ADMIN_CATEGORIES}`,

      // Support Ticket Management URLs
      GET_ALL_SUPPORT_TICKETS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS}`,
      UPDATE_SUPPORT_TICKET_STATUS: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_SUPPORT_TICKET_STATUS}`,
      DELETE_SUPPORT_TICKET: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_SUPPORT_TICKET}`,
      GET_SUPPORT_TICKET_DETAILS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUPPORT_TICKET_DETAILS}`,
      GET_SUPPORT_TICKET_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUPPORT_TICKET_STATS}`,

      // Notification Management URLs
      CREATE_NOTIFICATION_CAMPAIGN: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_NOTIFICATION_CAMPAIGN}`,
      UPDATE_NOTIFICATION_CAMPAIGN: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_NOTIFICATION_CAMPAIGN}`,
      DELETE_NOTIFICATION_CAMPAIGN: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_NOTIFICATION_CAMPAIGN}`,
      SEND_NOTIFICATION_CAMPAIGN: `${this.API_BASE_URL}${this.API_ENDPOINTS.SEND_NOTIFICATION_CAMPAIGN}`,
      GET_ALL_NOTIFICATION_CAMPAIGNS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_NOTIFICATION_CAMPAIGNS}`,
      GET_NOTIFICATION_PERFORMANCE_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_NOTIFICATION_PERFORMANCE_STATS}`,
      GET_NOTIFICATION_SYSTEM_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_NOTIFICATION_SYSTEM_STATS}`,

      // Content Management URLs
      CREATE_BANNER: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_BANNER}`,
      GET_ALL_BANNERS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_BANNERS}`,
      UPDATE_BANNER: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_BANNER}`,
      DELETE_BANNER: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_BANNER}`,
      CREATE_TUTORIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_TUTORIAL}`,
      GET_ALL_TUTORIALS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_TUTORIALS}`,
      UPDATE_TUTORIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_TUTORIAL}`,
      DELETE_TUTORIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_TUTORIAL}`,
      GET_TUTORIAL_ANALYTICS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_TUTORIAL_ANALYTICS}`,
      TRACK_TUTORIAL_VIEW: `${this.API_BASE_URL}${this.API_ENDPOINTS.TRACK_TUTORIAL_VIEW}`,

      // Terms & Conditions Management URLs
      GET_ALL_POLICY_CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_POLICY_CATEGORIES}`,
      GET_POLICY_POINTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_POLICY_POINTS}`,
      CREATE_POLICY_POINT: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_POLICY_POINT}`,
      UPDATE_POLICY_POINT: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_POLICY_POINT}`,
      DELETE_POLICY_POINT: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_POLICY_POINT}`,
      REORDER_POLICY_POINTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.REORDER_POLICY_POINTS}`,
      CREATE_POLICY_VERSION: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_POLICY_VERSION}`,
      GET_POLICY_VERSION_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_POLICY_VERSION_HISTORY}`,
      GET_POLICY_CONTENT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_POLICY_CONTENT}`,
      ACCEPT_POLICY_VERSION: `${this.API_BASE_URL}${this.API_ENDPOINTS.ACCEPT_POLICY_VERSION}`,
      GET_USER_POLICY_ACCEPTANCE: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_POLICY_ACCEPTANCE}`,

      // Refer & Earn System URLs
      GET_REFERRAL_CODE: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_REFERRAL_CODE}`,
      GET_REFERRAL_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_REFERRAL_STATS}`,
      CHECK_FREE_TRIAL_ELIGIBILITY: `${this.API_BASE_URL}${this.API_ENDPOINTS.CHECK_FREE_TRIAL_ELIGIBILITY}`,
      ACTIVATE_FREE_TRIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.ACTIVATE_FREE_TRIAL}`,
      APPLY_REFERRAL_CODE: `${this.API_BASE_URL}${this.API_ENDPOINTS.APPLY_REFERRAL_CODE}`,
      GET_REFERRAL_ANALYTICS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_REFERRAL_ANALYTICS}`,
      ACTIVATE_PENDING_REWARDS: `${this.API_BASE_URL}${this.API_ENDPOINTS.ACTIVATE_PENDING_REWARDS}`,

      // Manual Upgrade System URLs
      GET_AVAILABLE_PLANS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_AVAILABLE_PLANS}`,
      SEARCH_USER_BY_MOBILE: `${this.API_BASE_URL}${this.API_ENDPOINTS.SEARCH_USER_BY_MOBILE}`,
      SEARCH_USERS_AUTOCOMPLETE: `${this.API_BASE_URL}${this.API_ENDPOINTS.SEARCH_USERS_AUTOCOMPLETE}`,
      MANUAL_UPGRADE_USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.MANUAL_UPGRADE_USER}`,
      GET_MANUAL_UPGRADE_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_MANUAL_UPGRADE_HISTORY}`,
      GET_MANUAL_UPGRADE_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_MANUAL_UPGRADE_STATS}`,

      // Admin Report System URLs
      GET_USER_GROWTH_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_GROWTH_REPORT}`,
      GET_USER_ACTIVITY_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_ACTIVITY_REPORT}`,
      GET_SUBSCRIPTION_REVENUE_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUBSCRIPTION_REVENUE_REPORT}`,
      GET_BUSINESS_HEALTH_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_BUSINESS_HEALTH_REPORT}`,
      GET_INCOME_EXPENSE_SUMMARY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_INCOME_EXPENSE_SUMMARY}`,
      GET_EXPENSE_BREAKDOWN: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_EXPENSE_BREAKDOWN}`,
      GET_INCOME_BREAKDOWN: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_INCOME_BREAKDOWN}`,
      GET_COMPREHENSIVE_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_COMPREHENSIVE_REPORT}`,
      EXPORT_REPORT_DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.EXPORT_REPORT_DATA}`,

      // Contact Us Management URLs
      CREATE_CONTACT_CONFIG: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_CONTACT_CONFIG}`,
      GET_CONTACT_US_DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_CONTACT_US_DATA}`,
      GET_ALL_CONTACT_CONFIGS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_CONTACT_CONFIGS}`,
      UPDATE_CONTACT_CONFIG: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_CONTACT_CONFIG}`,
      DELETE_CONTACT_CONFIG: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_CONTACT_CONFIG}`,
      GET_ALL_APP_DOWNLOAD_LINKS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_APP_DOWNLOAD_LINKS}`,
      CREATE_APP_DOWNLOAD_LINK: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_APP_DOWNLOAD_LINK}`,
      UPDATE_APP_DOWNLOAD_LINK: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_APP_DOWNLOAD_LINK}`,
      DELETE_APP_DOWNLOAD_LINK: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_APP_DOWNLOAD_LINK}`,

      // App Rating System URLs
      SUBMIT_APP_RATING: `${this.API_BASE_URL}${this.API_ENDPOINTS.SUBMIT_APP_RATING}`,
      GET_ALL_APP_RATINGS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_APP_RATINGS}`,
      GET_APP_RATING_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_APP_RATING_STATS}`,
      GET_APP_RATING_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_APP_RATING_HISTORY}`,
      UPDATE_APP_RATING: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_APP_RATING}`,
      DELETE_APP_RATING: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_APP_RATING}`,
      GET_APP_RATING_ANALYTICS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_APP_RATING_ANALYTICS}`,
      GET_USER_DETAILS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_DETAILS}`,
      GET_DETAILED_USER_INFO: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_DETAILED_USER_INFO}`,
      SUSPEND_USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.SUSPEND_USER}`,
      UNSUSPEND_USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.UNSUSPEND_USER}`,
      MANAGE_USER_STATUS: `${this.API_BASE_URL}${this.API_ENDPOINTS.MANAGE_USER_STATUS}`,

      // FAQ System URLs
      GET_FAQ_CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_FAQ_CATEGORIES}`,
      GET_FAQS_BY_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_FAQS_BY_CATEGORY}`,
      GET_FAQ_BY_ID: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_FAQ_BY_ID}`,
      SEARCH_FAQS: `${this.API_BASE_URL}${this.API_ENDPOINTS.SEARCH_FAQS}`,
      GET_ALL_FAQ_CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_FAQ_CATEGORIES}`,
      GET_ALL_FAQS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_FAQS}`,
      CREATE_FAQ_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_FAQ_CATEGORY}`,
      CREATE_FAQ_ITEM: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_FAQ_ITEM}`,
      UPDATE_FAQ_ITEM: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_FAQ_ITEM}`,
      DELETE_FAQ_ITEM: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_FAQ_ITEM}`,
      GET_FAQ_ANALYTICS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_FAQ_ANALYTICS}`,

      // Performance Tracking System URLs
      CALCULATE_PERFORMANCE_SCORE: `${this.API_BASE_URL}${this.API_ENDPOINTS.CALCULATE_PERFORMANCE_SCORE}`,
      GET_USER_PERFORMANCE_SCORE: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_PERFORMANCE_SCORE}`,
      GET_USER_PERFORMANCE_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_PERFORMANCE_HISTORY}`,
      GET_USER_PERFORMANCE_ALERTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_PERFORMANCE_ALERTS}`,
      GET_OVERALL_PERFORMANCE_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_OVERALL_PERFORMANCE_STATS}`,
      GET_USER_PERFORMANCE_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_PERFORMANCE_REPORT}`,
      GET_PERFORMANCE_COMPARISON: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_PERFORMANCE_COMPARISON}`,

      // Performance Visualization System URLs
      GET_PERFORMANCE_BAR_GRAPH_DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_PERFORMANCE_BAR_GRAPH_DATA}`,
      GET_PERFORMANCE_TRENDS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_PERFORMANCE_TRENDS}`,
      GET_USER_PERFORMANCE_COMPARISON: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_PERFORMANCE_COMPARISON}`,
    };
  },

  // Utility function to fix image URLs
  fixImageUrl: (imagePath) => {
    if (!imagePath) return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/^\/+/, '');

    if (cleanPath.includes('abc.com') || !cleanPath.includes('/')) {
      const basePath = cleanPath.startsWith('pawnbackend/data/') ? '' : 'pawnbackend/data/';
      return `${config.API_BASE_URL}/${basePath}${cleanPath}`;
    }

    return `/${cleanPath}`;
  },

  // Helper functions for account types
  getAccountTypeLabel: (accountType) => {
    return config.ACCOUNT_TYPE_LABELS[accountType] || 'Unknown';
  },

  getAccountTypeColor: (accountType) => {
    return config.ACCOUNT_TYPE_COLORS[accountType] || 'bg-gray-100 text-gray-800';
  },

  getAccountTypeOptions: () => {
    return Object.entries(config.ACCOUNT_TYPE_LABELS).map(([value, label]) => ({
      value: parseInt(value),
      label: label
    }));
  },

  // Environment settings
  ENVIRONMENT: {
    IS_PRODUCTION: import.meta.env.MODE === 'production',
    IS_DEVELOPMENT: import.meta.env.MODE === 'development',
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
    ADMIN_FLAG: 'admin_logged_in',        // Added
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY: '1d',
    STORAGE_TYPE: 'localStorage',         // Added
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
    INVALID_CREDENTIALS: 'Invalid email or password',
    SERVER_ERROR: 'An error occurred on the server',
    VALIDATION_ERROR: 'Please check your input and try again',
    FILE_TOO_LARGE: 'File size is too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    REQUIRED_FIELDS: 'Please fill in all required fields',
    NETWORK_ERROR: 'Network connection error. Please try again.',
  },
};

export default config;