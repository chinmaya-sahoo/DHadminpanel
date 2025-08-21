import React from "react";
import { ArrowRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

// Sample data for the activity graph
const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 5000, expense: 2800 },
  { name: "Apr", income: 4780, expense: 3908 },
  { name: "May", income: 5890, expense: 4800 },
  { name: "Jun", income: 4390, expense: 3800 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Wallet className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Budget</p>
            <h2 className="text-2xl font-bold">$50,000</h2>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingDown className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Expense</p>
            <h2 className="text-2xl font-bold">$20,000</h2>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Income</p>
            <h2 className="text-2xl font-bold">$30,000</h2>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <Wallet className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Profit</p>
            <h2 className="text-2xl font-bold">$10,000</h2>
          </div>
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
            <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={3} />
            <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button
            onClick={() => navigate("/admin/transaction")}
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between text-gray-700">
            <span>Netflix Subscription</span>
            <span className="text-red-500">- $15</span>
          </li>
          <li className="flex justify-between text-gray-700">
            <span>Freelance Income</span>
            <span className="text-green-500">+ $500</span>
          </li>
          <li className="flex justify-between text-gray-700">
            <span>Groceries</span>
            <span className="text-red-500">- $120</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
