import React, { useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
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
} from "recharts";

// Sample data for the activity graph
const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 5000, expense: 2800 },
  { name: "Apr", income: 4780, expense: 3908 },
  { name: "May", income: 5890, expense: 4800 },
  { name: "Jun", income: 4390, expense: 3800 },
];

// Pie chart data for users - corrected structure
const userDistribution = [
  { name: "Active Paid Users", value: 2000 },
  { name: "Active Freemium Users", value: 3000 },
  { name: "Inactive Users", value: 1000 },
];

// Calculate total active users (paid + freemium)
const totalActiveUsers = userDistribution[0].value + userDistribution[1].value;

// User activity data for filters - using calculated active users
const activityStats = {
  daily: { users: 120, change: +5 },
  weekly: { users: 800, change: -3 },
  monthly: { users: 3200, change: +12 },
  yearly: { users: totalActiveUsers, change: +20 }, // Using calculated total
};

const COLORS = ["#4ade80", "#3b82f6", "#6b7280"];

export default function Dashboard() {
  const [period, setPeriod] = useState("daily");

  const { users, change } = activityStats[period];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Wallet className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Budget</p>
            <h2 className="text-2xl font-bold">₹50,000</h2>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingDown className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Expense</p>
            <h2 className="text-2xl font-bold">₹20,000</h2>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Income</p>
            <h2 className="text-2xl font-bold">₹30,000</h2>
          </div>
        </div>


        {/* Total Profit */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Wallet className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Profit(Revenue)</p>
            <h2 className="text-2xl font-bold">₹10,000</h2>
          </div>
        </div>

        {/*Monthly Installations */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Monthly Installations</p>
            <h2 className="text-2xl font-bold"> 3000 </h2>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Upgrades</p>
            <h2 className="text-2xl font-bold">4000</h2>
          </div>
        </div>
      </div>

      {/* Active Users Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            User Distribution
          </h3>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
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

        {/* Stats - showing active users count */}
        <div className="flex items-center gap-6 mb-2">
          <div>
            <p className="text-gray-500 text-sm">Active Users ({period})</p>
            <h2 className="text-3xl font-bold">{users}</h2>
          </div>
          <span
            className={`flex items-center text-sm font-medium ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}% {change >= 0 ? "increase" : "decrease"}
          </span>
        </div>

        {/* Summary Stats */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Active</p>
            <p className="text-xl font-bold text-blue-600">{totalActiveUsers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Paid Users</p>
            <p className="text-xl font-bold text-green-600">{userDistribution[0].value}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Freemium Users</p>
            <p className="text-xl font-bold text-blue-400">{userDistribution[1].value}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Inactive Users</p>
            <p className="text-xl font-bold text-blue-400">{userDistribution[2].value}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Graph</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#4ade80"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#f87171"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="flex items-center gap-1 text-blue-500 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between text-gray-700">
            <span>Netflix Subscription</span>
            <span className="text-red-500">- ₹15</span>
          </li>
          <li className="flex justify-between text-gray-700">
            <span>Freelance Income</span>
            <span className="text-green-500">+ ₹500</span>
          </li>
          <li className="flex justify-between text-gray-700">
            <span>Groceries</span>
            <span className="text-red-500">- ₹120</span>
          </li>
        </ul>
      </div>
    </div>
  );
}