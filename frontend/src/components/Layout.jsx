import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Tag
} from 'lucide-react';
import apiService from '../services/api';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    apiService.logout();
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { path: '/dashboard', icon: <ShoppingBag size={20} />, label: 'Dashboard' },
    { path: '/dashboard/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/dashboard/categories', icon: <Tag size={20} />, label: 'Categories' },
    { path: '/dashboard/orders', icon: <Users size={20} />, label: 'Orders' },
    { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 ${
                isActive(item.path) ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 