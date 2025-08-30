// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import config from '../config';

// Main authentication hook
export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!apiService.isAuthenticated()) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
        return false;
      }

      // Verify token with backend
      const userData = await apiService.verifyToken();
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData || null,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Clear invalid auth data
      await apiService.logout();
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error.message || 'Authentication failed',
      });
      
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await apiService.login(email, password);
      
      if (result.success) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: result.data.user || null,
          error: null,
        });
        
        return { success: true, data: result.data };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      const errorMessage = error.message || config.ERRORS.INVALID_CREDENTIALS;
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async (redirectTo = '/admin/login') => {
    try {
      await apiService.logout();
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
      
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
      
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
      
      return false;
    }
  }, [navigate]);

  // Initialize auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
};

// Hook for requiring authentication
export const useRequireAuth = (redirectTo = '/admin/login') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save attempted location for redirect after login
      navigate(redirectTo, {
        replace: true,
        state: { from: location }
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);

  return { isAuthenticated, isLoading };
};

// Hook for redirecting authenticated users
export const useRedirectIfAuthenticated = (redirectTo = '/admin/dashboard') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to intended location or default
      const intendedLocation = location.state?.from?.pathname || redirectTo;
      navigate(intendedLocation, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);

  return { isAuthenticated, isLoading };
};

// Hook for auth status without side effects
export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (apiService.isAuthenticated()) {
          await apiService.verifyToken();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { isAuthenticated, isLoading };
};

// Permission-based auth hook
export const usePermissions = (requiredPermissions = []) => {
  const { user, isAuthenticated } = useAuth();
  
  const hasPermission = useCallback((permission) => {
    if (!isAuthenticated || !user) return false;
    
    // Check if user has the required permission
    // This depends on your backend permission structure
    return user.permissions?.includes(permission) || user.is_superuser;
  }, [isAuthenticated, user]);

  const hasAllPermissions = useCallback(() => {
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.every(permission => hasPermission(permission));
  }, [requiredPermissions, hasPermission]);

  const hasAnyPermission = useCallback(() => {
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [requiredPermissions, hasPermission]);

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions: user?.permissions || [],
  };
};

// Session management hook
export const useSession = () => {
  const [sessionInfo, setSessionInfo] = useState({
    lastActivity: Date.now(),
    isActive: true,
  });

  // Update last activity
  const updateActivity = useCallback(() => {
    setSessionInfo(prev => ({
      ...prev,
      lastActivity: Date.now(),
      isActive: true,
    }));
  }, []);

  // Check for session timeout (optional)
  useEffect(() => {
    const checkSession = () => {
      const now = Date.now();
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      
      if (now - sessionInfo.lastActivity > sessionTimeout) {
        setSessionInfo(prev => ({
          ...prev,
          isActive: false,
        }));
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionInfo.lastActivity]);

  // Listen for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  return {
    ...sessionInfo,
    updateActivity,
  };
};