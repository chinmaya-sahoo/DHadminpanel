import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Gift,
  TrendingUp,
  Download,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Award,
  BarChart3,
  Calendar,
  Filter,
  Search
} from "lucide-react";
import apiService from '../../services/api';

const ReferEarnManagement = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    limit: 50
  });

  // Fetch referral analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...(dateRange.start_date && { start_date: dateRange.start_date }),
        ...(dateRange.end_date && { end_date: dateRange.end_date })
      };

      const response = await apiService.getReferralAnalytics(params);

      if (response.success) {
        setAnalytics(response.data);
        setPagination(prev => ({
          ...prev,
          total_pages: response.data.pagination?.total_pages || 1
        }));
      } else {
        setError(response.msg?.[0] || 'Failed to fetch referral analytics');
      }
    } catch (err) {
      console.error('Error fetching referral analytics:', err);
      setError('Failed to fetch referral analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.limit, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Activate pending rewards
  const handleActivatePendingRewards = async () => {
    try {
      setLoading(true);
      const response = await apiService.activatePendingRewards();

      if (response.success) {
        setSuccess(`Successfully activated ${response.data.activated_rewards} pending rewards!`);
        setTimeout(() => setSuccess(''), 5000);
        await fetchAnalytics(); // Refresh data
      } else {
        setError(response.msg?.[0] || 'Failed to activate pending rewards');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      console.error('Error activating pending rewards:', err);
      setError('Failed to activate pending rewards. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Filter recent referrals
  const filteredReferrals = analytics?.recent_referrals?.filter(referral => {
    const matchesSearch = !searchTerm ||
      referral.referrer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referred_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referral_code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || referral.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }) || [];

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Export data
  const exportData = () => {
    if (!analytics?.recent_referrals) return;

    const csvContent = [
      ['Referral Code', 'Referrer Name', 'Referrer Email', 'Referred Name', 'Referred Email', 'Status', 'Created At'],
      ...analytics.recent_referrals.map(referral => [
        referral.referral_code,
        referral.referrer_name,
        referral.referrer_email,
        referral.referred_name,
        referral.referred_email,
        referral.status_label,
        referral.created_at
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referral_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading referral analytics...</span>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Refer & Earn Management</h2>
          <p className="text-gray-600">Manage referral program and track analytics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={handleActivatePendingRewards}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Activate Pending Rewards
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {analytics?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.statistics.total_referrals || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Successful</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.statistics.successful_referrals || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Rewards Given</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.statistics.total_rewards_given || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.statistics.total_referrals > 0
                    ? Math.round((analytics.statistics.successful_referrals / analytics.statistics.total_referrals) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search referrals..."
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
            <option value="All">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="expired">Expired</option>
          </select>

          <input
            type="date"
            placeholder="Start Date"
            value={dateRange.start_date}
            onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="date"
            placeholder="End Date"
            value={dateRange.end_date}
            onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Top Referrers */}
      {analytics?.top_referrers && analytics.top_referrers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} />
              Top Referrers
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.top_referrers.map((referrer, index) => (
                  <tr key={referrer.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{referrer.referrer_name}</div>
                        <div className="text-sm text-gray-500">{referrer.referrer_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{referrer.referral_code}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referrer.total_referrals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{referrer.referral_earnings || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Referrals */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar size={20} />
            Recent Referrals
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReferrals.map((referral) => (
                <tr key={referral.tracking_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{referral.referral_code}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{referral.referrer_name}</div>
                      <div className="text-sm text-gray-500">{referral.referrer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{referral.referred_name}</div>
                      <div className="text-sm text-gray-500">{referral.referred_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                      {referral.status_label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(referral.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReferrals.length === 0 && (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
            disabled={pagination.current_page === 1}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-sm text-gray-700">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>

          <button
            onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.total_pages, prev.current_page + 1) }))}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReferEarnManagement;
