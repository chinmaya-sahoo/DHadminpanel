import React, { useState, useEffect } from "react";
import { UserPlus, Search, Filter, Download, CheckCircle, XCircle, Calendar, Loader2, AlertCircle, User, Mail, Phone, Clock } from "lucide-react";
import apiService from '../../services/api';

const ManualUpgrade = () => {
  // Form state
  const [userMobile, setUserMobile] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [upgradeReason, setUpgradeReason] = useState('');

  // Search state
  const [searchMobile, setSearchMobile] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Autocomplete state
  const [autocompleteUsers, setAutocompleteUsers] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);

  // Data state
  const [availablePlans, setAvailablePlans] = useState([]);
  const [upgradeHistory, setUpgradeHistory] = useState([]);
  const [upgradeStats, setUpgradeStats] = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  // Load data on component mount
  useEffect(() => {
    fetchAvailablePlans();
    fetchUpgradeHistory();
    fetchUpgradeStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch available plans
  const fetchAvailablePlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAvailablePlans();
      if (response.success) {
        setAvailablePlans(response.data.plans || []);
        if (response.data.plans && response.data.plans.length > 0) {
          setSelectedPlanId(response.data.plans[0].subscription_id);
        }
      }
    } catch (error) {
      setError('Failed to fetch available plans');
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upgrade history
  const fetchUpgradeHistory = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined
      };

      const response = await apiService.getManualUpgradeHistory(params);
      if (response.success) {
        setUpgradeHistory(response.data.upgrade_history || []);
        setTotalPages(response.data.pagination?.total_pages || 1);
        setTotalRecords(response.data.pagination?.total_records || 0);
      }
    } catch (error) {
      setError('Failed to fetch upgrade history');
      console.error('Error fetching upgrade history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upgrade statistics
  const fetchUpgradeStats = async () => {
    try {
      const response = await apiService.getManualUpgradeStats();
      if (response.success) {
        setUpgradeStats(response.data || {});
      }
    } catch (error) {
      console.error('Error fetching upgrade stats:', error);
    }
  };

  // Autocomplete search with debounce
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (userMobile && userMobile.length >= 3) {
        try {
          setAutocompleteLoading(true);
          const response = await apiService.searchUsersAutocomplete(userMobile, 5);
          if (response.success) {
            setAutocompleteUsers(response.data.users || []);
            setShowAutocomplete(true);
          }
        } catch (error) {
          console.error('Error in autocomplete:', error);
          setAutocompleteUsers([]);
        } finally {
          setAutocompleteLoading(false);
        }
      } else {
        setAutocompleteUsers([]);
        setShowAutocomplete(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [userMobile]);

  // Handle user selection from autocomplete
  const handleSelectUser = async (selectedMobile) => {
    setUserMobile(selectedMobile);
    setShowAutocomplete(false);
    setAutocompleteUsers([]);

    // Fetch full user details
    try {
      setSearching(true);
      setSearchError(null);
      const response = await apiService.searchUserByMobile(selectedMobile);
      if (response.success) {
        setSearchedUser(response.data);
        setSearchError(null);
      }
    } catch (error) {
      setSearchError(error.response?.data?.msg?.[0] || 'Failed to load user details');
      console.error('Error loading user details:', error);
    } finally {
      setSearching(false);
    }
  };

  // Handle user search by mobile
  const handleSearchUser = async () => {
    if (!searchMobile || searchMobile.trim() === '') {
      setSearchError('Please enter a mobile number');
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      setSearchedUser(null);

      const response = await apiService.searchUserByMobile(searchMobile.trim());

      if (response.success) {
        setSearchedUser(response.data);
        // Auto-fill mobile number in upgrade form
        setUserMobile(response.data.user.mobile);
        setSearchError(null);
      } else {
        setSearchError(response.msg?.[0] || 'User not found');
        setSearchedUser(null);
      }
    } catch (error) {
      setSearchError(error.response?.data?.msg?.[0] || error.message || 'Failed to search user');
      setSearchedUser(null);
      console.error('Error searching user:', error);
    } finally {
      setSearching(false);
    }
  };

  // Handle manual upgrade
  const handleManualUpgrade = async () => {
    if (!userMobile || !selectedPlanId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const upgradeData = {
        user_mobile: userMobile,
        subscription_id: parseInt(selectedPlanId),
        upgrade_reason: upgradeReason || 'Manual upgrade by admin'
      };

      const response = await apiService.manualUpgradeUser(upgradeData);

      if (response.success) {
        setSuccess('User upgraded successfully!');
        setUserMobile('');
        setSearchMobile('');
        setSearchedUser(null);
        setAutocompleteUsers([]);
        setShowAutocomplete(false);
        setSelectedPlanId(availablePlans[0]?.subscription_id || '');
        setUpgradeReason('');
        // Refresh data
        fetchUpgradeHistory();
        fetchUpgradeStats();
      } else {
        setError(response.msg?.[0] || 'Upgrade failed');
      }
    } catch (error) {
      setError(error.response?.data?.msg?.[0] || error.message || 'Failed to upgrade user');
      console.error('Error upgrading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Export history to CSV
  const exportHistory = async () => {
    try {
      const params = {
        limit: 1000, // Get all records for export
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined
      };

      const response = await apiService.getManualUpgradeHistory(params);

      if (response.success) {
        const history = response.data.upgrade_history || [];
        const csvContent = [
          ['Name', 'Email', 'Mobile', 'From Plan', 'To Plan', 'Amount', 'Status', 'Upgraded At', 'Reason'],
          ...history.map(upgrade => [
            upgrade.user?.name || '',
            upgrade.user?.email || '',
            upgrade.user?.mobile || '',
            upgrade.from_plan || '',
            upgrade.to_plan || '',
            upgrade.upgrade_amount || 0,
            upgrade.status_label || '',
            upgrade.upgraded_at || '',
            upgrade.upgrade_reason || ''
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manual_upgrades_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      setError('Failed to export history');
      console.error('Error exporting history:', error);
    }
  };

  // Handle search and filters
  // const handleSearch = () => {
  //   setCurrentPage(1);
  //   fetchUpgradeHistory();
  // };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    fetchUpgradeHistory();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Auto-refresh data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUpgradeHistory();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPage, statusFilter, searchTerm, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manual Subscription Upgrade</h2>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* User Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Search User by Mobile Number</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter mobile number (e.g., 9786784534)"
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchUser();
                  }
                }}
              />
            </div>
            {searchError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {searchError}
              </p>
            )}
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearchUser}
              disabled={searching || !searchMobile}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {searching ? 'Searching...' : 'Search User'}
            </button>
          </div>
        </div>

        {/* Searched User Details */}
        {searchedUser && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              User Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-2">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{searchedUser.user.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{searchedUser.user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-sm font-medium text-gray-900">
                    {searchedUser.user.phone_code} {searchedUser.user.mobile}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">{searchedUser.user.created_at}</p>
                </div>
              </div>
            </div>

            {/* Current Subscription Details */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Current Subscription</h5>
              {searchedUser.current_subscription.has_subscription ? (
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    searchedUser.current_subscription.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {searchedUser.current_subscription.is_active ? 'Active' : 'Expired'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {searchedUser.current_subscription.plan_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {searchedUser.current_subscription.subscription_type_label} • 
                      {searchedUser.current_subscription.is_active
                        ? ` ${searchedUser.current_subscription.remaining_days} days remaining`
                        : ` Expired on ${searchedUser.current_subscription.end_date}`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No active subscription</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Upgrade Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Upgrade User Subscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type mobile number (e.g., 9786784534)"
                value={userMobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setUserMobile(value);
                  if (value.length === 0) {
                    setSearchedUser(null);
                    setShowAutocomplete(false);
                  } else {
                    setSearchedUser(null);
                    setShowAutocomplete(value.length >= 3);
                  }
                }}
                onFocus={() => {
                  if (userMobile.length >= 3 && autocompleteUsers.length > 0) {
                    setShowAutocomplete(true);
                  }
                }}
                onBlur={() => {
                  // Delay to allow click on dropdown items
                  setTimeout(() => setShowAutocomplete(false), 200);
                }}
                required
                disabled={!!searchedUser}
              />
              {autocompleteLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
              
              {/* Autocomplete Dropdown */}
              {showAutocomplete && autocompleteUsers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {autocompleteUsers.map((user) => (
                    <div
                      key={user.user_id}
                      onClick={() => handleSelectUser(user.mobile)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {user.phone_code} {user.mobile}
                            </span>
                            {user.active_flag === 0 && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                            {user.name && user.name !== 'N/A' && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {user.name}
                              </span>
                            )}
                            {user.email && user.email !== 'N/A' && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showAutocomplete && autocompleteUsers.length === 0 && userMobile.length >= 3 && !autocompleteLoading && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              )}
            </div>
            {searchedUser && (
              <p className="mt-1 text-xs text-gray-500">User selected: {searchedUser.user.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upgrade To Plan <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              required
            >
              <option value="">Select a plan</option>
              {availablePlans.map(plan => (
                <option key={plan.subscription_id} value={plan.subscription_id}>
                  {plan.plan_name} - ₹{plan.plan_price} ({plan.subscription_type_label})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upgrade Reason</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reason for manual upgrade"
              value={upgradeReason}
              onChange={(e) => setUpgradeReason(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleManualUpgrade}
              disabled={loading || !userMobile || !selectedPlanId}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Upgrading...' : 'Upgrade User'}
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePlans.map((plan) => (
            <div key={plan.subscription_id} className={`p-4 rounded-lg border-2 ${selectedPlanId == plan.subscription_id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">{plan.plan_name}</h4>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{plan.plan_price}</p>
                <p className="text-sm text-gray-500">{plan.subscription_type_label} • {plan.validity_days} days</p>
                <p className="text-xs text-gray-600 mt-1">{plan.plan_description}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Upgrade History</h3>
          <button
            onClick={exportHistory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading upgrade history...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upgraded At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upgradeHistory.map((upgrade) => (
                      <tr key={upgrade.upgrade_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{upgrade.user?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{upgrade.user?.email || 'No email'}</div>
                            <div className="text-sm text-gray-500">{upgrade.user?.mobile || 'No mobile'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {upgrade.from_plan || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {upgrade.to_plan || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{upgrade.upgrade_amount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(upgrade.status)}`}>
                            {upgrade.status_label || upgrade.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {upgrade.upgraded_at || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {upgrade.upgrade_reason || 'No reason provided'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {upgradeHistory.length === 0 && !loading && (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upgrade history found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * limit, totalRecords)}</span> of{' '}
                        <span className="font-medium">{totalRecords}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserPlus className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Upgrades</p>
              <p className="text-2xl font-semibold text-gray-900">{upgradeStats.total_upgrades || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Successful</p>
              <p className="text-2xl font-semibold text-gray-900">{upgradeStats.successful_upgrades || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">{upgradeStats.failed_upgrades || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">₹{upgradeStats.total_revenue || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualUpgrade;
