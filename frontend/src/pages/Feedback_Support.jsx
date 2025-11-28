import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Filter,
  BarChart3,
  AlertTriangle,
  Zap,
  Minus,
  ArrowUp,
  Bell,
  Eye,
  EyeOff,
  X,
  Search,
  Trash2,
  Edit,
  RefreshCw,
  Download,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Image,
} from "lucide-react";
import apiService from "../services/api";
import { formatDate } from "../utils/dateUtils";

const Feedback_Support = () => {
  // State management
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filters and pagination
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category_id: 'all',
    search: '',
    include_deleted: false
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_tickets: 0,
    limit: 20,
    has_next: false,
    has_prev: false
  });

  // UI state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    support_ticket_id: '',
    status: '',
    admin_notes: ''
  });

  // Priority levels with colors and icons
  const priorityConfig = {
    1: { label: "Low", color: "text-green-600 bg-green-50 border-green-200", icon: Clock },
    2: { label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Minus },
    3: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200", icon: ArrowUp },
    4: { label: "Urgent", color: "text-red-600 bg-red-50 border-red-200", icon: AlertTriangle },
  };

  // Status configuration
  const statusConfig = {
    0: { label: "Pending", color: "text-yellow-600 bg-yellow-50", icon: Clock },
    1: { label: "In Progress", color: "text-blue-600 bg-blue-50", icon: RefreshCw },
    2: { label: "Open", color: "text-orange-600 bg-orange-50", icon: AlertCircle },
    3: { label: "Resolved", color: "text-green-600 bg-green-50", icon: CheckCircle },
  };

  // Category configuration
  const categoryConfig = {
    1: "General",
    2: "Technical Issue",
    3: "Account & Login",
    4: "Payment & Billing",
    5: "Data & Backup",
    6: "Feature Request",
    7: "Bug Report",
    8: "Other"
  };

  // Fetch support tickets
  const fetchTickets = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...filters,
        ...params
      };

      // Remove 'all' values from query params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all' || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await apiService.getAllSupportTickets(queryParams);
      console.log('Support Tickets API Response:', response);

      if (response && response.success) {
        setTickets(response.data.tickets || []);
        setPagination(response.data.pagination || pagination);
      } else {
        setError('Failed to fetch support tickets');
        setTickets([]);
      }
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError(err.message || 'Failed to fetch support tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page, pagination.limit]);

  // Fetch support ticket statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiService.getSupportTicketStats({ period: 30 });
      console.log('Support Stats API Response:', response);

      if (response && response.success) {
        setStats(response.data || {});
      }
    } catch (err) {
      console.error('Error fetching support stats:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets, fetchStats]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== '') {
        fetchTickets();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search, fetchTickets]);

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const response = await apiService.updateSupportTicketStatus(statusUpdateData);

      if (response && response.success) {
        setSuccess('Ticket status updated successfully');
        setShowStatusModal(false);
        setStatusUpdateData({ support_ticket_id: '', status: '', admin_notes: '' });
        fetchTickets(); // Refresh tickets
      } else {
        setError('Failed to update ticket status');
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };

  // Handle ticket deletion
  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this support ticket?')) {
      try {
        setLoading(true);
        const response = await apiService.deleteSupportTicket(ticketId);

        if (response && response.success) {
          setSuccess('Support ticket deleted successfully');
          fetchTickets(); // Refresh tickets
        } else {
          setError('Failed to delete support ticket');
        }
      } catch (err) {
        console.error('Error deleting support ticket:', err);
        setError(err.response?.data?.msg?.[0] || err.message || 'Failed to delete support ticket');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle ticket details view
  const handleViewDetails = async (ticketId) => {
    try {
      setLoading(true);
      const response = await apiService.getSupportTicketDetails(ticketId);

      if (response && response.success) {
        setSelectedTicket(response.data);
        setShowTicketDetails(true);
      } else {
        setError('Failed to fetch ticket details');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 })); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      category_id: 'all',
      search: '',
      include_deleted: false
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Open status update modal
  const openStatusModal = (ticket) => {
    setStatusUpdateData({
      support_ticket_id: ticket.support_ticket_id,
      status: ticket.status,
      admin_notes: ''
    });
    setShowStatusModal(true);
  };


  // Render priority badge
  const renderPriorityBadge = (priority) => {
    const config = priorityConfig[priority];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = statusConfig[status];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Export tickets to CSV
  const exportTickets = () => {
    const csvContent = [
      ['Ticket ID', 'User', 'Email', 'Description', 'Priority', 'Status', 'Category', 'Created At'],
      ...tickets.map(ticket => [
        ticket.support_ticket_id,
        ticket.user_name || 'N/A',
        ticket.user_email || 'N/A',
        ticket.description || 'N/A',
        priorityConfig[ticket.priority]?.label || 'N/A',
        statusConfig[ticket.status]?.label || 'N/A',
        categoryConfig[ticket.category_id] || 'N/A',
        formatDate(ticket.createtime)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support_tickets_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg bg-red-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <AlertCircle size={14} className="sm:w-4 sm:h-4" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <CheckCircle size={14} className="sm:w-4 sm:h-4" />
            {success}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          Support Tickets
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => fetchTickets()}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={14} className={`sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Ref</span>
          </button>
          <button
            onClick={exportTickets}
            className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats.overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.overview.total_tickets || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Tickets</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.status_distribution?.pending || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.status_distribution?.in_progress || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.status_distribution?.resolved || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Resolved</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.priority_distribution?.urgent || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Urgent</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.priority_distribution?.high || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">High Priority</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="0">Pending</option>
            <option value="1">In Progress</option>
            <option value="2">Open</option>
            <option value="3">Resolved</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryConfig).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>

        {/* Include Deleted - Separate Row */}
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include_deleted"
              checked={filters.include_deleted}
              onChange={(e) => handleFilterChange('include_deleted', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="include_deleted" className="text-xs sm:text-sm text-gray-700">
              Include Deleted
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
          <button
            onClick={clearFilters}
            className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Clear Filters</span>
            <span className="sm:hidden">Clear</span>
          </button>
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
            Showing {tickets.length} of {pagination.total_tickets} tickets
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm sm:text-base text-gray-600">Loading tickets...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.support_ticket_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        #{ticket.support_ticket_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.user_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{ticket.user_email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-sm text-gray-900 truncate" title={ticket.description}>
                          {ticket.description || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {renderPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-4 py-3">
                        {renderStatusBadge(ticket.status)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {categoryConfig[ticket.category_id] || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500">
                          <div className="font-medium">{formatDate(ticket.createtime)}</div>
                          <div className="text-xs text-gray-400">{ticket.created_ago}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(ticket.support_ticket_id)}
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={() => openStatusModal(ticket)}
                            className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium transition-colors"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(ticket.support_ticket_id)}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                          >
                            <Trash2 size={12} />
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
              {tickets.map((ticket) => (
                <div key={ticket.support_ticket_id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
                  <div className="space-y-3">
                    {/* Header with ID and badges */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">#{ticket.support_ticket_id}</span>
                        {renderPriorityBadge(ticket.priority)}
                        {renderStatusBadge(ticket.status)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleViewDetails(ticket.support_ticket_id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => openStatusModal(ticket)}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.support_ticket_id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.user_name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{ticket.user_email || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm text-gray-900" title={ticket.description}>
                        {ticket.description || 'N/A'}
                      </p>
                    </div>

                    {/* Category and Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{categoryConfig[ticket.category_id] || 'N/A'}</span>
                      <div className="text-right">
                        <div className="font-medium">{formatDate(ticket.createtime)}</div>
                        <div>{ticket.created_ago}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tickets.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4">
              <MessageSquare size={40} className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={!pagination.has_prev}
            className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-2 sm:px-3 py-2 rounded-lg text-sm ${page === pagination.current_page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={!pagination.has_next}
            className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Update Ticket Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusUpdateData.status}
                  onChange={(e) => setStatusUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="0">Pending</option>
                  <option value="1">In Progress</option>
                  <option value="2">Open</option>
                  <option value="3">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={statusUpdateData.admin_notes}
                  onChange={(e) => setStatusUpdateData(prev => ({ ...prev, admin_notes: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  rows={3}
                  placeholder="Add notes about the status update..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Ticket Details</h3>
              <button
                onClick={() => setShowTicketDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-sm sm:text-base">User Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">{selectedTicket.user_info?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-medium">{selectedTicket.user_info?.email || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Mobile:</span>
                    <div className="font-medium">{selectedTicket.user_info?.mobile || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone Code:</span>
                    <div className="font-medium">{selectedTicket.user_info?.phone_code || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-sm sm:text-base">Ticket Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-xs sm:text-sm">Description:</span>
                    <div className="mt-1 text-xs sm:text-sm">{selectedTicket.ticket_info?.description || 'N/A'}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Priority:</span>
                      <div className="mt-1">{renderPriorityBadge(selectedTicket.ticket_info?.priority)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
                      <div className="mt-1">{renderStatusBadge(selectedTicket.ticket_info?.status)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Category:</span>
                      <div className="mt-1 text-xs sm:text-sm">{categoryConfig[selectedTicket.ticket_info?.category_id] || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Created:</span>
                      <div className="mt-1 text-xs sm:text-sm">{formatDate(selectedTicket.createtime)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              {selectedTicket.ticket_info?.screenshot_url && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Screenshot</h4>
                  <img
                    src={selectedTicket.ticket_info.screenshot_url}
                    alt="Ticket Screenshot"
                    className="max-w-full h-auto rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTicketDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTicketDetails(false);
                  openStatusModal({
                    support_ticket_id: selectedTicket.support_ticket_id,
                    status: selectedTicket.ticket_info?.status
                  });
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm sm:text-base"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback_Support;