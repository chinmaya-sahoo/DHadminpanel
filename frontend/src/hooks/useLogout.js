// hooks/useLogout.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logout = async (options = {}) => {
    const { 
      redirect = true, 
      showConfirmation = false,
      onSuccess = null,
      onError = null 
    } = options;

    if (showConfirmation) {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (!confirmed) return false;
    }

    setIsLoggingOut(true);

    try {
      // Call API service logout
      await apiService.logout();

      if (onSuccess) {
        onSuccess();
      }

      if (redirect) {
        // Redirect to login page
        navigate('/admin/login', { replace: true });
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      if (onError) {
        onError(error);
      }

      // Even if API call fails, clear local storage and redirect
      if (redirect) {
        navigate('/admin/login', { replace: true });
      }

      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut
  };
};

export default useLogout;