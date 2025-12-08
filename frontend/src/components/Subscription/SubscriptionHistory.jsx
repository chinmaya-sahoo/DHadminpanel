import React, { useState, useEffect, useCallback } from "react";
import { Users, Calendar, Search, Filter, Download, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import apiService from "../../services/api";

const SubscriptionHistory = () => {
  // State for API data
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState('all');
  const [userIdFilter, setUserIdFilter] = useState('');

  // State for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // State for summary statistics
  const [summary, setSummary] = useState({
    total_users: 0,
    users_with_subscription: 0,
    active_subscriptions: 0,
    expired_subscriptions: 0,
    users_without_subscription: 0,
    yearly_subscriptions: 0,
    monthly_subscriptions: 0
  });

  // Fetch subscription history from API
  const fetchSubscriptionHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.currentPage,
        limit: pagination.perPage,
        ...params
      };

      // Add filters to query params
      if (statusFilter !== 'all') {
        queryParams.subscription_status = statusFilter;
      }
      if (subscriptionTypeFilter !== 'all') {
        queryParams.subscription_type = subscriptionTypeFilter;
      }
      if (userIdFilter) {
        queryParams.user_id = userIdFilter;
      }
      if (searchTerm) {
        queryParams.search_term = searchTerm;
      }

      const response = await apiService.getUsersSubscriptionHistory(queryParams);
      console.log('Subscription History API Response:', response); // Debug log

      if (response && response.success) {
        setSubscriptions(response.data.users || []);
        setPagination(prev => response.data.pagination || prev);
        setSummary(prev => response.data.summary || prev);
      } else {
        setError('Failed to fetch subscription history');
        setSubscriptions([]);
      }
    } catch (err) {
      console.error('Error fetching subscription history:', err);
      setError(err.message || 'Failed to fetch subscription history');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.perPage, statusFilter, subscriptionTypeFilter, userIdFilter, searchTerm]);

  // Initial fetch
  useEffect(() => {
    fetchSubscriptionHistory();
  }, [fetchSubscriptionHistory]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchSubscriptionHistory({ search_term: searchTerm });
      } else {
        fetchSubscriptionHistory();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSubscriptionHistory]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));

    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'subscriptionType':
        setSubscriptionTypeFilter(value);
        break;
      case 'userId':
        setUserIdFilter(value);
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSubscriptionTypeFilter('all');
    setUserIdFilter('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Pagination handlers
  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get subscription type label
  const getSubscriptionTypeLabel = (type, subscription) => {
    // Use subscription_type_label from API if available
    if (subscription && subscription.subscription_type_label) {
      return subscription.subscription_type_label;
    }
    // Fallback to type mapping
    switch (type) {
      case 0: return 'Free Trial';
      case 1: return 'Yearly';
      case 2: return 'Monthly';
      case 3: return 'Lifetime';
      case 4: return 'Other';
      default: return 'Unknown';
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Export to CSV
  const exportHistory = () => {
    const csvContent = [
      ['User ID', 'Name', 'Email', 'Mobile', 'Plan Name', 'Subscription Type', 'Start Date', 'End Date', 'Status', 'Total Purchases', 'Amount'],
      ...subscriptions.map(user => {
        const subscription = user.current_subscription;
        return [
          user.user_id || '',
          user.user_name || '',
          user.user_email || '',
          user.user_mobile || '',
          subscription ? subscription.plan_name || 'N/A' : 'No Subscription',
          subscription ? getSubscriptionTypeLabel(subscription.subscription_type) : 'N/A',
          subscription ? subscription.start_date || 'N/A' : 'N/A',
          subscription ? subscription.end_date || 'N/A' : 'N/A',
          subscription ? (subscription.status_label || subscription.status || 'N/A') : 'No Subscription',
          user.purchase_statistics ? user.purchase_statistics.total_purchases : 0,
          subscription ? (subscription.user_amount || subscription.plan_amount || 0) : 'N/A'
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscription_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${i === pagination.currentPage
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={!pagination.hasPrevPage}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          {pages}
          <button
            onClick={nextPage}
            disabled={!pagination.hasNextPage}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="text-sm text-gray-700">
          Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to{' '}
          {Math.min(pagination.currentPage * pagination.perPage, pagination.totalRecords)} of{' '}
          {pagination.totalRecords} results
        </div>
      </div>
    );
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading subscription history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">User-wise Subscription History</h2>
        <button
          onClick={exportHistory}
          disabled={subscriptions.length === 0}
          className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="none">None</option>
          </select>

          <select
            value={subscriptionTypeFilter}
            onChange={(e) => handleFilterChange('subscriptionType', e.target.value)}
            className="px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="0">Free Trial</option>
            <option value="1">Yearly</option>
            <option value="2">Monthly</option>
            <option value="3">Lifetime</option>
            <option value="4">Other</option>
          </select>

          <input
            type="number"
            placeholder="User ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />

          <button
            onClick={clearFilters}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Clear Filters</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Period</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewals</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(subscriptions) && subscriptions.length > 0 ? subscriptions.map((user, index) => {
                const subscription = user.current_subscription;
                // Use days_remaining from API response if available, otherwise calculate
                const daysLeft = subscription 
                  ? (subscription.days_remaining !== undefined ? subscription.days_remaining : getDaysRemaining(subscription.end_date))
                  : 0;
                
                // Format mobile number
                const formattedMobile = user.user_mobile 
                  ? `${user.user_phone_code || ''}${user.user_mobile}`.replace(/^\+?91/, '')
                  : 'N/A';
                
                return (
                  <tr key={user.user_id || index} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">ID: {user.user_id || 'N/A'}</div>
                        <div className="text-gray-500">{user.user_name || 'N/A'}</div>
                        <div className="text-gray-500">{user.user_email || 'N/A'}</div>
                        <div className="text-gray-500">{formattedMobile}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {subscription ? (subscription.plan_name || 'N/A') : 'No Subscription'}
                        </div>
                        <div className="text-gray-500">
                          {subscription ? getSubscriptionTypeLabel(subscription.subscription_type, subscription) : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>Start: {subscription ? (subscription.start_date || 'N/A') : 'N/A'}</div>
                        <div>End: {subscription ? (subscription.end_date || 'N/A') : 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription ? subscription.status : 'none')}`}>
                        {subscription ? (subscription.status_label || subscription.status || 'N/A') : 'No Subscription'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {user.purchase_statistics ? user.purchase_statistics.total_purchases : 0}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {subscription ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          daysLeft > 7 ? 'bg-green-100 text-green-800' :
                          daysLeft > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          No Subscription
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {subscription ? `₹${subscription.user_amount || subscription.plan_amount || 0}` : 'N/A'}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No subscription data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {Array.isArray(subscriptions) && subscriptions.length > 0 ? subscriptions.map((user, index) => {
            const subscription = user.current_subscription;
            const daysLeft = subscription 
              ? (subscription.days_remaining !== undefined ? subscription.days_remaining : getDaysRemaining(subscription.end_date))
              : 0;
            const formattedMobile = user.user_mobile 
              ? `${user.user_phone_code || ''}${user.user_mobile}`.replace(/^\+?91/, '')
              : 'N/A';
            
            return (
              <div key={user.user_id || index} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
                <div className="space-y-3">
                  {/* User Info */}
                  <div>
                    <div className="font-medium text-gray-900 mb-1">ID: {user.user_id || 'N/A'}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{user.user_name || 'N/A'}</div>
                      <div>{user.user_email || 'N/A'}</div>
                      <div>{formattedMobile}</div>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Plan Details</div>
                    <div className="font-medium text-gray-900">
                      {subscription ? (subscription.plan_name || 'N/A') : 'No Subscription'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {subscription ? getSubscriptionTypeLabel(subscription.subscription_type, subscription) : 'N/A'}
                    </div>
                  </div>

                  {/* Subscription Period */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Subscription Period</div>
                    <div className="text-sm text-gray-600">
                      <div>Start: {subscription ? (subscription.start_date || 'N/A') : 'N/A'}</div>
                      <div>End: {subscription ? (subscription.end_date || 'N/A') : 'N/A'}</div>
                    </div>
                  </div>

                  {/* Status, Renewals, Days Left, Amount */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription ? subscription.status : 'none')}`}>
                        {subscription ? (subscription.status_label || subscription.status || 'N/A') : 'No Subscription'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Renewals</div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.purchase_statistics ? user.purchase_statistics.total_purchases : 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Days Left</div>
                      {subscription ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          daysLeft > 7 ? 'bg-green-100 text-green-800' :
                          daysLeft > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          No Subscription
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Amount</div>
                      <div className="text-sm font-medium text-gray-900">
                        {subscription ? `₹${subscription.user_amount || subscription.plan_amount || 0}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {subscriptions.length === 0 && !loading && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          {renderPagination()}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.total_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">With Subscription</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.users_with_subscription || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.active_subscriptions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expired</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.expired_subscriptions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Without Subscription</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.users_without_subscription || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Yearly Plans</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.yearly_subscriptions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Monthly Plans</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.monthly_subscriptions || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;