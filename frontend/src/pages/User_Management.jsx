import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Building,
  Briefcase,
  User,
  TrendingUp,
  DollarSign,
  X,
  AlertTriangle,
  Shield,
  ShieldOff,
  Save,
  UserCheck,
  UserX
} from 'lucide-react';
import apiService from '../services/api';
import { formatDate } from '../utils/dateUtils';

const UserManagement = () => {
  // API data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getAllUsersWithAccounts();

        if (response && response.success) {
          setUsers(Array.isArray(response.users) ? response.users : []);
          setTotalUsers(response.total_users || 0);
        } else {
          setError('Failed to fetch users data');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users data');
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const searchTerm = searchQuery || '';
      const userName = user.name || '';
      const userEmail = user.email || '';
      const userMobile = user.mobile || '';

      const matchesSearch =
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userMobile.includes(searchTerm);

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'active' && user.active_flag === 1) ||
        (filterType === 'inactive' && user.active_flag === 0) ||
        (filterType === 'complete' && user.profile_complete === 1) ||
        (filterType === 'incomplete' && user.profile_complete === 0);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'created':
          return new Date(b.createtime || 0) - new Date(a.createtime || 0);
        case 'accounts':
          return (b.account_counts?.total || 0) - (a.account_counts?.total || 0);
        default:
          return 0;
      }
    });

  // Get account type icon
  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'personal':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'business':
        return <Building className="w-4 h-4 text-green-500" />;
      case 'freelance':
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get account type color
  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-100 text-blue-800';
      case 'business':
        return 'bg-green-100 text-green-800';
      case 'freelance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  // Export filtered users to CSV
  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare CSV data
    const csvHeaders = [
      'User ID',
      'Name',
      'Email',
      'Mobile',
      'Phone Code',
      'Status',
      'Profile Complete',
      'Personal Accounts',
      'Business Accounts',
      'Freelance Accounts',
      'Total Accounts',
      'Created Date'
    ];

    const csvData = filteredUsers.map(user => [
      user.user_id || '',
      user.name || '',
      user.email || '',
      user.mobile || '',
      user.phone_code || '',
      user.active_flag === 1 ? 'Active' : 'Inactive',
      user.profile_complete === 1 ? 'Complete' : 'Incomplete',
      user.account_counts?.personal || 0,
      user.account_counts?.business || 0,
      user.account_counts?.freelance || 0,
      user.account_counts?.total || 0,
      formatDate(user.createtime)
    ]);

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    // Generate filename based on current filter
    const filterSuffix = filterType === 'all' ? 'all' : filterType;
    const searchSuffix = searchQuery ? `_search_${searchQuery.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    const filename = `users_${filterSuffix}${searchSuffix}_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler functions
  const handleViewUser = async (user) => {
    try {
      setIsLoadingDetails(true);
      setSelectedUser(user);
      setShowViewModal(true);

      // Fetch detailed user information
      const response = await apiService.getUserDetails(user.user_id);
      if (response.success) {
        setUserDetails(response.data);
      } else {
        setUserDetails(user); // Fallback to basic user data
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setUserDetails(user); // Fallback to basic user data
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setSuspensionReason('');
    setShowSuspendModal(true);
  };

  const handleUnsuspendUser = async (user) => {
    if (!window.confirm(`Are you sure you want to unsuspend ${user.name || 'this user'}?`)) {
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apiService.activateUser(user.user_id, 'User reactivated by admin');
      if (response.success) {
        // Refresh the users list
        const usersResponse = await apiService.getAllUsersWithAccounts();
        if (usersResponse && usersResponse.success) {
          setUsers(Array.isArray(usersResponse.users) ? usersResponse.users : []);
        }
        alert('User activated successfully');
      }
    } catch (err) {
      console.error('Error activating user:', err);
      alert('Failed to activate user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsDeleting(true);
      const response = await apiService.permanentlyDeleteUser(selectedUser.user_id);
      
      if (response && response.success) {
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(u => u.user_id !== selectedUser.user_id));
        setTotalUsers(prev => prev - 1);
        setShowDeleteModal(false);
        setSelectedUser(null);
        alert('User permanently deleted successfully');
      } else {
        alert(response?.msg?.[0] || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.msg?.[0] || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;

    try {
      setIsProcessing(true);
      const response = await apiService.suspendUser(selectedUser.user_id, suspensionReason);
      if (response.success) {
        // Refresh the users list
        const usersResponse = await apiService.getAllUsersWithAccounts();
        if (usersResponse && usersResponse.success) {
          setUsers(Array.isArray(usersResponse.users) ? usersResponse.users : []);
        }
        setShowSuspendModal(false);
        setSelectedUser(null);
        setSuspensionReason('');
        alert('User suspended successfully');
      }
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('Failed to suspend user');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowSuspendModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setUserDetails(null);
    setSuspensionReason('');
  };

  // Loading component
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading users data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage users and their account information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {users.filter(user => user.active_flag === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Profile Complete</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {users.filter(user => user.profile_complete === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {users.reduce((total, user) => total + (user.account_counts?.total || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="complete">Profile Complete</option>
              <option value="incomplete">Profile Incomplete</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="created">Sort by Created Date</option>
              <option value="accounts">Sort by Account Count</option>
            </select>

            <button
              onClick={exportToCSV}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export ({filteredUsers.length})</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading && filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accounts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                      {/* User Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                            <div className="text-sm text-gray-500">ID: {user.user_id || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email || 'No email'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone_code || ''} {user.mobile || 'No mobile'}
                        </div>
                      </td>

                      {/* User Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.user_type === 0 || user.user_type === '0'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.user_type_label || (user.user_type === 0 || user.user_type === '0' ? 'Manager' : 'User')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.active_flag === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {user.active_flag === 1 ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.profile_complete === 1
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {user.profile_complete === 1 ? 'Complete' : 'Incomplete'}
                          </span>
                        </div>
                      </td>

                      {/* Accounts */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.accounts && Object.entries(user.accounts).map(([type, accounts]) => (
                            accounts.length > 0 && (
                              <span
                                key={type}
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(type)}`}
                              >
                                {getAccountTypeIcon(type)}
                                {type} ({accounts.length})
                              </span>
                            )
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {user.account_counts?.total || 0} accounts
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(user.createtime)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.active_flag === 1 ? (
                            <button
                              onClick={() => handleSuspendUser(user)}
                              className="text-orange-600 hover:text-orange-900 p-1"
                              title="Suspend User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnsuspendUser(user)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Unsuspend User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Permanently Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              {filteredUsers.map((user) => (
                <div key={user.user_id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{user.name || 'Unknown User'}</h3>
                          <span className="text-xs text-gray-500">ID: {user.user_id || 'N/A'}</span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1 mb-2">
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate">{user.email || 'No email'}</span>
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{user.phone_code || ''} {user.mobile || 'No mobile'}</span>
                          </div>
                        </div>

                        {/* User Type Badge */}
                        <div className="mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.user_type === 0 || user.user_type === '0'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.user_type_label || (user.user_type === 0 || user.user_type === '0' ? 'Manager' : 'User')}
                          </span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.active_flag === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {user.active_flag === 1 ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.profile_complete === 1
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {user.profile_complete === 1 ? 'Complete' : 'Incomplete'}
                          </span>
                        </div>

                        {/* Account Info */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {user.accounts && Object.entries(user.accounts).map(([type, accounts]) => (
                            accounts.length > 0 && (
                              <span
                                key={type}
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(type)}`}
                              >
                                {getAccountTypeIcon(type)}
                                {type} ({accounts.length})
                              </span>
                            )
                          ))}
                        </div>

                        {/* Created Date */}
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(user.createtime)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        title="View User Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.active_flag === 1 ? (
                        <button
                          onClick={() => handleSuspendUser(user)}
                          className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50"
                          title="Suspend User"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnsuspendUser(user)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                          title="Unsuspend User"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                        title="Permanently Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading user details...</span>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">User ID</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.user_id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-xs sm:text-sm text-gray-900">
                          {userDetails?.personal_info?.name ||
                            (userDetails?.personal_info?.f_name && userDetails?.personal_info?.l_name
                              ? `${userDetails.personal_info.f_name} ${userDetails.personal_info.l_name}`.trim()
                              : userDetails?.personal_info?.f_name || userDetails?.personal_info?.l_name || 'Not provided')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
                        <p className="text-xs sm:text-sm text-gray-900 break-all">{userDetails?.personal_info?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Mobile</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.personal_info?.mobile || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone Code</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.personal_info?.phone_code || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="text-xs sm:text-sm text-gray-900">
                          {userDetails?.personal_info?.dob
                            ? new Date(userDetails.personal_info.dob).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                            : 'Not provided'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Age</label>
                        <p className="text-xs sm:text-sm text-gray-900">
                          {userDetails?.personal_info?.age !== null && userDetails?.personal_info?.age !== undefined
                            ? `${userDetails.personal_info.age} years`
                            : userDetails?.personal_info?.dob
                            ? (() => {
                                const dobDate = new Date(userDetails.personal_info.dob);
                                const today = new Date();
                                let age = today.getFullYear() - dobDate.getFullYear();
                                const monthDiff = today.getMonth() - dobDate.getMonth();
                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                                  age--;
                                }
                                return `${age} years`;
                              })()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Gender</label>
                        <p className="text-xs sm:text-sm text-gray-900">
                          {userDetails?.personal_info?.gender === 1 ? 'Male' :
                            userDetails?.personal_info?.gender === 2 ? 'Female' :
                              userDetails?.personal_info?.gender === 3 ? 'Other' : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Account Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">User Type</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.account_info?.user_type_label || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Login Type</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.account_info?.login_type_label || 'App'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Status Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Active Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userDetails?.status_info?.active_flag === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {userDetails?.status_info?.active_status || (userDetails?.status_info?.active_flag === 1 ? 'Active' : 'Suspended')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Notifications</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userDetails?.status_info?.notification_status === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {userDetails?.status_info?.notification_status_label || (userDetails?.status_info?.notification_status === 1 ? 'Enabled' : 'Disabled')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">App Lock</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userDetails?.status_info?.app_lock_status === 1
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {userDetails?.status_info?.app_lock_status_label || (userDetails?.status_info?.app_lock_status === 1 ? 'Enabled' : 'Disabled')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Timestamps</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Created At</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.timestamps?.created_at || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Updated At</label>
                        <p className="text-xs sm:text-sm text-gray-900">{userDetails?.timestamps?.updated_at || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Information */}
                  {userDetails?.current_subscription && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Current Subscription</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">Plan Name</label>
                          <p className="text-xs sm:text-sm text-gray-900">{userDetails.current_subscription.plan_name}</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">Amount Paid</label>
                          <p className="text-xs sm:text-sm text-gray-900">₹{userDetails.current_subscription.amount_paid}</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">Start Date</label>
                          <p className="text-xs sm:text-sm text-gray-900">{userDetails.current_subscription.start_date}</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">End Date</label>
                          <p className="text-xs sm:text-sm text-gray-900">{userDetails.current_subscription.end_date}</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">Days Remaining</label>
                          <p className="text-xs sm:text-sm text-gray-900">{userDetails.current_subscription.days_remaining} days</p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userDetails.current_subscription.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {userDetails.current_subscription.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Statistics */}
                  {userDetails?.statistics && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">User Statistics</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-blue-600">{userDetails.statistics.total_transactions || 0}</div>
                          <div className="text-xs text-gray-600">Transactions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-green-600">{userDetails.statistics.total_customers || 0}</div>
                          <div className="text-xs text-gray-600">Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-purple-600">{userDetails.statistics.total_managers || 0}</div>
                          <div className="text-xs text-gray-600">Managers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-orange-600">{userDetails.statistics.total_feedback || 0}</div>
                          <div className="text-xs text-gray-600">Feedback</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-red-600">{userDetails.statistics.total_ratings || 0}</div>
                          <div className="text-xs text-gray-600">Ratings</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Accounts */}
                  {userDetails?.accounts && userDetails.accounts.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">User Accounts</h4>
                      <div className="space-y-2">
                        {userDetails.accounts.map((account, index) => (
                          <div key={account.account_id || index} className="flex justify-between items-center p-2 bg-white rounded border">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-xs sm:text-sm">{account.account_name}</span>
                              <span className="ml-2 text-xs text-gray-600">({account.account_type_label})</span>
                            </div>
                            <span className="text-xs text-gray-500">{account.created_at}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-4 sm:mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Suspend User</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Are you sure you want to suspend <strong>{selectedUser?.name || selectedUser?.personal_info?.name || 'this user'}</strong>?
                </p>
                <p className="text-xs text-gray-500">
                  User ID: {selectedUser?.user_id} | Mobile: {selectedUser?.mobile || selectedUser?.personal_info?.mobile || 'N/A'}
                </p>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Suspension Reason (Optional)
                </label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                  rows="3"
                  placeholder="Enter reason for suspension..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Suspending...</span>
                      <span className="sm:hidden">Suspending...</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      <span className="hidden sm:inline">Suspend User</span>
                      <span className="sm:hidden">Suspend</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                  Permanently Delete User
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-xs sm:text-sm text-red-800 font-medium mb-2">
                    ⚠️ Warning: This action cannot be undone!
                  </p>
                  <p className="text-xs text-red-700">
                    This will permanently delete the user and all their related data including:
                  </p>
                  <ul className="text-xs text-red-700 mt-2 ml-4 list-disc">
                    <li>User account and profile</li>
                    <li>All subscriptions</li>
                    <li>All accounts and transactions</li>
                    <li>All budgets and expenses</li>
                    <li>All udhari/customer data</li>
                    <li>All support tickets</li>
                    <li>All reminders and notifications</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    <strong>User Details:</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Name:</strong> {selectedUser?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>User ID:</strong> {selectedUser?.user_id}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Mobile:</strong> {selectedUser?.phone_code || ''} {selectedUser?.mobile || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Email:</strong> {selectedUser?.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Deleting...</span>
                      <span className="sm:hidden">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete Permanently</span>
                      <span className="sm:hidden">Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;