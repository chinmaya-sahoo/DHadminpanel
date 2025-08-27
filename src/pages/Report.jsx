import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Users,
  UserCheck,
  UserX,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

// User Growth Data
const userGrowthData = [
  { name: "Jan", newUsers: 450, totalUsers: 2450, churn: 23 },
  { name: "Feb", newUsers: 620, totalUsers: 3047, churn: 31 },
  { name: "Mar", newUsers: 780, totalUsers: 3796, churn: 28 },
  { name: "Apr", newUsers: 590, totalUsers: 4358, churn: 35 },
  { name: "May", newUsers: 850, totalUsers: 5173, churn: 22 },
  { name: "Jun", newUsers: 920, totalUsers: 6071, churn: 19 },
];

// Active vs Inactive Users Data
const userActivityData = [
  { name: "Active Paid", value: 2000, color: "#4ade80" },
  { name: "Active Freemium", value: 3000, color: "#3b82f6" },
  { name: "Inactive Users", value: 1071, color: "#6b7280" },
];

// Subscription Revenue Data
const subscriptionRevenueData = [
  { name: "Jan", starter: 28000, premium: 45000 },
  { name: "Feb", starter: 32000, premium: 52000 },
  { name: "Mar", starter: 35000, premium: 48000 },
  { name: "Apr", starter: 38000, premium: 58000 },
  { name: "May", starter: 42000, premium: 62000 },
  { name: "Jun", starter: 45000, premium: 65000 },
];

// Business Health Categories
const businessHealthData = [
  { category: "User Acquisition", status: "Strong", value: 85, color: "#4ade80" },
  { category: "Revenue Growth", status: "Strong", value: 92, color: "#4ade80" },
  { category: "User Retention", status: "Average", value: 68, color: "#facc15" },
  { category: "Support Quality", status: "Poor", value: 45, color: "#f87171" },
  { category: "Product Usage", status: "Strong", value: 88, color: "#4ade80" },
  { category: "Market Share", status: "Average", value: 72, color: "#facc15" },
];

// Sample data for Income vs Expense with different periods
const dailySummaryData = [
  { name: "Mon", income: 8500, expense: 5200 },
  { name: "Tue", income: 9200, expense: 5800 },
  { name: "Wed", income: 7800, expense: 4900 },
  { name: "Thu", income: 10200, expense: 6300 },
  { name: "Fri", income: 11500, expense: 7100 },
  { name: "Sat", income: 6800, expense: 4200 },
  { name: "Sun", income: 5900, expense: 3600 },
];

const weeklySummaryData = [
  { name: "Week 1", income: 58500, expense: 36200 },
  { name: "Week 2", income: 62800, expense: 39100 },
  { name: "Week 3", income: 59200, expense: 37800 },
  { name: "Week 4", income: 67500, expense: 42300 },
];

const monthlySummaryData = [
  { name: "Jan", income: 185000, expense: 125000 },
  { name: "Feb", income: 195000, expense: 132000 },
  { name: "Mar", income: 178000, expense: 118000 },
  { name: "Apr", income: 215000, expense: 145000 },
  { name: "May", income: 235000, expense: 158000 },
  { name: "Jun", income: 248000, expense: 165000 },
];

// Legacy data
const expenseData = [
  { name: "Infrastructure", value: 45000 },
  { name: "Marketing", value: 32000 },
  { name: "Operations", value: 28000 },
  { name: "Support", value: 18000 },
  { name: "Other", value: 12000 },
];

const incomeData = [
  { name: "Starter Subscriptions", value: 45000 },
  { name: "Premium Subscriptions", value: 65000 },
  { name: "Add-ons & Extras", value: 15000 },
  { name: "Other Revenue", value: 8000 },
];

const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#facc15", "#a78bfa"];

