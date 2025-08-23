// File: admin/src/pages/Notification.jsx
import React, { useState } from "react";
import { Bell, Clock, Send, TrendingUp, Settings2 } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function Notification() {
  const [targetGroup, setTargetGroup] = useState("All");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Mock performance stats
  const stats = [
    { name: "Opened", value: 70 },
    { name: "Clicked", value: 30 },
    { name: "Ignored", value: 100 },
  ];
  const COLORS = ["#4ade80", "#60a5fa", "#f87171"];

  const templates = {
    reminder: "⏰ Don't forget to update today's hisab!",
    promo: "🔥 Get Premium at 20% off today only!",
    greeting: "🙏 Happy Festival! Manage your budget with Daily Hisab 🎉",
  };

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSend = () => {
    if (!message && !templates[template]) {
      showToast("Please enter a message or select a template", "error");
      return;
    }

    const newNotification = {
      id: Date.now(),
      targetGroup,
      template,
      message: message || templates[template] || "",
      scheduleDate,
      status: scheduleDate ? "Scheduled" : "Sent",
      timestamp: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notifications]);
    setMessage("");
    setTemplate("");
    setScheduleDate("");
    
    showToast("Notification sent successfully!", "success");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" ? "✓" : "⚠️"}
            {toast.message}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="w-6 h-6 text-blue-500" /> Notification Management
      </h1>

      {/* Create Notification */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold">Create Notification</h2>
        
        {/* Target group */}
        <div>
          <label className="block font-medium mb-1">Target Group:</label>
          <select
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
            <option value="Hindi users">Hindi users</option>
            <option value="Marathi users">Marathi users</option>
          </select>
        </div>

        {/* Template selection */}
        <div>
          <label className="block font-medium mb-1">Template:</label>
          <select
            value={template}
            onChange={(e) => {
              setTemplate(e.target.value);
              setMessage(templates[e.target.value] || "");
            }}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Custom</option>
            <option value="reminder">Reminder</option>
            <option value="promo">Promotion</option>
            <option value="greeting">Festival Greeting</option>
          </select>
        </div>

        {/* Message box */}
        <div>
          <label className="block font-medium mb-1">Message:</label>
          <textarea
            placeholder="Write your notification..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Schedule */}
        <div>
          <label className=" font-medium mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Schedule (Optional):
          </label>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {/* Sent Notifications List */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No notifications sent yet</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="p-3 border border-gray-200 rounded-lg flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{n.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Target: {n.targetGroup} • Status: {n.status}
                  </p>
                </div>
                <div className="text-xs text-gray-400 ml-4 text-right">
                  {n.scheduleDate ? (
                    <div>
                      <div>Scheduled:</div>
                      <div>{new Date(n.scheduleDate).toLocaleString()}</div>
                    </div>
                  ) : (
                    <div>
                      <div>Sent:</div>
                      <div>{new Date(n.timestamp).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Performance Tracking */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" /> Performance Tracking
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {stats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Suggestions & Triggers */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-purple-500" /> Smart Suggestions & Auto Triggers
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>💡 Suggestion: Users inactive for 3+ days → Send reminder</li>
          <li>🎉 Suggestion: Send greeting on festivals</li>
          <li>🔁 Auto Trigger: Failed payment → Retry & notify user</li>
          <li>🧠 Smart: Low engagement users → Send motivational message</li>
        </ul>
      </div>
    </div>
  );
}