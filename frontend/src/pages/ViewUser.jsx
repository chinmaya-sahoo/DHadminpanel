import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Building,
  Briefcase
} from 'lucide-react';
import apiService from '../services/api';

// Helper component for User Avatar
const UserAvatar = ({ src, name, className, initialsSizeClass = "text-sm" }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (!src || imgError) {
    return (
      <div className={`rounded-full bg-blue-500 flex items-center justify-center ${className}`}>
        <span className={`text-white font-medium ${initialsSizeClass}`}>
          {(name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || 'User'}
      className={`rounded-full object-cover ${className}`}
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
    />
  );
};

const formatDOB = (dob) => {
  if (!dob) return 'N/A';
  // Handle YYYY-MM-DD string explicitly to treat as local date and avoid timezone shifts
  if (typeof dob === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    const [year, month, day] = dob.split('-');
    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return localDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return new Date(dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`admin/get_detailed_user_info?user_id=${id}`);
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError(response.data.msg || 'Failed to fetch user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'personal': return <User className="w-4 h-4 text-blue-500" />;
      case 'business': return <Building className="w-4 h-4 text-green-500" />;
      case 'freelance': return <Briefcase className="w-4 h-4 text-purple-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'freelance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin/user-management')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Users
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error || 'User not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/user-management')}
            className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>

            {/* Profile Photo */}
            <div className="flex justify-center mb-6">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                <UserAvatar
                  src={user.personal_info?.profile_photo}
                  name={user.personal_info?.name}
                  className="h-full w-full shadow-md border-4 border-white"
                  initialsSizeClass="text-2xl sm:text-3xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                <p className="text-gray-900 font-medium">{user.user_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{user.personal_info?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <div className="flex items-center text-gray-900">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {user.personal_info?.email || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile</label>
                <div className="flex items-center text-gray-900">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {user.personal_info?.phone_code} {user.personal_info?.mobile || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDOB(user.personal_info?.dob)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Age / Gender</label>
                <p className="text-gray-900">
                  {user.personal_info?.age ? `${user.personal_info.age} years` : 'N/A'} • {user.personal_info?.gender === 1 ? 'Male' : user.personal_info?.gender === 2 ? 'Female' : 'Other'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Account Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User Type</label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.account_info?.user_type_label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Registered At</label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.timestamps?.created_at}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Status Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Active Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status_info?.active_flag === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status_info?.active_status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Notifications</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status_info?.notification_status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status_info?.notification_status_label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">App Lock</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status_info?.app_lock_status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status_info?.app_lock_status_label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Current Subscription</h2>
              {user.current_subscription ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg text-blue-600">{user.current_subscription.plan_name}</p>
                      <p className="text-sm text-gray-500">Plan Amount: ₹{user.current_subscription.plan_amount}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.current_subscription.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.current_subscription.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Amount Paid</p>
                      <p className="font-medium">₹{user.current_subscription.amount_paid}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Days Remaining</p>
                      <p className="font-medium">{user.current_subscription.days_remaining} days</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p className="font-medium">{user.current_subscription.start_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium">{user.current_subscription.end_date}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No active subscription found.</p>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">User Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{user.statistics?.total_transactions || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Transactions</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{user.statistics?.total_customers || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Customers</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{user.statistics?.total_managers || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Managers</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{user.statistics?.total_feedback || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Feedback</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">{user.statistics?.total_ratings || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Ratings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Created Accounts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">User Accounts</h2>
            {user.accounts && user.accounts.length > 0 ? (
              <div className="space-y-3">
                {user.accounts.map((acc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAccountTypeIcon(acc.account_type === 1 ? 'personal' : acc.account_type === 2 ? 'business' : 'freelance')}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{acc.account_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getAccountTypeColor(acc.account_type === 1 ? 'personal' : acc.account_type === 2 ? 'business' : 'freelance')}`}>
                          {acc.account_type_label}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{acc.created_at}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No accounts created.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;