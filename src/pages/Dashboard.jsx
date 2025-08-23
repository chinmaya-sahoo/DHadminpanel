import React, { useState } from "react";
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

// Enhanced sample data for trend analysis
const trendData = [
  { name: "Jan", installs: 2400, upgrades: 400, revenue: 12000, uninstalls: 240 },
  { name: "Feb", installs: 1398, upgrades: 300, revenue: 9800, uninstalls: 180 },
  { name: "Mar", installs: 3800, upgrades: 600, revenue: 18500, uninstalls: 320 },
  { name: "Apr", installs: 3908, upgrades: 780, revenue: 22000, uninstalls: 290 },
  { name: "May", installs: 4800, upgrades: 890, revenue: 28500, uninstalls: 410 },
  { name: "Jun", installs: 3800, upgrades: 720, revenue: 25200, uninstalls: 350 },
  { name: "Jul", installs: 5200, upgrades: 950, revenue: 31000, uninstalls: 380 },
];

// Daily/Weekly/Monthly activity data
const dailyData = [
  { time: "00:00", installs: 45, revenue: 1200 },
  { time: "06:00", installs: 78, revenue: 2100 },
  { time: "12:00", installs: 125, revenue: 3500 },
  { time: "18:00", installs: 98, revenue: 2800 },
];

const weeklyData = [
  { time: "Mon", installs: 850, revenue: 18500 },
  { time: "Tue", installs: 920, revenue: 21000 },
  { time: "Wed", installs: 1100, revenue: 25200 },
  { time: "Thu", installs: 980, revenue: 22800 },
  { time: "Fri", installs: 1250, revenue: 28000 },
  { time: "Sat", installs: 750, revenue: 16500 },
  { time: "Sun", installs: 650, revenue: 14200 },
];

const monthlyData = [
  { time: "Week 1", installs: 6500, revenue: 146200 },
  { time: "Week 2", installs: 7200, revenue: 162800 },
  { time: "Week 3", installs: 6800, revenue: 158500 },
  { time: "Week 4", installs: 7500, revenue: 175000 },
];

// User distribution data
const userDistribution = [
  { name: "Active Paid Users", value: 2000 },
  { name: "Active Freemium Users", value: 3000 },
  { name: "Inactive Users", value: 1000 },
];

// Support tickets data
const supportTickets = [
  { id: 1, subject: "Payment Issue", priority: "High", status: "Open", user: "john@example.com", created: "2 hours ago" },
  { id: 2, subject: "Feature Request", priority: "Medium", status: "In Progress", user: "sarah@example.com", created: "5 hours ago" },
  { id: 3, subject: "Login Problem", priority: "High", status: "Open", user: "mike@example.com", created: "1 day ago" },
  { id: 4, subject: "Billing Question", priority: "Low", status: "Pending", user: "lisa@example.com", created: "2 days ago" },
];

// Recent subscribers data
const recentSubscribers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", plan: "Premium", joined: "2 hours ago", revenue: "₹999" },
  { id: 2, name: "Emma Wilson", email: "emma@example.com", plan: "Pro", joined: "4 hours ago", revenue: "₹1,999" },
  { id: 3, name: "David Chen", email: "david@example.com", plan: "Premium", joined: "6 hours ago", revenue: "₹999" },
  { id: 4, name: "Sophie Brown", email: "sophie@example.com", plan: "Enterprise", joined: "8 hours ago", revenue: "₹4,999" },
  { id: 5, name: "Ryan Davis", email: "ryan@example.com", plan: "Pro", joined: "12 hours ago", revenue: "₹1,999" },
];