export default function Report() {
  const [creditScore, setCreditScore] = useState(0);
  const [summaryPeriod, setSummaryPeriod] = useState("monthly");

  useEffect(() => {
    // Simulate fetching credit score from backend
    setCreditScore(Math.floor(Math.random() * 101));
  }, []);

  const getSummaryData = () => {
    switch(summaryPeriod) {
      case "daily": return dailySummaryData;
      case "weekly": return weeklySummaryData;
      case "monthly": return monthlySummaryData;
      default: return monthlySummaryData;
    }
  };

  const getHealthIcon = (status) => {
    switch(status) {
      case "Strong": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Average": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "Poor": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* User Growth Report */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-blue-600" /> User Growth Report
        </h3>
        
        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">New Users (This Month)</p>
            <p className="text-2xl font-bold text-green-600">920</p>
            <p className="text-xs text-green-500">+18% from last month</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">6,071</p>
            <p className="text-xs text-blue-500">+17% growth rate</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Churn Rate</p>
            <p className="text-2xl font-bold text-red-600">19</p>
            <p className="text-xs text-red-500">-3 from last month</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Net Growth</p>
            <p className="text-2xl font-bold text-purple-600">901</p>
            <p className="text-xs text-purple-500">Users this month</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="totalUsers" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Total Users" />
            <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#4ade80" fill="#4ade80" name="New Users" />
            <Line type="monotone" dataKey="churn" stroke="#f87171" strokeWidth={2} name="Churn" />
            <Legend className="mt-10"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Active vs Inactive Users */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-green-600" /> Active vs Inactive Users
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => 
                    `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            {userActivityData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {item.name.includes('Active') ? 
                    <UserCheck className="w-6 h-6" style={{color: item.color}} /> :
                    <UserX className="w-6 h-6" style={{color: item.color}} />
                  }
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{color: item.color}}>
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((item.value / userActivityData.reduce((sum, u) => sum + u.value, 0)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Revenue Report */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" /> Subscription Revenue Report
        </h3>
        
        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Starter Revenue</p>
            <p className="text-2xl font-bold text-blue-600">₹45,000</p>
            <p className="text-xs text-blue-500">+7% from last month</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Premium Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹65,000</p>
            <p className="text-xs text-green-500">+5% from last month</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subscriptionRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="starter" fill="#3b82f6" name="Starter" />
            <Bar dataKey="premium" fill="#4ade80" name="Premium" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Business Health Distribution */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-purple-600" /> Business Health Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessHealthData.map((item, index) => (
            <div key={item.category} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.category}</span>
                {getHealthIcon(item.status)}
              </div>
              
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.value}%`, 
                      backgroundColor: item.color 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="font-medium" style={{color: item.color}}>
                  {item.status}
                </span>
                <span className="text-gray-600">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily/Weekly/Monthly Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-sm font-semibold text-gray-500">Daily Comparison</h2>
          <div className="mt-2 space-y-1">
            <p className="flex items-center gap-2 text-green-600">
              <TrendingUp size={18} /> Income: +5%
            </p>
            <p className="flex items-center gap-2 text-red-600">
              <TrendingDown size={18} /> Expense: -3%
            </p>
            <p className="flex items-center gap-2 text-purple-600">
              <DollarSign size={18} /> Profit: +8%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-sm font-semibold text-gray-500">Weekly Comparison</h2>
          <div className="mt-2 space-y-1">
            <p className="flex items-center gap-2 text-green-600">
              <TrendingUp size={18} /> Income: +10%
            </p>
            <p className="flex items-center gap-2 text-red-600">
              <TrendingDown size={18} /> Expense: -6%
            </p>
            <p className="flex items-center gap-2 text-purple-600">
              <DollarSign size={18} /> Profit: +15%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-sm font-semibold text-gray-500">Monthly Comparison</h2>
          <div className="mt-2 space-y-1">
            <p className="flex items-center gap-2 text-green-600">
              <TrendingUp size={18} /> Income: +20%
            </p>
            <p className="flex items-center gap-2 text-red-600">
              <TrendingDown size={18} /> Expense: -12%
            </p>
            <p className="flex items-center gap-2 text-purple-600">
              <DollarSign size={18} /> Profit: +32%
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Income vs Expense Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4 gap-3">
          <h3 className="text-lg font-semibold">Income vs Expense Summary</h3>
          <div className="flex gap-2 overflow-x-scroll">
            {["daily", "weekly", "monthly"].map((period) => (
              <button
                key={period}
                onClick={() => setSummaryPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  summaryPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={getSummaryData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={3} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <PieChartIcon /> Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incomes */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <PieChartIcon /> Income Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Score */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Business Credit Score</h3>
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="#4ade80"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(creditScore / 100) * 377} 377`}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {creditScore}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Overall Business Health</p>
      </div>
    </div>
  );
}