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
    console.log("Setting token:", token); // Debug log
    localStorage.setItem(config.AUTH.TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  },

  clearToken: () => {
    localStorage.removeItem(config.AUTH.TOKEN_KEY);
    localStorage.removeItem(config.AUTH.ADMIN_FLAG);
    localStorage.removeItem('admin_user_id');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => {
    const token = tokenManager.getToken();
    const adminFlag = localStorage.getItem(config.AUTH.ADMIN_FLAG) === "true";
    console.log("Auth check - Token:", !!token, "AdminFlag:", adminFlag); // Debug log
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
      // Send email and password in request body
      const response = await api.post(
        config.API_ENDPOINTS.LOGIN,
        {
          email: email,
          password: password
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.data && response.data.success && response.data.data && response.data.data.token) {
        // Set token and admin flag
        tokenManager.setToken(response.data.data.token);
        localStorage.setItem(config.AUTH.ADMIN_FLAG, "true");

        // Store admin user ID if available
        if (response.data.data.user_id) {
          localStorage.setItem('admin_user_id', response.data.data.user_id);
        }

        return {
          success: true,
          data: response.data.data,
          message: response.data.msg && response.data.msg[0] ? response.data.msg[0] : "Login successful"
        };
      }

      throw new Error(config.ERRORS.INVALID_CREDENTIALS);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(config.ERRORS.INVALID_CREDENTIALS);
      } else if (error.response?.status === 400) {
        // Handle validation errors
        const errorData = error.response.data;
        if (errorData && errorData.errors && errorData.errors.length > 0) {
          throw new Error(errorData.errors[0]); // Return first validation error
        } else if (errorData && errorData.msg && errorData.msg.length > 0) {
          throw new Error(errorData.msg[0]); // Return first message
        }
        throw new Error(config.ERRORS.VALIDATION_ERROR);
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

  // Get all users with their accounts
  getAllUsersWithAccounts: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_USERS_WITH_ACCOUNTS);
    return response.data;
  },

  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.get(config.API_ENDPOINTS.DASHBOARD);
    return response.data;
  },

  // Subscription Plan Management
  getSubscriptionPlans: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUBSCRIPTION_PLANS);
    return response.data;
  },

  createSubscriptionPlan: async (planData) => {
    const response = await api.post(config.API_ENDPOINTS.CREATE_SUBSCRIPTION_PLAN, planData);
    return response.data;
  },

  updateSubscriptionPlan: async (planData) => {
    const response = await api.put(config.API_ENDPOINTS.UPDATE_SUBSCRIPTION_PLAN, planData);
    return response.data;
  },

  deleteSubscriptionPlan: async (subscriptionId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_SUBSCRIPTION_PLAN, {
      data: { subscription_id: subscriptionId }
    });
    return response.data;
  },

  // Payment History Management
  getPaymentHistory: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_PAYMENT_HISTORY, { params });
    return response.data;
  },

  // User Subscription History Management
  getUsersSubscriptionHistory: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_USERS_SUBSCRIPTION_HISTORY, { params });
    return response.data;
  },

  // Admin Category Management
  getAllAdminCategories: async (params = {}) => {
    try {
      console.log('Fetching admin categories with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_ADMIN_CATEGORIES, { params });
      console.log('Admin categories API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin categories:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  createAdminCategory: async (categoryData, iconFile = null) => {
    try {
      const formData = new FormData();
      formData.append('category_name', categoryData.category_name);
      formData.append('category_type', categoryData.category_type.toString());
      formData.append('account_type', (categoryData.account_type || 1).toString());
      formData.append('deletable', (categoryData.deletable || 0).toString());

      // Add icon file - either uploaded file or converted Material Icon PNG
      if (iconFile) {
        formData.append('icon', iconFile);
      }

      console.log('Creating admin category with data:', {
        category_name: categoryData.category_name,
        category_type: categoryData.category_type,
        account_type: categoryData.account_type,
        deletable: categoryData.deletable,
        hasIcon: !!iconFile
      });

      const response = await api.post(config.API_ENDPOINTS.CREATE_ADMIN_CATEGORY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating admin category:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  updateAdminCategory: async (categoryData, iconFile = null) => {
    const formData = new FormData();
    formData.append('category_id', categoryData.category_id.toString());
    formData.append('category_name', categoryData.category_name);
    formData.append('category_type', categoryData.category_type.toString());
    formData.append('account_type', (categoryData.account_type || 1).toString());
    formData.append('deletable', (categoryData.deletable || 0).toString());

    // Add icon file - either uploaded file or converted Material Icon PNG
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    const response = await api.put(config.API_ENDPOINTS.UPDATE_ADMIN_CATEGORY, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAdminCategory: async (categoryId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_ADMIN_CATEGORY, {
      data: { category_id: categoryId }
    });
    return response.data;
  },

  // Support Ticket Management
  getAllSupportTickets: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS, { params });
    return response.data;
  },

  updateSupportTicketStatus: async (ticketData) => {
    const response = await api.put(config.API_ENDPOINTS.UPDATE_SUPPORT_TICKET_STATUS, ticketData);
    return response.data;
  },

  deleteSupportTicket: async (ticketId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_SUPPORT_TICKET, {
      data: { support_ticket_id: ticketId }
    });
    return response.data;
  },

  getSupportTicketDetails: async (ticketId) => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUPPORT_TICKET_DETAILS, {
      params: { support_ticket_id: ticketId }
    });
    return response.data;
  },

  getSupportTicketStats: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUPPORT_TICKET_STATS, { params });
    return response.data;
  },

  // Notification Management
  createNotificationCampaign: async (campaignData) => {
    // Get admin user ID from localStorage
    const adminUserId = localStorage.getItem('admin_user_id');
    if (adminUserId) {
      campaignData.created_by = parseInt(adminUserId);
    }

    console.log('Creating notification campaign with data:', campaignData);

    const response = await api.post(config.API_ENDPOINTS.CREATE_NOTIFICATION_CAMPAIGN, campaignData);
    return response.data;
  },

  sendNotificationCampaign: async (campaignId) => {
    const response = await api.post(config.API_ENDPOINTS.SEND_NOTIFICATION_CAMPAIGN, { campaign_id: campaignId });
    return response.data;
  },

  getAllNotificationCampaigns: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_NOTIFICATION_CAMPAIGNS, { params });
    return response.data;
  },

  getNotificationPerformanceStats: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_NOTIFICATION_PERFORMANCE_STATS, { params });
    return response.data;
  },

  getNotificationSystemStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_NOTIFICATION_SYSTEM_STATS);
    return response.data;
  },

  updateNotificationCampaign: async (campaignData) => {
    console.log('Updating notification campaign with data:', campaignData);

    const response = await api.put(config.API_ENDPOINTS.UPDATE_NOTIFICATION_CAMPAIGN, campaignData);
    return response.data;
  },

  deleteNotificationCampaign: async (campaignId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_NOTIFICATION_CAMPAIGN, {
      data: { campaign_id: campaignId }
    });
    return response.data;
  },

  // Content Management
  createBanner: async (bannerData) => {
    // Get admin user ID from localStorage
    const adminUserId = localStorage.getItem('admin_user_id');
    if (adminUserId) {
      bannerData.created_by = parseInt(adminUserId);
    }

    console.log('Creating banner with data:', bannerData);

    const response = await api.post(config.API_ENDPOINTS.CREATE_BANNER, bannerData);
    return response.data;
  },

  getAllBanners: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_BANNERS, { params });
    return response.data;
  },

  updateBanner: async (bannerId, bannerData) => {
    const response = await api.put(`${config.API_ENDPOINTS.UPDATE_BANNER}/${bannerId}`, bannerData);
    return response.data;
  },

  deleteBanner: async (bannerId) => {
    const response = await api.delete(`${config.API_ENDPOINTS.DELETE_BANNER}/${bannerId}`);
    return response.data;
  },

  createTutorial: async (tutorialData) => {
    // Get admin user ID from localStorage
    const adminUserId = localStorage.getItem('admin_user_id');
    if (adminUserId) {
      tutorialData.created_by = parseInt(adminUserId);
    }

    console.log('Creating tutorial with data:', tutorialData);

    const response = await api.post(config.API_ENDPOINTS.CREATE_TUTORIAL, tutorialData);
    return response.data;
  },

  getAllTutorials: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_TUTORIALS, { params });
    return response.data;
  },

  updateTutorial: async (tutorialId, tutorialData) => {
    const response = await api.put(`${config.API_ENDPOINTS.UPDATE_TUTORIAL}/${tutorialId}`, tutorialData);
    return response.data;
  },

  deleteTutorial: async (tutorialId) => {
    const response = await api.delete(`${config.API_ENDPOINTS.DELETE_TUTORIAL}/${tutorialId}`);
    return response.data;
  },

  getTutorialAnalytics: async (tutorialId) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_TUTORIAL_ANALYTICS}/${tutorialId}`);
    return response.data;
  },

  trackTutorialView: async (tutorialId, deviceType) => {
    const response = await api.post(`${config.API_ENDPOINTS.TRACK_TUTORIAL_VIEW}/${tutorialId}`, {
      device_type: deviceType
    });
    return response.data;
  },

  // Terms & Conditions Management
  getAllPolicyCategories: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_POLICY_CATEGORIES);
    return response.data;
  },
  getPolicyPoints: async (categoryId, params = {}) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_POLICY_POINTS}/${categoryId}`, { params });
    return response.data;
  },
  createPolicyPoint: async (policyPointData) => {
    const response = await api.post(config.API_ENDPOINTS.CREATE_POLICY_POINT, policyPointData);
    return response.data;
  },
  updatePolicyPoint: async (pointId, policyPointData) => {
    const response = await api.put(`${config.API_ENDPOINTS.UPDATE_POLICY_POINT}/${pointId}`, policyPointData);
    return response.data;
  },
  deletePolicyPoint: async (pointId) => {
    const response = await api.delete(`${config.API_ENDPOINTS.DELETE_POLICY_POINT}/${pointId}`);
    return response.data;
  },
  reorderPolicyPoints: async (categoryId, pointsData) => {
    const response = await api.put(`${config.API_ENDPOINTS.REORDER_POLICY_POINTS}/${categoryId}`, pointsData);
    return response.data;
  },
  createPolicyVersion: async (versionData) => {
    const response = await api.post(config.API_ENDPOINTS.CREATE_POLICY_VERSION, versionData);
    return response.data;
  },
  getPolicyVersionHistory: async (categoryId) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_POLICY_VERSION_HISTORY}/${categoryId}`);
    return response.data;
  },
  getPolicyContent: async (categoryName) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_POLICY_CONTENT}/${categoryName}`);
    return response.data;
  },
  acceptPolicyVersion: async (versionId, categoryId) => {
    const response = await api.post(`${config.API_ENDPOINTS.ACCEPT_POLICY_VERSION}/${versionId}`, {
      category_id: categoryId
    });
    return response.data;
  },
  getUserPolicyAcceptance: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_USER_POLICY_ACCEPTANCE);
    return response.data;
  },

  // Comprehensive Admin Statistics
  getComprehensiveStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_COMPREHENSIVE_STATS);
    return response.data;
  },

  // Refer & Earn System
  getReferralCode: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_REFERRAL_CODE);
    return response.data;
  },
  getReferralStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_REFERRAL_STATS);
    return response.data;
  },
  checkFreeTrialEligibility: async (deviceId) => {
    const response = await api.post(config.API_ENDPOINTS.CHECK_FREE_TRIAL_ELIGIBILITY, {
      device_id: deviceId
    });
    return response.data;
  },
  activateFreeTrial: async (deviceId) => {
    const response = await api.post(config.API_ENDPOINTS.ACTIVATE_FREE_TRIAL, {
      device_id: deviceId
    });
    return response.data;
  },
  applyReferralCode: async (referralCode, deviceId) => {
    const response = await api.post(config.API_ENDPOINTS.APPLY_REFERRAL_CODE, {
      referral_code: referralCode,
      device_id: deviceId
    });
    return response.data;
  },
  getReferralAnalytics: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_REFERRAL_ANALYTICS, { params });
    return response.data;
  },
  activatePendingRewards: async () => {
    const response = await api.post(config.API_ENDPOINTS.ACTIVATE_PENDING_REWARDS, {
      subscription_id: config.SPECIAL_PLANS.REFERRAL_REWARD // Referral Reward Plan (ID: 1) from subscription_master
    });
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


  // Manual Upgrade System
  getAvailablePlans: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_AVAILABLE_PLANS);
    return response.data;
  },

  searchUserByMobile: async (mobile) => {
    const response = await api.get(config.API_ENDPOINTS.SEARCH_USER_BY_MOBILE, {
      params: { mobile }
    });
    return response.data;
  },

  manualUpgradeUser: async (upgradeData) => {
    const response = await api.post(config.API_ENDPOINTS.MANUAL_UPGRADE_USER, upgradeData);
    return response.data;
  },

  getManualUpgradeHistory: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_MANUAL_UPGRADE_HISTORY, { params });
    return response.data;
  },

  getManualUpgradeStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_MANUAL_UPGRADE_STATS);
    return response.data;
  },

  // Admin Report System
  getUserGrowthReport: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_USER_GROWTH_REPORT, { params });
    return response.data;
  },

  getUserActivityReport: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_USER_ACTIVITY_REPORT);
    return response.data;
  },

  getSubscriptionRevenueReport: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUBSCRIPTION_REVENUE_REPORT, { params });
    return response.data;
  },

  getBusinessHealthReport: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_BUSINESS_HEALTH_REPORT);
    return response.data;
  },

  getIncomeExpenseSummary: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_INCOME_EXPENSE_SUMMARY, { params });
    return response.data;
  },

  getExpenseBreakdown: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_EXPENSE_BREAKDOWN);
    return response.data;
  },

  getIncomeBreakdown: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_INCOME_BREAKDOWN, { params });
    return response.data;
  },

  getComprehensiveReport: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_COMPREHENSIVE_REPORT, { params });
    return response.data;
  },

  exportReportData: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.EXPORT_REPORT_DATA, {
      params,
      responseType: 'blob' // Important for file downloads
    });
    return response;
  },

  // App Rating System Management
  submitAppRating: async (ratingData) => {
    try {
      console.log('Submitting app rating with data:', ratingData);
      const response = await api.post(config.API_ENDPOINTS.SUBMIT_APP_RATING, ratingData);
      return response.data;
    } catch (error) {
      console.error('Error submitting app rating:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getAllAppRatings: async (params = {}) => {
    try {
      console.log('Fetching all app ratings with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_APP_RATINGS, { params });
      console.log('All app ratings API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all app ratings:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getAppRatingStats: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_APP_RATING_STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching app rating stats:', error);
      throw error;
    }
  },

  getAppRatingHistory: async (params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_APP_RATING_HISTORY, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching app rating history:', error);
      throw error;
    }
  },

  updateAppRating: async (ratingId, updateData) => {
    try {
      console.log('Updating app rating:', { ratingId, updateData });
      const response = await api.put(config.API_ENDPOINTS.UPDATE_APP_RATING, {
        rating_id: ratingId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating app rating:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  deleteAppRating: async (ratingId) => {
    try {
      console.log('Deleting app rating:', ratingId);
      const response = await api.delete(config.API_ENDPOINTS.DELETE_APP_RATING, {
        data: { rating_id: ratingId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting app rating:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getAppRatingAnalytics: async (params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_APP_RATING_ANALYTICS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching app rating analytics:', error);
      throw error;
    }
  },

  // Contact Us Management APIs
  getContactUsData: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_CONTACT_US_DATA);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact us data:', error);
      throw error;
    }
  },

  // Contact Config Management
  getAllContactConfigs: async (params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_CONTACT_CONFIGS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contact configs:', error);
      throw error;
    }
  },

  createContactConfig: async (configData) => {
    try {
      const response = await api.post(config.API_ENDPOINTS.CREATE_CONTACT_CONFIG, configData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact config:', error);
      throw error;
    }
  },

  updateContactConfig: async (configId, updateData) => {
    try {
      const response = await api.put(config.API_ENDPOINTS.UPDATE_CONTACT_CONFIG, {
        config_id: configId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating contact config:', error);
      throw error;
    }
  },

  deleteContactConfig: async (configId) => {
    try {
      const response = await api.delete(config.API_ENDPOINTS.DELETE_CONTACT_CONFIG, {
        data: { config_id: configId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting contact config:', error);
      throw error;
    }
  },

  // App Download Links Management
  getAllAppDownloadLinks: async (params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_APP_DOWNLOAD_LINKS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching app download links:', error);
      throw error;
    }
  },

  createAppDownloadLink: async (linkData) => {
    try {
      const response = await api.post(config.API_ENDPOINTS.CREATE_APP_DOWNLOAD_LINK, linkData);
      return response.data;
    } catch (error) {
      console.error('Error creating app download link:', error);
      throw error;
    }
  },

  updateAppDownloadLink: async (linkId, updateData) => {
    try {
      const response = await api.put(config.API_ENDPOINTS.UPDATE_APP_DOWNLOAD_LINK, {
        link_id: linkId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating app download link:', error);
      throw error;
    }
  },

  deleteAppDownloadLink: async (linkId) => {
    try {
      const response = await api.delete(config.API_ENDPOINTS.DELETE_APP_DOWNLOAD_LINK, {
        data: { link_id: linkId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting app download link:', error);
      throw error;
    }
  },

  // User Management APIs
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_DETAILED_USER_INFO, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  manageUserStatus: async (userId, action, reason = '') => {
    try {
      const response = await api.post(config.API_ENDPOINTS.MANAGE_USER_STATUS, {
        user_id: userId,
        action: action, // 'suspend' or 'activate'
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error managing user status:', error);
      throw error;
    }
  },

  suspendUser: async (userId, reason = '') => {
    try {
      const response = await api.post(config.API_ENDPOINTS.MANAGE_USER_STATUS, {
        user_id: userId,
        action: 'suspend',
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  activateUser: async (userId, reason = '') => {
    try {
      const response = await api.post(config.API_ENDPOINTS.MANAGE_USER_STATUS, {
        user_id: userId,
        action: 'activate',
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  unsuspendUser: async (userId, reason = '') => {
    try {
      const response = await api.put(config.API_ENDPOINTS.UNSUSPEND_USER, {
        user_id: userId,
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error unsuspending user:', error);
      throw error;
    }
  },

  // FAQ System APIs
  getFaqCategories: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_FAQ_CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ categories:', error);
      throw error;
    }
  },

  getFaqsByCategory: async (categoryName, userId = null) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await api.get(`${config.API_ENDPOINTS.GET_FAQS_BY_CATEGORY}/${categoryName}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs by category:', error);
      throw error;
    }
  },

  getFaqById: async (faqId, userId = null) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await api.get(`${config.API_ENDPOINTS.GET_FAQ_BY_ID}/${faqId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ by ID:', error);
      throw error;
    }
  },

  searchFaqs: async (searchQuery, categoryName = null, userId = null) => {
    try {
      const params = { search_query: searchQuery };
      if (categoryName) params.category_name = categoryName;
      if (userId) params.user_id = userId;

      const response = await api.get(config.API_ENDPOINTS.SEARCH_FAQS, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching FAQs:', error);
      throw error;
    }
  },

  // Admin FAQ Management APIs
  getAllFaqCategories: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_FAQ_CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching all FAQ categories:', error);
      throw error;
    }
  },

  getAllFaqs: async (params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_FAQS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all FAQs:', error);
      throw error;
    }
  },

  createFaqCategory: async (categoryData) => {
    try {
      const response = await api.post(config.API_ENDPOINTS.CREATE_FAQ_CATEGORY, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ category:', error);
      throw error;
    }
  },

  createFaqItem: async (faqData) => {
    try {
      const response = await api.post(config.API_ENDPOINTS.CREATE_FAQ_ITEM, faqData);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      throw error;
    }
  },

  updateFaqItem: async (faqId, updateData) => {
    try {
      const response = await api.put(`${config.API_ENDPOINTS.UPDATE_FAQ_ITEM}/${faqId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      throw error;
    }
  },

  deleteFaqItem: async (faqId) => {
    try {
      const response = await api.delete(`${config.API_ENDPOINTS.DELETE_FAQ_ITEM}/${faqId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      throw error;
    }
  },

  getFaqAnalytics: async (params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_FAQ_ANALYTICS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ analytics:', error);
      throw error;
    }
  },

  // Performance Tracking System API Functions
  calculatePerformanceScore: async (data) => {
    try {
      console.log('Calculating performance score with data:', data);
      const response = await api.post(config.API_ENDPOINTS.CALCULATE_PERFORMANCE_SCORE, data);
      console.log('Performance score calculation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error calculating performance score:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getUserPerformanceScore: async (params = {}) => {
    try {
      console.log('Fetching user performance score with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_USER_PERFORMANCE_SCORE, { params });
      console.log('User performance score response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user performance score:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getUserPerformanceHistory: async (params = {}) => {
    try {
      console.log('Fetching user performance history with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_USER_PERFORMANCE_HISTORY, { params });
      console.log('User performance history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user performance history:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getUserPerformanceAlerts: async (params = {}) => {
    try {
      console.log('Fetching user performance alerts with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_USER_PERFORMANCE_ALERTS, { params });
      console.log('User performance alerts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user performance alerts:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getOverallPerformanceStats: async (params = {}) => {
    try {
      console.log('Fetching overall performance stats with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_OVERALL_PERFORMANCE_STATS, { params });
      console.log('Overall performance stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching overall performance stats:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getUserPerformanceReport: async (params = {}) => {
    try {
      console.log('Fetching user performance report with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_USER_PERFORMANCE_REPORT, { params });
      console.log('User performance report response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user performance report:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getPerformanceComparison: async (params = {}) => {
    try {
      console.log('Fetching performance comparison with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_PERFORMANCE_COMPARISON, { params });
      console.log('Performance comparison response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching performance comparison:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Performance Visualization System API Functions
  getPerformanceBarGraphData: async (params = {}) => {
    try {
      console.log('Fetching performance bar graph data with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_PERFORMANCE_BAR_GRAPH_DATA, { params });
      console.log('Performance bar graph data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching performance bar graph data:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getPerformanceTrends: async (params = {}) => {
    try {
      console.log('Fetching performance trends with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_PERFORMANCE_TRENDS, { params });
      console.log('Performance trends response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching performance trends:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getUserPerformanceComparison: async (params = {}) => {
    try {
      console.log('Fetching user performance comparison with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_USER_PERFORMANCE_COMPARISON, { params });
      console.log('User performance comparison response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user performance comparison:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Feature Usage Analytics API Functions
  getFeatureUsageAnalytics: async (params = {}) => {
    try {
      console.log('Fetching feature usage analytics with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_FEATURE_USAGE_ANALYTICS, { params });
      console.log('Feature usage analytics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching feature usage analytics:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getFeatureUsageTrends: async (params = {}) => {
    try {
      console.log('Fetching feature usage trends with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_FEATURE_USAGE_TRENDS, { params });
      console.log('Feature usage trends response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching feature usage trends:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
};

// Initialize token management when module loads
tokenManager.initialize();

export default apiService;