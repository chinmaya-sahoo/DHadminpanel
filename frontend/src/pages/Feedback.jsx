import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  StarHalf,
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import apiService from '../services/api';
import { formatDate } from '../utils/dateUtils';

const Feedback = () => {
  // State management
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterFeedback, setFilterFeedback] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showStats, setShowStats] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(filterRating !== 'all' && { rating: filterRating }),
        ...(filterFeedback !== 'all' && { has_feedback: filterFeedback }),
        ...(searchQuery && { search: searchQuery })
      };

      const [ratingsResponse, statsResponse] = await Promise.all([
        apiService.getAllAppRatings(params),
        apiService.getAppRatingStats()
      ]);

      if (ratingsResponse.success) {
        setRatings(ratingsResponse.data?.ratings || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data || {});
      }
    } catch (err) {
      console.error('Error fetching app rating data:', err);
      setError(err.message || 'Failed to fetch app rating data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterRating, filterFeedback, searchQuery, itemsPerPage]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      const response = await apiService.deleteAppRating(ratingId);
      if (response.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting rating:', err);
      setError(err.message || 'Failed to delete rating');
    }
  };

  const exportToCSV = () => {
    if (ratings.length === 0) {
      alert('No data to export');
      return;
    }

    const csvHeaders = [
      'Rating ID',
      'User Name',
      'User Mobile',
      'User Email',
      'Rating',
      'Rating Stars',
      'Feedback Message',
      'Device Info',
      'Submitted At',
      'Has Feedback'
    ];

    const csvData = ratings.map(rating => [
      rating.rating_id || '',
      rating.user_name || '',
      rating.user_mobile || '',
      rating.user_email || '',
      rating.rating || '',
      rating.rating_stars || '',
      rating.feedback_message || '',
      rating.device_info ? JSON.stringify(rating.device_info) : '',
      formatDate(rating.submitted_at),
      rating.has_feedback ? 'Yes' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `app_ratings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 text-yellow-400 fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 2) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getDeviceIcon = (deviceInfo) => {
    if (!deviceInfo) return <Monitor className="w-4 h-4 text-gray-400" />;

    const device = deviceInfo.device?.toLowerCase();
    if (device === 'android' || device === 'ios') {
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    }
    return <Monitor className="w-4 h-4 text-gray-400" />;
  };

  // Loading component
  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">Loading app ratings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
          <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-sm sm:text-base text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">App Rating System</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage and analyze user ratings and feedback for the Daily Hisab app</p>
      </div>

      {/* Stats Cards */}
      {showStats && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Ratings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total_ratings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.average_rating || '0.0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">With Feedback</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.feedback_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Satisfaction Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.rating_distribution ?
                    Math.round(((stats.rating_distribution.five_star + stats.rating_distribution.four_star) / stats.total_ratings) * 100) || 0
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Distribution Chart */}
      {showStats && stats.rating_distribution && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Rating Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.rating_distribution[`${star}_star`] || 0;
              const percentage = stats.total_ratings ? Math.round((count / stats.total_ratings) * 100) : 0;
              return (
                <div key={star} className="text-center">
                  <div className="flex justify-center mb-2">
                    {renderStars(star)}
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by user name, mobile, email, or feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={filterFeedback}
                onChange={(e) => setFilterFeedback(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">All Feedback</option>
                <option value="true">With Feedback</option>
                <option value="false">Without Feedback</option>
              </select>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                <span className="sm:hidden">{showStats ? 'Hide' : 'Show'}</span>
              </button>

              <button
                onClick={exportToCSV}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export ({ratings.length})</span>
                <span className="sm:hidden">Export</span>
              </button>

              <button
                onClick={fetchData}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Ref</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ratings.map((rating) => (
                <tr key={rating.rating_id} className="hover:bg-gray-50">
                  {/* User Info */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(rating.user_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{rating.user_name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">{rating.user_mobile || 'No mobile'}</div>
                        <div className="text-sm text-gray-500">{rating.user_email || 'No email'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-3">
                        {renderStars(rating.rating)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(rating.rating)}`}>
                        {rating.rating}/5
                      </span>
                    </div>
                  </td>

                  {/* Feedback */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {rating.feedback_message ? (
                        <div>
                          <p className="truncate">{rating.feedback_message}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Has Feedback
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No feedback provided</span>
                      )}
                    </div>
                  </td>

                  {/* Device */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDeviceIcon(rating.device_info)}
                      <div className="ml-2">
                        <div className="text-sm text-gray-900">
                          {rating.device_info?.device || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rating.device_info?.version || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Submitted */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(rating.submitted_at)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRating(rating.rating_id)}
                        className="text-red-600 hover:text-red-900 p-1"
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

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {ratings.map((rating) => (
            <div key={rating.rating_id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
              <div className="space-y-3">
                {/* User Info and Rating */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {(rating.user_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{rating.user_name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{rating.user_mobile || 'No mobile'}</div>
                      <div className="text-xs text-gray-500">{rating.user_email || 'No email'}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex space-x-1 mb-1">
                      {renderStars(rating.rating)}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(rating.rating)}`}>
                      {rating.rating}/5
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  {rating.feedback_message ? (
                    <div>
                      <p className="text-sm text-gray-900 mb-2">{rating.feedback_message}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Has Feedback
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No feedback provided</span>
                  )}
                </div>

                {/* Device and Date */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    {getDeviceIcon(rating.device_info)}
                    <span className="ml-2">
                      {rating.device_info?.device || 'Unknown'} {rating.device_info?.version || ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(rating.submitted_at)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900 p-1">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRating(rating.rating_id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ratings.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No ratings found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {ratings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, ratings.length)} of {ratings.length} ratings
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs sm:text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={ratings.length < itemsPerPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
