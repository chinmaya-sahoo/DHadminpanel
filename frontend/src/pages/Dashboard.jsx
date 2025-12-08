import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Download,
  Upload,
  Headphones,
  UserPlus,
  Calendar,
  Filter,
  Eye,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import apiService from '../services/api';

const COLORS = ["#4ade80", "#3b82f6", "#6b7280", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

export default function Dashboard() {
  const navigate = useNavigate();

  // State for API data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [period, setPeriod] = useState("daily");
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalType, setUserModalType] = useState("");

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getDashboardData();

        if (response && response.success) {
          setDashboardData(response.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading component
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard data...</p>
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
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
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

  // If no data, show empty state
  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Dashboard Data</h3>
          <p className="text-gray-500">Unable to load dashboard information.</p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const {
    overview_stats = {},
    support_tickets = [],
    recent_subscribers = [],
    plans_validity_wise_users = {},
    analytics_overview = {}
  } = dashboardData;

  const {
    total_active_users = 0,
    daily_active_users = 0,
    monthly_active_users = 0,
    app_daily_installs = 0,
    daily_revenue = 0,
    monthly_revenue = 0,
    pending_tickets = 0,
    new_subscribers_today = 0
  } = overview_stats;

  // Get pie chart data from API response
  const pieChartData = plans_validity_wise_users?.pie_chart_data || {};
  const pieLabels = pieChartData.labels || [];
  const pieData = pieChartData.datasets?.[0]?.data || [];
  const pieColors = pieChartData.datasets?.[0]?.backgroundColor || COLORS;

  // Create user distribution for pie chart using API data
  const user_distribution = pieLabels.map((label, index) => ({
    name: label,
    value: pieData[index] || 0,
    percentage: pieData[index] > 0 ? Math.round((pieData[index] / pieData.reduce((sum, val) => sum + val, 0)) * 100) : 0
  }));

  // Get detailed plan data for cards
  const plansData = plans_validity_wise_users?.detailed_data || [];

  // Add total active users as a separate entry
  const totalActiveUsersEntry = {
    name: "Total Active Users",
    value: total_active_users,
    active_users: total_active_users,
    expired_users: 0,
    revenue: 0,
    subscription_type: "All",
    percentage: 100
  };

  // Calculate trend analysis from analytics_overview
  const trend_analysis = {
    monthly_data: analytics_overview.monthly?.map(item => ({
      name: item.time,
      installs: item.installs,
      revenue: item.revenue,
      upgrades: 0, // Not available in API
      uninstalls: 0 // Not available in API
    })) || []
  };

  const totalActiveUsers = total_active_users;
  const pendingTickets = pending_tickets;

  // Navigation functions
  const navigateToUserManagement = () => {
    navigate('/admin/user-management');
  };

  const navigateToSubscriptionPayments = () => {
    navigate('/admin/subscription-management');
  };

  const navigateToFeedbackSupport = () => {
    navigate('/admin/feedback-support');
  };

  const openUserModal = (type) => {
    setUserModalType(type);
    setShowUserModal(true);
  };

  const UserModal = () => {
    // Use recent_subscribers data for the modal
    const userData = recent_subscribers || [];
    const title = userModalType === "free" ? "Free Users" : "Subscribers";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-2xl font-bold truncate">{title} ({userData.length})</h2>
            <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-96">
            {/* Desktop Table View */}
            <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-4 font-semibold">ID</th>
                  <th className="text-left p-4 font-semibold">Mobile</th>
                  <th className="text-left p-4 font-semibold">Joined</th>
                  <th className="text-left p-4 font-semibold">Revenue</th>
                  <th className="text-left p-4 font-semibold">Plan</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">#{user.id || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{user.mobile_number || 'No mobile'}</td>
                    <td className="p-4 text-gray-600">{user.joined_at || 'Unknown'}</td>
                    <td className="p-4 text-gray-600">₹{user.revenue || 0}</td>
                    <td className="p-4 text-gray-600">{user.plan || 'No Plan'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {userData.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-gray-900 truncate flex-1 mr-2">
                        ID: #{user.id || 'N/A'}
                      </h4>
                      <span className="text-sm font-semibold text-green-600 flex-shrink-0">
                        ₹{user.revenue || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Mobile: {user.mobile_number || 'No mobile'}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="truncate">{user.plan || 'No Plan'}</span>
                      <span className="truncate ml-2">{user.joined_at || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Active Users */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToUserManagement}
          title="Click to view User Management"
        >
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm truncate">Total Active Users</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{totalActiveUsers.toLocaleString()}</h2>
          </div>
        </div>

        {/* DAU */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToUserManagement}
          title="Click to view User Management"
        >
          <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm truncate">DAU (Daily Active)</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{daily_active_users.toLocaleString()}</h2>
          </div>
        </div>

        {/* MAU */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToUserManagement}
          title="Click to view User Management"
        >
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm truncate">MAU (Monthly Active)</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{monthly_active_users.toLocaleString()}</h2>
          </div>
        </div>

        {/* Installations */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToUserManagement}
          title="Click to view User Management"
        >
          <Download className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm capitalize truncate">Installs (Daily)</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{app_daily_installs}</h2>
          </div>
        </div>

        {/* Revenue */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToSubscriptionPayments}
          title="Click to view Subscription Payments"
        >
          <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm capitalize truncate">Revenue (daily)</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">₹{daily_revenue}</h2>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToSubscriptionPayments}
          title="Click to view Subscription Payments"
        >
          <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm capitalize truncate">Revenue (Monthly)</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">₹{monthly_revenue}</h2>
          </div>
        </div>

        {/* Pending Support Tickets */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToFeedbackSupport}
          title="Click to view Feedback Support"
        >
          <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm truncate">Pending Tickets</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{pendingTickets}</h2>
          </div>
        </div>

        {/* Recent Subscribers */}
        <div
          className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={navigateToUserManagement}
          title="Click to view User Management"
        >
          <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs sm:text-sm truncate">New Subscribers (Today)</p>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{new_subscribers_today}</h2>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <AnalyticsOverview period={period} setPeriod={setPeriod} data={analytics_overview} />

      {/* Trend Analysis */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Trend Analysis (Monthly)</h3>
        <div className="h-64 sm:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend_analysis.monthly_data || []}>
            <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                fontSize={12}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                fontSize={12}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  fontSize: '12px',
                  padding: '8px'
                }}
              />
              <Line type="monotone" dataKey="installs" stroke="#3b82f6" strokeWidth={2} name="Installs" />
              <Line type="monotone" dataKey="upgrades" stroke="#4ade80" strokeWidth={2} name="Upgrades" />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="uninstalls" stroke="#f87171" strokeWidth={2} name="Uninstalls" />
              <Legend
                className="mt-4 sm:mt-6 lg:mt-10"
                wrapperStyle={{ fontSize: '12px' }}
              />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Subscription Plans Distribution</h3>

        {/* Main Content: Pie Chart Left, Plan Names & Management Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Left Side: Pie Chart */}
          <div className="h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={user_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name.split(' ')[0]} ${percentage || 0}%`}
                >
                  {user_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                  `${value} users (${props.payload.percentage}%)`,
                  props.payload.name
                  ]}
                  contentStyle={{
                    fontSize: '12px',
                    padding: '8px'
                  }}
                />
                <Legend
                  className="mt-2 sm:mt-4"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Right Side: Plan Names and Management Cards */}
          <div className="space-y-3 sm:space-y-4">
            {/* Management Cards */}
            <div className="space-y-3 mt-4 sm:mt-6">
              {/* Total Active Users Card */}
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Active Users</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700">
                  {totalActiveUsersEntry.value?.toLocaleString() || 0}
                </p>
              </div>

              {/* Clickable User Management Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="bg-blue-50 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-blue-100 transition-colors text-center"
                  onClick={() => openUserModal("subscribers")}
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">View Subscribers</p>
                  <p className="text-base sm:text-lg font-bold text-blue-600">
                    {recent_subscribers.length}
                  </p>
                </div>

                <div
                  className="bg-green-50 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-green-100 transition-colors text-center"
                  onClick={() => openUserModal("yearly")}
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Active Subscribers</p>
                  <p className="text-base sm:text-lg font-bold text-green-600">
                    {plansData.reduce((sum, plan) => sum + (plan.active_users || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Details Section - Flex Layout Below */}
        <div className="border-t pt-4 sm:pt-6">
          <h4 className="text-sm sm:text-md font-semibold text-gray-700 mb-3 sm:mb-4">Plan Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {user_distribution.map((plan, index) => {
              // Find corresponding detailed data for this plan
              const detailedPlan = plansData.find(p => p.plan_name === plan.name) || {};

              return (
                <div key={plan.name} className={`p-3 sm:p-4 rounded-xl border transition-colors ${plan.value > 0
                  ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}>
                  <div className="text-center mb-2 sm:mb-3">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mx-auto mb-1 sm:mb-2"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    ></div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 truncate">{plan.name}</p>
                    <p className="text-xs text-gray-500 truncate">{detailedPlan.subscription_type_label || 'Unknown'}</p>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Total Users</span>
                      <span className="text-xs sm:text-sm font-bold" style={{ color: pieColors[index % pieColors.length] }}>
                        {plan.value?.toLocaleString() || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Active</span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">
                        {detailedPlan.active_users || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Expired</span>
                      <span className="text-xs sm:text-sm font-semibold text-orange-600">
                        {detailedPlan.expired_users || 0}
                      </span>
                    </div>

                    {plan.percentage > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Share</span>
                        <span className="text-xs text-blue-600 font-medium">{plan.percentage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold">Support Tickets</h3>
          <button
            className="flex items-center gap-1 text-blue-500 hover:underline text-sm"
            onClick={() => window.location.href = '/admin/feedback-support'}
          >
            View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {support_tickets.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Subject</th>
                <th className="text-left py-2 pr-4">Priority</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="text-left py-2 pr-4">User</th>
                <th className="text-left py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {support_tickets.slice(0, 4).map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium text-sm">{ticket.subject || 'No subject'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${ticket.priority === 4 ? 'bg-red-100 text-red-800' :
                      ticket.priority === 3 ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                      {ticket.priority === 4 ? 'Urgent' :
                        ticket.priority === 3 ? 'High' :
                          ticket.priority === 2 ? 'Medium' :
                            ticket.priority === 1 ? 'Low' : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${ticket.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 1 ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 2 ? 'bg-orange-100 text-orange-800' :
                          ticket.status === 3 ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {ticket.status === 0 ? 'Pending' :
                        ticket.status === 1 ? 'In Progress' :
                          ticket.status === 2 ? 'Open' :
                            ticket.status === 3 ? 'Resolved' : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 text-sm">{ticket.user_email || 'Unknown'}</td>
                  <td className="py-3 text-gray-500 text-sm">{ticket.created_at || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p>No support tickets found</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {support_tickets.length > 0 ? (
            support_tickets.slice(0, 4).map((ticket) => (
            <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm text-gray-900 truncate flex-1 mr-2">
                  {ticket.subject || 'No subject'}
                </h4>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${ticket.priority === 4 ? 'bg-red-100 text-red-800' :
                    ticket.priority === 3 ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {ticket.priority === 4 ? 'Urgent' :
                      ticket.priority === 3 ? 'High' :
                        ticket.priority === 2 ? 'Medium' :
                          ticket.priority === 1 ? 'Low' : 'Unknown'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${ticket.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 1 ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 2 ? 'bg-orange-100 text-orange-800' :
                        ticket.status === 3 ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                    {ticket.status === 0 ? 'Pending' :
                      ticket.status === 1 ? 'In Progress' :
                        ticket.status === 2 ? 'Open' :
                          ticket.status === 3 ? 'Resolved' : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p className="truncate">{ticket.user_email || 'Unknown'}</p>
                <p className="text-gray-500 mt-1">{ticket.created_at || 'Unknown'}</p>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p>No support tickets found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold">Recent Subscribers</h3>
          <button
            className="flex items-center gap-1 text-blue-500 hover:underline text-sm"
            onClick={() => window.location.href = '/admin/subscription-management'}
          >
            View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {recent_subscribers.slice(0, 5).map((subscriber) => (
            <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0 flex-1 mr-3">
                <p className="font-medium text-sm sm:text-base truncate">ID: #{subscriber.id || 'N/A'}</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Mobile: {subscriber.mobile_number || 'No mobile'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-green-600 text-sm sm:text-base">₹{subscriber.revenue || 0}</p>
                <p className="text-xs text-gray-500 truncate max-w-32 sm:max-w-none">{subscriber.plan || 'No Plan'} • {subscriber.joined_at || 'Unknown'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && <UserModal />}
    </div>
  );
}

export function AnalyticsOverview({ period, setPeriod, data }) {
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const getCurrentData = () => {
    if (period !== "custom") return data[period] || [];
    if (!customFrom || !customTo) return [];
    return (data.custom || []).filter((d) => d.time >= customFrom && d.time <= customTo);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h3 className="text-base sm:text-lg font-semibold">Analytics Overview</h3>
        <div className="flex gap-1 sm:gap-2 items-center overflow-x-scroll md:overflow-x-auto">
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm capitalize whitespace-nowrap ${period === p
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPeriod("custom")}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap ${period === "custom"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Custom Date Filter */}
      {period === "custom" && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs sm:text-sm text-gray-600 block mb-1">From</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs sm:text-sm text-gray-600 block mb-1">To</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={getCurrentData()}>
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                fontSize: '12px',
                padding: '8px'
              }}
            />
          <Area
            type="monotone"
            dataKey="installs"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stackId="2"
            stroke="#4ade80"
            fill="#4ade80"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}