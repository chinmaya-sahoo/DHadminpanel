// File: src/pages/User_Management.jsx
import React, { useState } from "react";
import { Download, UserCheck, UserX, Star, RotateCw, Calendar } from "lucide-react";

const initialUsers = [
  { id: 1, name: "Mash", phone: "9999999999", language: "English", plan: "Free", status: "active", health: 82 },
  { id: 2, name: "Amit", phone: "8888888888", language: "Hindi", plan: "Premium", status: "premium", health: 94 },
  { id: 3, name: "Sara", phone: "7777777777", language: "Odia", plan: "Free", status: "blocked", health: 40 },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState({ open: false, message: "", onConfirm: null });

  // Handle status change
  const updateStatus = (id, newStatus) => {
    setUsers(users.map(u => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  // Open confirmation modal
  const confirmAction = (msg, action) => {
    setModal({ open: true, message: msg, onConfirm: action });
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ["ID", "Name", "Phone", "Language", "Plan", "Status", "Health"];
    const rows = users.map(u => [u.id, u.name, u.phone, u.language, u.plan, u.status, u.health]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "users.csv");
    link.click();
  };

  // Filter users
  const filteredUsers = users.filter(u =>
    filter === "all" ? true : filter === "premium" ? u.status === "premium" : filter === "active" ? u.status === "active" : u.status === "blocked"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "active", "premium", "blocked"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg ${filter === f ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Export */}
      <button
        onClick={exportCSV}
        className="mb-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        <Download size={18} /> Export CSV
      </button>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Language</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Health</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.language}</td>
                <td className="px-4 py-2">{user.plan}</td>
                <td className="px-4 py-2 capitalize">{user.status}</td>
                <td className="px-4 py-2">
                  <div
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      user.health > 70 ? "bg-green-500" : user.health > 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  >
                    {user.health}
                  </div>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => confirmAction(`Activate ${user.name}?`, () => updateStatus(user.id, "active"))}
                    title="Activate User"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    <UserCheck size={16} />
                  </button>

                  <button
                    onClick={() => confirmAction(`Block ${user.name}?`, () => updateStatus(user.id, "blocked"))}
                    title="Block User"
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    <UserX size={16} />
                  </button>

                  <button
                    onClick={() => confirmAction(`Make ${user.name} Premium?`, () => updateStatus(user.id, "premium"))}
                    title="Make Premium"
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  >
                    <Star size={16} />
                  </button>

                  <button
                    onClick={() => confirmAction(`Reset password for ${user.name}?`, () => console.log("Password reset"))}
                    title="Reset Password"
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    <RotateCw size={16} />
                  </button>

                  <button
                    onClick={() => confirmAction(`Change expiry date for ${user.name}?`, () => console.log("Expiry updated"))}
                    title="Change Expiry Date"
                    className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
                  >
                    <Calendar size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="mb-6">{modal.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal({ ...modal, open: false })}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  modal.onConfirm();
                  setModal({ ...modal, open: false });
                }}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
