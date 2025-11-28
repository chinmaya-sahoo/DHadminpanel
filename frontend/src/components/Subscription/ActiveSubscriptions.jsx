import React, { useState, useEffect } from "react";
import { Calendar, Users, Search, Filter, Download, Loader2, AlertCircle } from "lucide-react";
import apiService from '../../services/api';

const ActiveSubscriptions = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [expiringUsers, setExpiringUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch comprehensive stats on component mount
  useEffect(() => {
    fetchComprehensiveStats();
  }, []);

  const fetchComprehensiveStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getComprehensiveStats();

      if (response && response.success) {
        setStats(response.data.summary);
        setUsers(response.data.users || []);
        setExpiringUsers(response.data.expiring_users_details || []);
      } else {
        setError(response?.message || 'Failed to fetch subscription data');
      }
    } catch (err) {
      console.error('Error fetching comprehensive stats:', err);
      setError('Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_mobile?.includes(searchTerm);

    const matchesPlan = planFilter === 'All' ||
      user.current_active_plan?.subscription_type_label === planFilter;

    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Active' && user.has_active_subscription) ||
      (statusFilter === 'Expired' && !user.has_active_subscription) ||
      (statusFilter === 'Expiring Soon' && user.subscription_expires_soon);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Get unique plan types for filter
  const planTypes = ['All', ...new Set(users.map(user => user.current_active_plan?.subscription_type_label).filter(Boolean))];

  const exportSubscriptions = () => {
    const csvContent = [
      ['User ID', 'Name', 'Email', 'Mobile', 'Plan Name', 'Plan Type', 'Amount', 'Start Date', 'End Date', 'Days Left', 'Status', 'Total Actions'],
      ...filteredUsers.map(user => [
        user.user_id,
        user.user_name || 'N/A',
        user.user_email || 'N/A',
        user.user_mobile || 'N/A',
        user.current_active_plan?.plan_name || 'No Plan',
        user.current_active_plan?.subscription_type_label || 'N/A',
        user.current_active_plan?.user_amount || 0,
        user.current_active_plan?.start_date || 'N/A',
        user.current_active_plan?.end_date || 'N/A',
        user.current_active_plan?.days_left || 0,
        user.current_active_plan?.status_label || 'Inactive',
        user.total_actions || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'active_subscriptions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (user) => {
    if (!user.has_active_subscription) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>;
    }

    if (user.subscription_expires_soon) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Expiring Soon</span>;
    }

    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
  };

  const getDaysLeftBadge = (daysLeft) => {
    if (daysLeft > 7) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{daysLeft} days</span>;
    } else if (daysLeft > 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{daysLeft} days</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading subscription data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        <button
          onClick={exportSubscriptions}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_active_users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Users with Plans</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.users_with_plans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Expiring in 7 Days</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.users_expiring_in_7_days}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.total_revenue?.toLocaleString()}</p>
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
              placeholder="Search by name, email, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {planTypes.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Expiring Soon">Expiring Soon</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setPlanFilter('All');
              setStatusFilter('All');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.user_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.user_email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.user_phone_code} {user.user_mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.current_active_plan?.plan_name || 'No Plan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{user.current_active_plan?.user_amount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.current_active_plan?.start_date || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.current_active_plan?.end_date || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.current_active_plan?.days_left ?
                      getDaysLeftBadge(user.current_active_plan.days_left) :
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">N/A</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.total_actions || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Expiring Users Alert */}
      {expiringUsers.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Users with Expiring Subscriptions</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {expiringUsers.map((user, index) => (
                    <li key={index}>
                      {user.user_name} ({user.user_mobile}) - {user.current_active_plan?.plan_name}
                      expires in {user.current_active_plan?.days_left} days
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSubscriptions;