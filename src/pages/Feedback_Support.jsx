import React, { useState, useEffect, useRef } from "react";
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
  Bell,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

const Feedback_Support = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all"); // new, read, all
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [newFeedbackPopup, setNewFeedbackPopup] = useState({ show: false, tickets: [] });
  const [isOnFeedbackRoute, setIsOnFeedbackRoute] = useState(true);
  const intervalRef = useRef(null);
  const routeCheckRef = useRef(null);

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

  // Simulate fetching new feedback
  const fetchNewFeedbacks = async () => {
    // Simulate API call
    const newFeedbacks = [
      {
        id: Date.now() + Math.random(),
        user: "Kavya",
        type: "bug",
        message: "Unable to login with Google account",
        status: "open",
        agent: "Unassigned",
        priority: "High",
        timestamp: new Date().toISOString(),
        isRead: false,
        isNew: true,
      },
      {
        id: Date.now() + Math.random() + 1,
        user: "Rajesh",
        type: "feature",
        message: "Add biometric authentication",
        status: "open",
        agent: "Unassigned",
        priority: "Medium",
        timestamp: new Date().toISOString(),
        isRead: false,
        isNew: true,
      }
    ];

    // Random chance of new feedback (30% chance every 10 seconds)
    if (Math.random() < 0.3) {
      const randomFeedback = newFeedbacks[Math.floor(Math.random() * newFeedbacks.length)];
      
      setTickets(prev => {
        const exists = prev.find(t => t.id === randomFeedback.id);
        if (!exists) {
          // Show popup notification only if not on feedback route
          if (!isOnFeedbackRoute) {
            setNewFeedbackPopup({ show: true, tickets: [randomFeedback] });
          }
          return [randomFeedback, ...prev];
        }
        return prev;
      });
    }
  };

  // Simulate route change detection
  const simulateRouteChange = () => {
    // Simulate being on different routes
    const routes = ['/admin/feedback-support', '/admin/dashboard', '/admin/users', '/admin/settings'];
    const currentRoute = routes[Math.floor(Math.random() * routes.length)];
    
    const isCurrentlyOnFeedbackRoute = currentRoute === '/admin/feedback-support';
    
    if (isCurrentlyOnFeedbackRoute !== isOnFeedbackRoute) {
      setIsOnFeedbackRoute(isCurrentlyOnFeedbackRoute);
      
      if (isCurrentlyOnFeedbackRoute) {
        // Entering feedback route - fetch new feedbacks
        fetchNewFeedbacks();
        showToast("Checking for new feedback...", "info");
      } else {
        // Leaving feedback route - mark all as read
        markAllAsRead();
        showToast("All feedback marked as read", "success");
      }
    }
  };

  // Mark all tickets as read
  const markAllAsRead = () => {
    setTickets(prev => prev.map(ticket => ({ 
      ...ticket, 
      isRead: true, 
      isNew: false 
    })));
  };

  // Initialize mock data
  useEffect(() => {
    const initialTickets = [
      {
        id: 1,
        user: "Ravi",
        type: "bug",
        message: "App crashes on adding expense",
        status: "open",
        agent: "Unassigned",
        priority: "High",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isRead: true,
        isNew: false,
      },
      {
        id: 2,
        user: "Priya",
        type: "suggestion",
        message: "Please add dark mode",
        status: "resolved",
        agent: "Ankit",
        priority: "Low",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        isRead: true,
        isNew: false,
      },
      {
        id: 3,
        user: "Amit",
        type: "payment",
        message: "Payment not reflecting in subscription",
        status: "open",
        agent: "Unassigned",
        priority: "Critical",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: false,
        isNew: true,
      },
      {
        id: 4,
        user: "Sunita",
        type: "feature",
        message: "Need export feature for expenses",
        status: "open",
        agent: "Neha",
        priority: "Medium",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        isRead: true,
        isNew: false,
      },
    ];
    setTickets(initialTickets);
  }, []);

  // Set up intervals for fetching and route simulation
  useEffect(() => {
    // Fetch new feedbacks every 10 seconds
    intervalRef.current = setInterval(fetchNewFeedbacks, 10000);
    
    // Simulate route changes every 15 seconds
    routeCheckRef.current = setInterval(simulateRouteChange, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (routeCheckRef.current) clearInterval(routeCheckRef.current);
    };
  }, [isOnFeedbackRoute]);

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

  const markAsRead = (id) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, isRead: true, isNew: false } : ticket
    ));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Filter tickets based on type and read status
  let filteredTickets = filter === "all" ? tickets : tickets.filter((t) => t.type === filter);
  
  if (readFilter === "new") {
    filteredTickets = filteredTickets.filter(t => !t.isRead);
  } else if (readFilter === "read") {
    filteredTickets = filteredTickets.filter(t => t.isRead);
  }

  // Sort tickets by priority and timestamp
  const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    // First sort by read status (unread first)
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    // Then by priority
    if (a.priority !== b.priority) return priorityOrder[b.priority] - priorityOrder[a.priority];
    // Finally by timestamp (newer first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

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
    unread: tickets.filter(t => !t.isRead).length,
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
            : toast.type === "info"
            ? "bg-blue-500 text-white"
            : "bg-red-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" ? "✓" : toast.type === "info" ? "ℹ" : "⚠️"}
            {toast.message}
          </div>
        </div>
      )}

      {/* New Feedback Popup */}
      {newFeedbackPopup.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="text-blue-600" size={24} />
                <h3 className="text-lg font-semibold">New Feedback Received!</h3>
              </div>
              <button
                onClick={() => setNewFeedbackPopup({ show: false, tickets: [] })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {newFeedbackPopup.tickets.map(ticket => (
              <div key={ticket.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-blue-600" />
                  <span className="font-medium">{ticket.user}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {ticket.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{ticket.message}</p>
                {renderPriorityBadge(ticket.priority)}
              </div>
            ))}
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setNewFeedbackPopup({ show: false, tickets: [] });
                  setIsOnFeedbackRoute(true); // Simulate navigating to feedback route
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View All Feedback
              </button>
              <button
                onClick={() => setNewFeedbackPopup({ show: false, tickets: [] })}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Status Indicator */}
      <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnFeedbackRoute ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {/* Current Route:  */}
            {/* {isOnFeedbackRoute ? '/admin/feedback-support' : 'Other Route'} */}
          </span>
          {isOnFeedbackRoute && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Active Monitoring
            </span>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-600" /> Feedback & Support
        {stats.unread > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {stats.unread} new
          </span>
        )}
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
          <div className="text-2xl font-bold text-purple-600">{stats.unread}</div>
          <div className="text-sm text-gray-600">Unread</div>
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
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("all")}
          >
            All Types ({tickets.length})
          </button>
          {["bug", "suggestion", "payment", "feature"].map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({tickets.filter(t => t.type === type).length})
            </button>
          ))}
        </div>
      </div>

      {/* Read Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            readFilter === "all" ? "bg-purple-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setReadFilter("all")}
        >
          <Eye size={16} />
          All ({filteredTickets.length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            readFilter === "new" ? "bg-purple-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setReadFilter("new")}
        >
          <Bell size={16} />
          New ({tickets.filter(t => !t.isRead && (filter === "all" || t.type === filter)).length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            readFilter === "read" ? "bg-purple-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setReadFilter("read")}
        >
          <EyeOff size={16} />
          Read ({tickets.filter(t => t.isRead && (filter === "all" || t.type === filter)).length})
        </button>
        {stats.unread > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Mark All Read
          </button>
        )}
      </div>

      {/* Ticket List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Agent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTickets.map((t) => (
                <tr key={t.id} className={`hover:bg-gray-50 ${!t.isRead ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {t.status === "open" ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                          <Clock size={14} /> Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle size={14} /> Resolved
                        </span>
                      )}
                      {!t.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <span className={`font-medium ${!t.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                        {t.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className={`text-sm truncate ${!t.isRead ? 'text-blue-900 font-medium' : 'text-gray-900'}`} title={t.message}>
                      {t.message}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      value={t.priority}
                      onChange={(e) => handlePriorityChange(t.id, e.target.value)}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <div>
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
                    <div className="text-sm text-gray-500">
                      {formatTimeAgo(t.timestamp)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!t.isRead && (
                        <button
                          onClick={() => markAsRead(t.id)}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
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