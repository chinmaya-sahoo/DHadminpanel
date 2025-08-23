import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const Feedback_Support = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Priority levels with colors and icons
  const priorityConfig = {
    Critical: { color: "text-red-600 bg-red-50 border-red-200", icon: AlertTriangle },
    High: { color: "text-orange-600 bg-orange-50 border-orange-200", icon: ArrowUp },
    Medium: { color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Minus },
    Low: { color: "text-green-600 bg-green-50 border-green-200", icon: Clock },
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Mock data
  useEffect(() => {
    setTickets([
      {
        id: 1,
        user: "Ravi",
        type: "bug",
        message: "App crashes on adding expense",
        status: "open",
        agent: "Unassigned",
        priority: "High",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        user: "Priya",
        type: "suggestion",
        message: "Please add dark mode",
        status: "resolved",
        agent: "Ankit",
        priority: "Low",
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        user: "Amit",
        type: "payment",
        message: "Payment not reflecting in subscription",
        status: "open",
        agent: "Unassigned",
        priority: "Critical",
        timestamp: new Date().toISOString(),
      },
      {
        id: 4,
        user: "Sunita",
        type: "feature",
        message: "Need export feature for expenses",
        status: "open",
        agent: "Neha",
        priority: "Medium",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleStatusChange = (id, status) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: status } : t))
    );
    showToast(`Ticket ${status === "resolved" ? "resolved" : "reopened"} successfully!`, "success");
  };

  const handleAssign = (id, agent) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, agent: agent } : t))
    );
    showToast(`Ticket assigned to ${agent}`, "success");
  };

  const handlePriorityChange = (id, priority) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, priority: priority } : t))
    );
    showToast(`Priority updated to ${priority}`, "success");
  };

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((t) => t.type === filter);

  // Sort tickets by priority (Critical -> High -> Medium -> Low)
  const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const sortedTickets = [...filteredTickets].sort((a, b) => 
    priorityOrder[b.priority] - priorityOrder[a.priority]
  );

  const renderPriorityBadge = (priority) => {
    const config = priorityConfig[priority];
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {priority}
      </span>
    );
  };

  // Statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    critical: tickets.filter(t => t.priority === "Critical").length,
    high: tickets.filter(t => t.priority === "High").length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-600" /> Feedback & Support
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tickets</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
          <div className="text-sm text-gray-600">Open</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setFilter("all")}
        >
          All ({tickets.length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "bug" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setFilter("bug")}
        >
          Bugs ({tickets.filter(t => t.type === "bug").length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "suggestion" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setFilter("suggestion")}
        >
          Suggestions ({tickets.filter(t => t.type === "suggestion").length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "payment" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setFilter("payment")}
        >
          Payments ({tickets.filter(t => t.type === "payment").length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "feature" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setFilter("feature")}
        >
          Features ({tickets.filter(t => t.type === "feature").length})
        </button>
      </div>

      {/* Ticket List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Agent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{t.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-sm text-gray-900 truncate" title={t.message}>
                      {t.message}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {t.status === "open" ? (
                      <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                        <Clock size={14} /> Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle size={14} /> Resolved
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={t.priority}
                      onChange={(e) => handlePriorityChange(t.id, e.target.value)}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <div className="mt-1">
                      {renderPriorityBadge(t.priority)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleAssign(t.id, e.target.value)}
                      value={t.agent}
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Ankit">Ankit</option>
                      <option value="Neha">Neha</option>
                      <option value="Rahul">Rahul</option>
                      <option value="Priya">Priya</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {t.status === "open" ? (
                        <button
                          onClick={() => handleStatusChange(t.id, "resolved")}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(t.id, "open")}
                          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Report */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-600" /> Support Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4h 32m</div>
            <div className="text-sm text-gray-600">Avg Resolution Time</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">↑ 50%</div>
            <div className="text-sm text-gray-600">Open Ticket Trends</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Priority Guidelines:</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>🔴 <strong>Critical:</strong> Payment issues, app crashes, security vulnerabilities</li>
            <li>🟠 <strong>High:</strong> Major feature bugs, performance issues</li>
            <li>🟡 <strong>Medium:</strong> Minor bugs, feature requests</li>
            <li>🟢 <strong>Low:</strong> Suggestions, cosmetic issues, documentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback_Support;