// File: admin/src/pages/Notification.jsx
import React, { useEffect, useState } from "react";
import { Bell, Loader2, AlertCircle, CheckCircle, Info, XCircle, Search, Grid, List } from "lucide-react";
import apiService from "../services/api";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getNotifications(); // <-- Make sure API exists
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter by search
  const filteredNotifications = notifications.filter(
    (n) =>
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Notification Card Component
  const NotificationCard = ({ notification }) => {
    const type = notification.type || "info";
    let icon, color;

    switch (type) {
      case "success":
        icon = <CheckCircle className="text-green-600 w-6 h-6" />;
        color = "bg-green-100 text-green-800";
        break;
      case "error":
        icon = <XCircle className="text-red-600 w-6 h-6" />;
        color = "bg-red-100 text-red-800";
        break;
      case "warning":
        icon = <AlertCircle className="text-yellow-600 w-6 h-6" />;
        color = "bg-yellow-100 text-yellow-800";
        break;
      default:
        icon = <Info className="text-blue-600 w-6 h-6" />;
        color = "bg-blue-100 text-blue-800";
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="font-semibold text-gray-900 text-sm">
              {notification.title || "Notification"}
            </h3>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
            {type.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
        <p className="text-xs text-gray-500">
          {notification.date
            ? new Date(notification.date).toLocaleString()
            : "Unknown time"}
        </p>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </h1>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center p-4 mb-6 text-red-800 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Notifications Grid/List */}
      {!loading && (
        <div
          className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
            }`}
        >
          {filteredNotifications.map((n) => (
            <NotificationCard key={n._id} notification={n} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "There are no notifications yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notification;
