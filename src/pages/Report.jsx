import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
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
} from "recharts";

// Sample data for charts
const expenseData = [
  { name: "Food", value: 400 },
  { name: "Transport", value: 300 },
  { name: "Rent", value: 800 },
  { name: "Shopping", value: 300 },
  { name: "Other", value: 200 },
];

const incomeData = [
  { name: "Salary", value: 2500 },
  { name: "Freelance", value: 800 },
  { name: "Investments", value: 600 },
  { name: "Other", value: 300 },
];

const summaryData = [
  { name: "Jan", income: 3000, expense: 2000 },
  { name: "Feb", income: 3200, expense: 1800 },
  { name: "Mar", income: 2800, expense: 2200 },
  { name: "Apr", income: 3500, expense: 2400 },
  { name: "May", income: 4000, expense: 2600 },
];

const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#facc15", "#a78bfa"];

export default function Report() {
  const [creditScore, setCreditScore] = useState(0);

  useEffect(() => {
    // Simulate fetching credit score from backend
    setCreditScore(Math.floor(Math.random() * 101));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Daily / Weekly / Monthly Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500">Daily Comparison</h3>
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
          <h3 className="text-sm text-gray-500">Weekly Comparison</h3>
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
          <h3 className="text-sm text-gray-500">Monthly Comparison</h3>
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

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <PieIcon /> Expense Breakdown
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
            <PieIcon /> Income Breakdown
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

      {/* Summary Graph */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Income vs Expense Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={3} />
            <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Credit Score */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Credit Score</h3>
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
      </div>
    </div>
  );
}
