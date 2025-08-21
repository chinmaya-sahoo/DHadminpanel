// File: admin/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import EditProduct from "./pages/EditProduct";
import SidebarLayout from "./components/SidebarLayout";
import Seller from "./pages/Seller";
import Editseller from "./pages/Editseller";
import Categories from './pages/Categories';
import EditCategories from "./pages/EditCategories";
import ErrorBoundary from './components/ErrorBoundary';
import HeroCarousel from './pages/HeroCarousel';
import EditHeroCarousel from './pages/EditHeroCarousel';
import SellerManagement from './pages/SellerManagement';
import CouponManagement from './pages/CouponManagement';
import DataPage from './pages/DataPage';
import Settings from './pages/Settings';
import apiService from './services/api';

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

  return isValid ? <SidebarLayout>{children}</SidebarLayout> : <Navigate to="/admin/login" replace />;
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
          <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/admin/categories/edit/:id" element={<ProtectedRoute><EditCategories /></ProtectedRoute>} />
          <Route path="/admin/seller" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
          <Route path="/admin/seller/edit/:id" element={<ProtectedRoute><Editseller /></ProtectedRoute>} />
          <Route path="/admin/hero-carousel" element={<ProtectedRoute><HeroCarousel /></ProtectedRoute>} />
          <Route path="/admin/hero-carousel/edit/:id" element={<ProtectedRoute><EditHeroCarousel /></ProtectedRoute>} />
          <Route path="/admin/hero-carousel/new" element={<ProtectedRoute><EditHeroCarousel /></ProtectedRoute>} />
          <Route path="/admin/sellers" element={<ProtectedRoute><SellerManagement /></ProtectedRoute>} />
          <Route path="/admin/coupons" element={<ProtectedRoute><CouponManagement /></ProtectedRoute>} />
          <Route path="/admin/data" element={<ProtectedRoute><DataPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Catch all route - redirect to admin dashboard */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;