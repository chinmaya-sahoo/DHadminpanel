// components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import useLogout from '../hooks/useLogout';
import { useAuth } from '../hooks/useAuth';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { logout, isLoggingOut } = useLogout();
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatUserName = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.username) {
      return user.username;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Admin';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left side - Menu toggle and title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Daily Hisab Admin
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Welcome back, {formatUserName(user)}
          </p>
        </div>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center space-x-4">

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isLoggingOut}
          >
            {/* User Avatar */}
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {getInitials(formatUserName(user))}
              </span>
            </div>
            
            {/* User Name (hidden on mobile) */}
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {formatUserName(user)}
            </span>
            
            {/* Dropdown Arrow */}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {/* User Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {formatUserName(user)}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 mt-1">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to profile or handle profile action
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to settings or handle settings action
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;