import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Check if apiService is available
if (!apiService) {
  console.error('apiService is not available');
}

const Settings = () => {
  console.log('Settings component rendered');
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Admin credentials state
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingCredentials, setUpdatingCredentials] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdminInfo();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings...');
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSettings();
      
      setSettings(response.data.settings || []);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const response = await apiService.verifyToken();
      if (response.valid && response.user) {
        setAdminCredentials(prev => ({
          ...prev,
          username: response.user.username || '',
          email: response.user.email || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching admin info:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key 
          ? { ...setting, value: value }
          : setting
      )
    );
  };

  const handleSaveSetting = async (setting) => {
    if (!setting || !setting.key) {
      toast.error('Invalid setting data');
      return;
    }
    
    try {
      setSaving(true);
      
      await apiService.updateSetting(setting.key, {
        key: setting.key,
        value: setting.value,
        description: setting.description
      });
      
      toast.success('Setting saved successfully');
    } catch (err) {
      console.error('Error saving setting:', err);
      toast.error('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  const handleCredentialsChange = (field, value) => {
    setAdminCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateCredentials = async () => {
    // Validation
    if (!adminCredentials.currentPassword) {
      toast.error('Current password is required');
      return;
    }

    if (adminCredentials.newPassword && adminCredentials.newPassword !== adminCredentials.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (adminCredentials.newPassword && adminCredentials.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setUpdatingCredentials(true);
      
      const updateData = {
        currentPassword: adminCredentials.currentPassword
      };

      if (adminCredentials.username.trim()) {
        updateData.username = adminCredentials.username.trim();
      }
      
      if (adminCredentials.email.trim()) {
        updateData.email = adminCredentials.email.trim();
      }
      
      if (adminCredentials.newPassword.trim()) {
        updateData.newPassword = adminCredentials.newPassword.trim();
      }

      const response = await apiService.updateAdminCredentials(updateData);
      
      toast.success('Admin credentials updated successfully');
      
      // Clear password fields
      setAdminCredentials(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Update stored user info if email/username changed
      if (response.data.user) {
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      }
      
    } catch (err) {
      console.error('Error updating admin credentials:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update admin credentials';
      toast.error(errorMessage);
    } finally {
      setUpdatingCredentials(false);
    }
  };

  const renderSettingInput = (setting) => {
    if (!setting || !setting.key) {
      return null;
    }
    const { key, value, description } = setting;
    
    // Handle different types of settings
    if (key === 'cod_upfront_amount') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              COD Upfront Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={value === 0 ? 0 : value || ''}
              onChange={(e) => handleSettingChange(key, e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount in rupees"
            />
            <p className="text-sm text-gray-500 mt-1">
              {description || 'Amount to be paid upfront for Cash on Delivery orders'}
            </p>
          </div>
        </div>
      );
    }
    
    // Default input for other settings
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${key.replace(/_/g, ' ')}`}
          />
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  try {
    return (
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Application Settings</h1>
          <button
            onClick={fetchSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Admin Credentials Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Login Details</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => handleCredentialsChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => handleCredentialsChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                value={adminCredentials.currentPassword}
                onChange={(e) => handleCredentialsChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.newPassword}
                  onChange={(e) => handleCredentialsChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.confirmPassword}
                  onChange={(e) => handleCredentialsChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleUpdateCredentials}
                disabled={updatingCredentials || !adminCredentials.currentPassword}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingCredentials ? 'Updating...' : 'Update Credentials'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Settings</h2>
          
          {!settings || settings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No settings found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {settings.find(s => s.key === 'cod_upfront_amount' && (s.value === 0 || s.value === '0')) && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold">
                  No upfront payment required for Cash on Delivery orders. Customers will pay the full amount on delivery.
                </div>
              )}
              {settings.filter(setting => setting && setting.key).map((setting) => (
                <div key={setting.key} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {renderSettingInput(setting)}
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleSaveSetting(setting)}
                        disabled={saving}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Last updated: {(() => {
                      try {
                        return setting.updatedAt ? new Date(setting.updatedAt).toLocaleString() : 'Never';
                      } catch (error) {
                        return 'Never';
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Information</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Admin Credentials:</strong> You can update your username, email, and password here. 
              Current password is required for any changes. New password must be at least 6 characters long.
            </p>
            <p>
              <strong>COD Upfront Amount:</strong> This is the amount that customers will pay online 
              when selecting Cash on Delivery. The remaining amount will be collected on delivery.
            </p>
            <p>
              <strong>Note:</strong> Changes to settings take effect immediately for new orders.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering Settings component:', error);
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">The settings page encountered an error. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Settings; 