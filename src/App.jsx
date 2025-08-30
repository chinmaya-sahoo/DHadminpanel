// app.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SidebarLayout from "./components/SidebarLayout";
import ErrorBoundary from './components/ErrorBoundary';
import Settings from './pages/Settings';
import Transaction from "./pages/Transaction";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";
import Udhari from "./pages/Udhari";
import Notification from "./pages/Notification";
import Subscription from "./pages/Subscription";
import Report from "./pages/Report";
import Hisab from "./pages/Hisab";
import User_Management from "./pages/User_Management";
import Subscription_Management from "./pages/Subscription_Management";
import Analytics_Insights from "./pages/Analytics_Insights";
import Feedback_Support from "./pages/Feedback_Support";
import Content from "./pages/Content";
import Tandc from "./pages/Tandc";
import apiService from './services/api';

const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isChecking: true, isAuthenticated: false });

  useEffect(() => {
    let isMounted = true;
    const validate = async () => {
      try {
        if (!apiService.isAuthenticated()) {
          if (isMounted) setAuthState({ isChecking: false, isAuthenticated: false });
          return;
        }
        await apiService.verifyAuth();
        if (isMounted) setAuthState({ isChecking: false, isAuthenticated: true });
      } catch (err) {
        await apiService.logout();
        if (isMounted) setAuthState({ isChecking: false, isAuthenticated: false });
      }
    };
    validate();
    return () => { isMounted = false; };
  }, []);

  if (authState.isChecking) return <LoadingSpinner message="Validating authentication..." />;
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/admin/login" replace />; // Use Navigate for redirects
  }

  return <SidebarLayout>{children}</SidebarLayout>;
};

const PublicRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isChecking: true, isAuthenticated: false });

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          await apiService.verifyAuth();
          if (isMounted) setAuthState({ isChecking: false, isAuthenticated: true });
        } catch (err) {
          await apiService.logout();
          if (isMounted) setAuthState({ isChecking: false, isAuthenticated: false });
        }
      } else {
        if (isMounted) setAuthState({ isChecking: false, isAuthenticated: false });
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  if (authState.isChecking) return <LoadingSpinner message="Checking authentication..." />;
  
  if (authState.isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />; // Use Navigate for redirects
  }

  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/admin/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
          <Route path="/admin/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/admin/hisab" element={<ProtectedRoute><Hisab /></ProtectedRoute>} />
          <Route path="/admin/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path="/admin/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          <Route path="/admin/udhari" element={<ProtectedRoute><Udhari /></ProtectedRoute>} />
          <Route path="/admin/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/admin/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/admin/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/admin/user-management" element={<ProtectedRoute><User_Management /></ProtectedRoute>} />
          <Route path="/admin/subscription-management" element={<ProtectedRoute><Subscription_Management /></ProtectedRoute>} />
          <Route path="/admin/analytics-insights" element={<ProtectedRoute><Analytics_Insights /></ProtectedRoute>} />
          <Route path="/admin/feedback-support" element={<ProtectedRoute><Feedback_Support /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
          <Route path="/admin/tnc" element={<ProtectedRoute><Tandc /></ProtectedRoute>} />

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;