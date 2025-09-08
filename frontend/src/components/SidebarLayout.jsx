// File: admin/src/components/SidebarLayout.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  Package,
  PiggyBank,
  Users, 
  LogOut,
  ArrowLeftRight,
  Component,
  BookMarked,
  Command,
  Blend,
  IndianRupee,
  Tag,
  Store,
  Menu,
  Bell,
  CircleDollarSign,
  X,
  Presentation,
  MessageCircle,
  File,
  Settings,
  HandHelping,
  MonitorUp
} from 'lucide-react';

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin', icon: <Users size={20} />, label: 'Dashboard' },
    { path: '/admin/report', icon: <BookMarked size={20} />, label: 'Report' },
    { path: '/admin/hisab', icon: <PiggyBank size={20} />, label: 'Hisab' },
    { path: '/admin/user-management', icon: <Command size={20} />, label: 'User Management' },
    { path: '/admin/subscription-management', icon: <CircleDollarSign size={20} />, label: 'Subscription' },
    { path: '/admin/notification', icon: <Bell size={20} />, label: 'Notification' },
    { path: '/admin/analytics-insights', icon: <Component size={20} />, label: 'Analytics Insights' },
    { path: '/admin/feedback-support', icon: <MessageCircle size={20} />, label: 'Feedback' },
    { path: '/admin/content', icon: <MonitorUp size={20} />, label: 'Content' },
    { path: '/admin/tnc', icon: <HandHelping size={20} />, label: 'Terms & Conditions' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Link to="/admin">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Daily Hisab Admin Logo" className="w-10 h-10 rounded-full shadow" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DH Admin
                </h2>
              </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your store</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded-xl text-gray-600 transition-all duration-200 group
                  ${isActive(item.path) 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100 hover:text-blue-600 hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}
                `}>
                  {item.icon}
                </div>
                <span className="ml-3 font-medium">{item.label}</span>
                {isActive(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
            >
              <LogOut size={20} className="text-gray-500 group-hover:text-red-600" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <Link to="/admin">
            <div className="flex items-center space-x-2">
             
              <img src="/logo.png" alt="Daily Hisab Admin Logo" className="w-8 h-8 rounded-full shadow" />
              <span className="text-lg font-semibold text-gray-800">DH Admin</span>
             
            </div>
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
