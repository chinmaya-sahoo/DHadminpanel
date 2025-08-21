// File: admin/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SidebarLayout from "./components/SidebarLayout";
import ErrorBoundary from './components/ErrorBoundary';
import Settings from './pages/Settings';
import apiService from './services/api';
import Transaction from "./pages/Transaction";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";
import Udhari from "./pages/Udhari";
import Notification from "./pages/Notification";
import Subscription from "./pages/Subscription";
import Report from "./pages/Report";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const adminLoggedIn = localStorage.getItem("admin_logged_in") === "true";
  return token && adminLoggedIn;
};

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!isAuthenticated()) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        await apiService.verifyToken();
        setIsValid(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        // Clear invalid tokens
        apiService.logout();
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating authentication...</p>
        </div>
      </div>
    );
  }

  return true ? <SidebarLayout>{children}</SidebarLayout> : <Navigate to="/admin/login" replace />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> 

          <Route path="/admin/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
          <Route path="/admin/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/admin/income" element={<ProtectedRoute><Income/></ProtectedRoute>} />
          <Route path="/admin/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          <Route path="/admin/udhari" element={<ProtectedRoute><Udhari /></ProtectedRoute>} />
          <Route path="/admin/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/admin/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/admin/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />

          {/* Catch all route - redirect to admin dashboard */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;