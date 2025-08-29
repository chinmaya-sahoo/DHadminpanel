// File: src/pages/Analytics_Insights.jsx
import React, { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Filter, Save, PlusCircle } from "lucide-react";

const featureUsageData = [
  { feature: "Voice Entry", usage: 320 },
  { feature: "Exports", usage: 210 },
  { feature: "Reports", usage: 150 },
  { feature: "Consultings", usage: 95 },
];

const dailyVsMonthly = [
  { period: "Day 1", daily: 120, monthly: 450 },
  { period: "Day 2", daily: 90, monthly: 470 },
  { period: "Day 3", daily: 140, monthly: 490 },
  { period: "Day 4", daily: 110, monthly: 460 },
];

const regionData = [
  { region: "Karnatak", users: 400 },
  { region: "Delhi", users: 300 },
  { region: "Odisha", users: 200 },
  { region: "West Bengal", users: 150 },
  { region: "Other", users: 100 },
];

const acquisitionData = [
  { channel: "Google Ads", users: 350 },
  { channel: "Referrals", users: 250 },
  { channel: "Organic", users: 180 },
  { channel: "Social Media", users: 120 },
];

const funnelData = [
  { stage: "Installs", count: 1000 },
  { stage: "Active", count: 600 },
  { stage: "Paid", count: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9A60B4"];

export default function AnalyticsInsights() {
  const [customReports, setCustomReports] = useState([]);
  const [newReport, setNewReport] = useState("");

  const handleSaveReport = () => {
    if (newReport.trim()) {
      setCustomReports([...customReports, newReport]);
      setNewReport("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics & Insights</h1>

      {/* Feature Usage */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Feature Usage Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily vs Monthly Usage */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Daily vs Monthly Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyVsMonthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="daily" stroke="#00C49F" />
            <Line type="monotone" dataKey="monthly" stroke="#FF8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region / Language Activity */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Most Active Regions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionData}
              dataKey="users"
              nameKey="region"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Acquisition Channels */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Top Acquisition Channels</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={acquisitionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#9A60B4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Conversion Funnel</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="stage" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Reports */}
      {/* <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">📌 Custom Reports</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter report name"
            value={newReport}
            onChange={(e) => setNewReport(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleSaveReport}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
          >
            <Save size={16} /> Save
          </button>
        </div>
        {customReports.length > 0 && (
          <ul className="list-disc list-inside text-gray-700">
            {customReports.map((report, idx) => (
              <li key={idx}>{report}</li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}
