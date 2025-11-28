import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Clock,
  Send,
  TrendingUp,
  Settings2,
  Users,
  Target,
  Calendar,
  BarChart3,
  RefreshCw,
  Play,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Image,
  Link,
  MessageSquare,
  Zap,
  Star,
  Gift,
  Heart,
  Mail,
  Activity,
  TrendingDown,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import apiService from "../services/api";

const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#fbbf24", "#a78bfa"];

export default function Notification() {
  // State management
  const [campaigns, setCampaigns] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({});
  const [systemStats, setSystemStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Campaign form data
  const [campaignData, setCampaignData] = useState({
    campaign_id: null,
    title: "",
    message: "",
    notification_type: "message",
    target_audience: "all_users",
  });

  // Filters and pagination
  const [filters, setFilters] = useState({
    status: "all",
    notification_type: "all",
    target_audience: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_campaigns: 0,
    limit: 10,
  });

  // Notification types configuration
  const notificationTypes = {
    reminder: { label: "Reminder", icon: Clock, color: "text-blue-600 bg-blue-50" },
    promotion: { label: "Promotion", icon: Gift, color: "text-orange-600 bg-orange-50" },
    festival_greeting: { label: "Festival Greeting", icon: Heart, color: "text-pink-600 bg-pink-50" },
    message: { label: "Message", icon: MessageSquare, color: "text-gray-600 bg-gray-50" },
  };

  // Target audience configuration
  const targetAudiences = {
    all_users: { label: "All Users", icon: Users, color: "text-blue-600" },
    monthly_subscribers: { label: "Monthly Subscribers", icon: Calendar, color: "text-green-600" },
    yearly_subscribers: { label: "Yearly Subscribers", icon: Star, color: "text-yellow-600" },
    free_users: { label: "Free Users", icon: Users, color: "text-gray-600" },
  };

  // Status configuration
  const statusConfig = {
    draft: { label: "Draft", color: "text-gray-600 bg-gray-100" },
    sent: { label: "Sent", color: "text-green-600 bg-green-100" },
  };

  // Fetch campaigns
  const fetchCampaigns = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...filters,
        ...params,
      };

      // Remove 'all' values from query params
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === "all" || queryParams[key] === "") {
          delete queryParams[key];
        }
      });

      const response = await apiService.getAllNotificationCampaigns(queryParams);
      console.log("Notification Campaigns API Response:", response);

      if (response && response.success) {
        setCampaigns(response.data.campaigns || []);
        setPagination((prev) => response.data.pagination || prev);
      } else {
        setError("Failed to fetch notification campaigns");
        setCampaigns([]);
      }
    } catch (err) {
      console.error("Error fetching notification campaigns:", err);
      setError(err.message || "Failed to fetch notification campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page, pagination.limit]);

  // Fetch performance stats
  const fetchPerformanceStats = useCallback(async () => {
    try {
      const response = await apiService.getNotificationPerformanceStats({ days: 30 });
      if (response && response.success) {
        setPerformanceStats(response.data || {});
      }
    } catch (err) {
      console.error("Error fetching performance stats:", err);
    }
  }, []);

  // Fetch system stats
  const fetchSystemStats = useCallback(async () => {
    try {
      const response = await apiService.getNotificationSystemStats();
      if (response && response.success) {
        setSystemStats(response.data || {});
      }
    } catch (err) {
      console.error("Error fetching system stats:", err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCampaigns();
    fetchPerformanceStats();
    fetchSystemStats();
  }, [fetchCampaigns, fetchPerformanceStats, fetchSystemStats]);

  // Handle filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchCampaigns();
  }, [filters]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
    fetchCampaigns({ page: newPage });
  };

  // Create campaign
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.createNotificationCampaign(campaignData);
      console.log("Create Campaign Response:", response);

      if (response && response.success) {
        setSuccess("Campaign created successfully");
        setShowCreateModal(false);
        setIsEditMode(false);
        setCampaignData({
          campaign_id: null,
          title: "",
          message: "",
          notification_type: "message",
          target_audience: "all_users",
        });
        fetchCampaigns();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.msg?.[0] || "Failed to create campaign");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError(err.message || "Failed to create campaign");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Send campaign
  const handleSendCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.sendNotificationCampaign(selectedCampaign.campaign_id);
      console.log("Send Campaign Response:", response);

      if (response && response.success) {
        setSuccess(`Campaign sent successfully to ${response.data.total_sent} users`);
        setShowSendModal(false);
        setSelectedCampaign(null);
        fetchCampaigns();
        fetchPerformanceStats();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.msg?.[0] || "Failed to send campaign");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error sending campaign:", err);
      setError(err.message || "Failed to send campaign");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit campaign
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setIsEditMode(true);
    setCampaignData({
      campaign_id: campaign.campaign_id,
      title: campaign.title || "",
      message: campaign.message || "",
      notification_type: campaign.notification_type || "message",
      target_audience: campaign.target_audience || "all_users",
    });
    setShowCreateModal(true);
  };

  // Update campaign
  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.updateNotificationCampaign(campaignData);
      console.log("Update Campaign Response:", response);

      if (response && response.success) {
        setSuccess("Campaign updated successfully");
        setShowCreateModal(false);
        setIsEditMode(false);
        setSelectedCampaign(null);
        setCampaignData({
          campaign_id: null,
          title: "",
          message: "",
          notification_type: "message",
          target_audience: "all_users",
        });
        fetchCampaigns();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.msg?.[0] || "Failed to update campaign");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error updating campaign:", err);
      setError(err.message || "Failed to update campaign");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete campaign
  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.deleteNotificationCampaign(selectedCampaign.campaign_id);
      console.log("Delete Campaign Response:", response);

      if (response && response.success) {
        setSuccess("Campaign deleted successfully");
        setShowDeleteModal(false);
        setSelectedCampaign(null);
        fetchCampaigns();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.msg?.[0] || "Failed to delete campaign");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setError(err.message || "Failed to delete campaign");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Render notification type badge
  const renderNotificationTypeBadge = (type) => {
    const config = notificationTypes[type];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Render target audience badge
  const renderTargetAudienceBadge = (audience) => {
    const config = targetAudiences[audience];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = statusConfig[status];
    if (!config) return null;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !campaign.title?.toLowerCase().includes(searchLower) &&
        !campaign.message?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          Notification Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              fetchCampaigns();
              fetchPerformanceStats();
              fetchSystemStats();
            }}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={14} className={`sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Ref</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Create Campaign</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* System Stats */}
      {systemStats && Object.keys(systemStats).length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">System Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active Users</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{systemStats.total_active_users || 0}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Device Tokens</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{systemStats.total_device_tokens || 0}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Users with Tokens</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{systemStats.users_with_tokens || 0}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Yearly Subscribers</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{systemStats.yearly_subscribers || 0}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Monthly Subscribers</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{systemStats.monthly_subscribers || 0}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Free Users</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{systemStats.free_users || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search campaigns..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notification Type</label>
            <select
              value={filters.notification_type}
              onChange={(e) => setFilters({ ...filters, notification_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="reminder">Reminder</option>
              <option value="promotion">Promotion</option>
              <option value="festival_greeting">Festival Greeting</option>
              <option value="message">Message</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <select
              value={filters.target_audience}
              onChange={(e) => setFilters({ ...filters, target_audience: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Audiences</option>
              <option value="all_users">All Users</option>
              <option value="monthly_subscribers">Monthly Subscribers</option>
              <option value="yearly_subscribers">Yearly Subscribers</option>
              <option value="free_users">Free Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading && campaigns.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">No campaigns found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <table className="hidden lg:table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Audience
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{campaign.message}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renderNotificationTypeBadge(campaign.notification_type)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renderTargetAudienceBadge(campaign.target_audience)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{renderStatusBadge(campaign.status)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {campaign.createtime || "N/A"}
                        {campaign.sendtime && (
                          <div className="text-gray-400 mt-1">Sent: {campaign.sendtime}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {campaign.status === "draft" && (
                            <>
                              <button
                                onClick={() => handleEditCampaign(campaign)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit Campaign"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Campaign"
                              >
                                <Trash2 size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setShowSendModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                                title="Send Campaign"
                              >
                                <Send size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <div key={campaign.campaign_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 flex-1">{campaign.title}</h3>
                      {renderStatusBadge(campaign.status)}
                    </div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{campaign.message}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {renderNotificationTypeBadge(campaign.notification_type)}
                      {renderTargetAudienceBadge(campaign.target_audience)}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Created: {campaign.createtime || "N/A"}
                      {campaign.sendtime && <div>Sent: {campaign.sendtime}</div>}
                    </div>
                    {campaign.status === "draft" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center gap-2"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowSendModal(true);
                          }}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center justify-center gap-2"
                        >
                          <Send size={14} />
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-700">
              Showing page {pagination.current_page} of {pagination.total_pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                className="px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Notification Campaign" : "Create Notification Campaign"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setIsEditMode(false);
                  setSelectedCampaign(null);
                  setCampaignData({
                    campaign_id: null,
                    title: "",
                    message: "",
                    notification_type: "message",
                    target_audience: "all_users",
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleUpdateCampaign : handleCreateCampaign} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={campaignData.title}
                  onChange={(e) => setCampaignData({ ...campaignData, title: e.target.value })}
                  required
                  maxLength={255}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter campaign title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={campaignData.message}
                  onChange={(e) => setCampaignData({ ...campaignData, message: e.target.value })}
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notification message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
                <select
                  value={campaignData.notification_type}
                  onChange={(e) => setCampaignData({ ...campaignData, notification_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="reminder">Reminder</option>
                  <option value="promotion">Promotion</option>
                  <option value="festival_greeting">Festival Greeting</option>
                  <option value="message">Message</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={campaignData.target_audience}
                  onChange={(e) => setCampaignData({ ...campaignData, target_audience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all_users">All Users</option>
                  <option value="monthly_subscribers">Monthly Subscribers</option>
                  <option value="yearly_subscribers">Yearly Subscribers</option>
                  <option value="free_users">Free Users</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Campaign" : "Create Campaign")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setIsEditMode(false);
                    setSelectedCampaign(null);
                    setCampaignData({
                      campaign_id: null,
                      title: "",
                      message: "",
                      notification_type: "message",
                      target_audience: "all_users",
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Campaign Modal */}
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Delete Campaign</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCampaign(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-red-800 font-medium mb-2">Warning: This action cannot be undone!</p>
                <p className="text-xs sm:text-sm text-red-700">
                  You are about to permanently delete this campaign. This action cannot be reversed.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Campaign:</p>
                <p className="text-base font-medium text-gray-900">{selectedCampaign.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Target Audience:</p>
                <p className="text-sm text-gray-900">
                  {targetAudiences[selectedCampaign.target_audience]?.label || selectedCampaign.target_audience}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                  onClick={handleDeleteCampaign}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Deleting..." : "Delete Campaign"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCampaign(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Campaign Modal */}
      {showSendModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Send Campaign</h2>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setSelectedCampaign(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Campaign:</p>
                <p className="text-base font-medium text-gray-900">{selectedCampaign.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Target Audience:</p>
                <p className="text-sm text-gray-900">
                  {targetAudiences[selectedCampaign.target_audience]?.label || selectedCampaign.target_audience}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-yellow-800">
                  Are you sure you want to send this campaign? This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                  onClick={handleSendCampaign}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Sending..." : "Send Campaign"}
                </button>
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSelectedCampaign(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