// Mock detailed user lists
const freeUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Free User ${i + 1}`,
  email: `freeuser${i + 1}@example.com`,
  joined: `${Math.floor(Math.random() * 30) + 1} days ago`,
  lastActive: `${Math.floor(Math.random() * 7) + 1} days ago`,
}));

const freemiumUsers = Array.from({ length: 75 }, (_, i) => ({
  id: i + 1,
  name: `Freemium User ${i + 1}`,
  email: `freemiumuser${i + 1}@example.com`,
  joined: `${Math.floor(Math.random() * 60) + 1} days ago`,
  lastActive: `${Math.floor(Math.random() * 3) + 1} days ago`,
  usage: `${Math.floor(Math.random() * 80) + 20}%`,
}));

const COLORS = ["#4ade80", "#3b82f6", "#6b7280"];

const activityStats = {
  daily: { users: 346, installs: 120, revenue: 8500, change: +5 },
  weekly: { users: 2420, installs: 850, revenue: 46200, change: -3 },
  monthly: { users: 9850, installs: 3200, revenue: 185000, change: +12 },
};

// Separate MAU data
const mauStats = {
  current: 28500,
  change: +15,
};

export default function Dashboard() {
  const [period, setPeriod] = useState("daily");
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalType, setUserModalType] = useState("");
  const [dateRange, setDateRange] = useState("7days");

  const { users, installs, revenue, change } = activityStats[period];
  const totalActiveUsers = userDistribution.slice(0, 2).reduce((sum, user) => sum + user.value, 0);
  const pendingTickets = supportTickets.filter(t => t.status === "Open").length;

  const getCurrentData = () => {
    switch(period) {
      case "daily": return dailyData;
      case "weekly": return weeklyData;
      case "monthly": return monthlyData;
      default: return dailyData;
    }
  };

  const openUserModal = (type) => {
    setUserModalType(type);
    setShowUserModal(true);
  };

  const UserModal = () => {
    const userData = userModalType === "free" ? freeUsers : freemiumUsers;
    const title = userModalType === "free" ? "Free Users" : "Freemium Users";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">{title} ({userData.length})</h2>
            <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Joined</th>
                  <th className="text-left p-4 font-semibold">Last Active</th>
                  {userModalType === "freemium" && <th className="text-left p-4 font-semibold">Usage</th>}
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.joined}</td>
                    <td className="p-4 text-gray-600">{user.lastActive}</td>
                    {userModalType === "freemium" && <td className="p-4 text-gray-600">{user.usage}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Active Users */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Users className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Active Users</p>
            <h2 className="text-2xl font-bold">{totalActiveUsers.toLocaleString()}</h2>
          </div>
        </div>

        {/* DAU */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">DAU (Daily Active)</p>
            <h2 className="text-2xl font-bold">{activityStats.daily.users.toLocaleString()}</h2>
            <span className={`text-xs ${activityStats.daily.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {activityStats.daily.change >= 0 ? '+' : ''}{activityStats.daily.change}%
            </span>
          </div>
        </div>

        {/* MAU */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Users className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">MAU (Monthly Active)</p>
            <h2 className="text-2xl font-bold">{mauStats.current.toLocaleString()}</h2>
            <span className={`text-xs ${mauStats.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {mauStats.change >= 0 ? '+' : ''}{mauStats.change}%
            </span>
          </div>
        </div>

        {/* Installations */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Download className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm capitalize">Installs ({period})</p>
            <h2 className="text-2xl font-bold">{installs.toLocaleString()}</h2>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Wallet className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm capitalize">Revenue (daily)</p>
            <h2 className="text-2xl font-bold">₹{346}</h2>
          </div>
        </div>

      
        {/* Monthly Revenue  */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-orange-500" />
          <div>
            <p className="text-gray-500 text-sm capitalize">Revenue (Monthly)</p>
            <h2 className="text-2xl font-bold">₹{5600 }</h2>
            <span className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>

        {/* Pending Support Tickets */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Headphones className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Pending Tickets</p>
            <h2 className="text-2xl font-bold">{pendingTickets}</h2>
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <UserPlus className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">New Subscribers (24h)</p>
            <h2 className="text-2xl font-bold">{recentSubscribers.length}</h2>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  period === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Current Period Stats */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getCurrentData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="installs" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
            <Area type="monotone" dataKey="revenue" stackId="2" stroke="#4ade80" fill="#4ade80" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Trend Analysis (Monthly)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="installs" stroke="#3b82f6" strokeWidth={3} name="Installs" />
            <Line type="monotone" dataKey="upgrades" stroke="#4ade80" strokeWidth={3} name="Upgrades" />
            <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} name="Revenue" />
            <Line type="monotone" dataKey="uninstalls" stroke="#f87171" strokeWidth={3} name="Uninstalls" />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {userDistribution.map((user, index) => (
              <div key={user.name} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">{user.name}</p>
                <p className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                  {user.value.toLocaleString()}
                </p>
              </div>
            ))}
            
            {/* Clickable User Management Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div 
                className="bg-blue-50 rounded-xl p-4 cursor-pointer hover:bg-blue-100 transition-colors text-center"
                onClick={() => openUserModal("freemium")}
              >
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">View Freemium</p>
                <p className="text-lg font-bold text-blue-600">{userDistribution[1].value}</p>
              </div>
              
              <div 
                className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center"
                onClick={() => openUserModal("free")}
              >
                <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">View Free Users</p>
                <p className="text-lg font-bold text-gray-600">1,500</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Support Tickets</h3>
          <button 
            className="flex items-center gap-1 text-blue-500 hover:underline"
            onClick={() => window.location.href = '/admin/feedback-support'}
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Subject</th>
                <th className="text-left py-2">Priority</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{ticket.subject}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{ticket.user}</td>
                  <td className="py-3 text-gray-500">{ticket.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Subscribers</h3>
          <button 
            className="flex items-center gap-1 text-blue-500 hover:underline"
            onClick={() => window.location.href = '/admin/subscription-management'}
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {recentSubscribers.map((subscriber) => (
            <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{subscriber.name}</p>
                <p className="text-sm text-gray-600">{subscriber.email}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{subscriber.revenue}</p>
                <p className="text-xs text-gray-500">{subscriber.plan} • {subscriber.joined}</p>
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