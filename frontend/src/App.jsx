import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SidebarLayout from "./components/SidebarLayout";
import ErrorBoundary from './components/ErrorBoundary';
import Settings from './pages/Settings';
import apiService from './services/api';
import Transaction from "./pages/Transaction";
// import IncomePersonal from "./pages/IncomePersonal";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";
import Udhari from "./pages/Udhari";
import Subscription from "./pages/Subscription";
import Report from "./pages/Report";
import Hisab from "./pages/Hisab";
import User_Management from "./pages/User_Management";
import Subscription_Management from "./pages/Subscription_Management";
import Analytics_Insights from "./pages/Analytics_Insights";
import Feedback from "./pages/Feedback";
import Feedback_Support from "./pages/Feedback_Support";
import ContactUs from "./pages/ContactUs";
import Content from "./pages/Content";
import Tandc from "./pages/Tandc";
import ViewUser from "./pages/ViewUser";
import Notification from "./pages/Notification";
// Loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValidating: true, isAuthenticated: false, error: null });

  useEffect(() => {
    const validateAuthentication = async () => {
      try {
        if (!apiService.isAuthenticated()) {
          setAuthState({ isValidating: false, isAuthenticated: false, error: null });
          return;
        }
        await apiService.verifyToken();
        setAuthState({ isValidating: false, isAuthenticated: true, error: null });
      } catch (error) {
        console.error('Authentication validation failed:', error);
        try {
          await apiService.logout();
        } catch (logoutError) {
          console.error('Logout during validation failed:', logoutError);
        }
        setAuthState({ isValidating: false, isAuthenticated: false, error: error.message });
      }
    };
    validateAuthentication();
  }, []);

  if (authState.isValidating) return <LoadingSpinner message="Validating authentication..." />;
  if (!authState.isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <SidebarLayout>{children}</SidebarLayout>;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => { const checkAuth = async () => { if (apiService.isAuthenticated()) { try { await apiService.verifyToken(); setIsAuthenticated(true); } catch { await apiService.logout(); setIsAuthenticated(false); } } else { setIsAuthenticated(false); } setIsChecking(false); }; checkAuth(); }, []);
  if (isChecking) return <LoadingSpinner message="Checking authentication..." />;
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;
  return children;
};

// App initialization hook
const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => { apiService.initialize(); setIsInitialized(true); }, []);
  return isInitialized;
};

const App = () => {
  const isInitialized = useAppInitialization();
  if (!isInitialized) return <LoadingSpinner message="Initializing application..." />;

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
          <Route path="/admin/hisab" element={<ProtectedRoute><Hisab /></ProtectedRoute>} />
          <Route path="/admin/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          <Route path="/admin/udhari" element={<ProtectedRoute><Udhari /></ProtectedRoute>} />
          <Route path="/admin/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/admin/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/admin/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/admin/user-management" element={<ProtectedRoute><User_Management /></ProtectedRoute>} />
          <Route path="/admin/subscription-management" element={<ProtectedRoute><Subscription_Management /></ProtectedRoute>} />
          <Route path="/admin/analytics-insights" element={<ProtectedRoute><Analytics_Insights /></ProtectedRoute>} />
          <Route path="/admin/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/admin/feedback-support" element={<ProtectedRoute><Feedback_Support /></ProtectedRoute>} />
          <Route path="/admin/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
          <Route path="/admin/view-user" element={<ProtectedRoute><ViewUser /></ProtectedRoute>} />
          <Route path="/admin/tnc" element={<ProtectedRoute><Tandc /></ProtectedRoute>} />
          <Route path="/admin/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
