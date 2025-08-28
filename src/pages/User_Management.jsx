import React, { useState } from "react";
import { 
  Download, 
  UserCheck, 
  UserX, 
  Star, 
  Calendar, 
  Edit, 
  X,
  Save,
  Eye,
  EyeOff,
  Search,
  Filter,
  UserPlus
} from "lucide-react";

const initialUsers = [
  { 
    id: 1, 
    username: "mash_dev", 
    name: "Mash Kumar", 
    email: "mash@example.com",
    phone: "9999999999", 
    password: "password123",
    ipAddress: "192.168.1.100",
    birthday: "1995-05-15",
    gender: "male",
    language: "English", 
    plan: "Free", 
    status: "active", 
    health: 82,
    expiryDate: "2024-12-31",
    role: "regular user",
    businessType: "Technology"
  },
  { 
    id: 2, 
    username: "amit_pro", 
    name: "Amit Singh", 
    email: "amit@example.com",
    phone: "8888888888", 
    password: "securepass456",
    ipAddress: "192.168.1.101",
    birthday: "1990-08-22",
    gender: "male",
    language: "Hindi", 
    plan: "Premium", 
    status: "active", 
    health: 94,
    expiryDate: "2025-06-15",
    role: "manager",
    businessType: "Finance"
  },
  { 
    id: 3, 
    username: "sara_user", 
    name: "Sara Patel", 
    email: "sara@example.com",
    phone: "7777777777", 
    password: "mypass789",
    ipAddress: "192.168.1.102",
    birthday: "1988-12-03",
    gender: "female",
    language: "Odia", 
    plan: "Starter", 
    status: "blocked", 
    health: 40,
    expiryDate: "2024-10-20",
    role: "regular user",
    businessType: "Healthcare"
  },
];

const languages = ["Hindi", "English", "Marathi", "Odia", "Tamil", "Telugu", "Other"];
const plans = ["none", "free", "starter", "premium"];
const genders = ["male", "female", "other"];
const statuses = ["active", "blocked"];
const roles = ["regular user", "manager"];
const businessTypes = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Other"];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [advancedFilter, setAdvancedFilter] = useState({
    role: "all",
    businessType: "all",
    gender: "all",
    language: "all",
    plan: "all",
    status: "all"
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "", onConfirm: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [addModal, setAddModal] = useState({ open: false });
  const [expiryModal, setExpiryModal] = useState({ open: false, user: null, date: "" });
  const [showPasswords, setShowPasswords] = useState({});

  // Add new user
  const addUser = (userData) => {
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const newUser = { ...userData, id: newId };
    setUsers([...users, newUser]);
  };

  // Handle user property updates
  const updateUser = (id, updates) => {
    setUsers(users.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  // Handle status change
  const updateStatus = (id, newStatus) => {
    setUsers(users.map(u => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  // Add premium plan
  const addPremiumPlan = (id) => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 12); // 1 year from now
    setUsers(users.map(u => (u.id === id ? { 
      ...u, 
      plan: "premium", 
      expiryDate: expiryDate.toISOString().split('T')[0] 
    } : u)));
  };

  // Update expiry date
  const updateExpiryDate = (id, newDate) => {
    setUsers(users.map(u => (u.id === id ? { ...u, expiryDate: newDate } : u)));
  };

  // Open confirmation modal
  const confirmAction = (msg, action) => {
    setModal({ open: true, message: msg, onConfirm: action });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter("all");
    setSearchTerm("");
    setAdvancedFilter({
      role: "all",
      businessType: "all",
      gender: "all",
      language: "all",
      plan: "all",
      status: "all"
    });
  };

  // Filter users with advanced filtering
  const filteredUsers = users.filter(u => {
    // Basic filter
    const basicFilter = 
      filter === "all" ||
      (filter === "premium" && u.plan === "premium") ||
      (filter === "starter" && u.plan === "starter") ||
      (filter === "free" && u.plan === "free") ||
      (filter === "active" && u.status === "active") ||
      (filter === "blocked" && u.status === "blocked");

    // Search filter
    const searchFilter = !searchTerm || 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    // Advanced filters
    const roleFilter = advancedFilter.role === "all" || u.role === advancedFilter.role;
    const businessTypeFilter = advancedFilter.businessType === "all" || u.businessType === advancedFilter.businessType;
    const genderFilter = advancedFilter.gender === "all" || u.gender === advancedFilter.gender;
    const languageFilter = advancedFilter.language === "all" || u.language === advancedFilter.language;
    const planFilter = advancedFilter.plan === "all" || u.plan === advancedFilter.plan;
    const statusFilter = advancedFilter.status === "all" || u.status === advancedFilter.status;

    return basicFilter && searchFilter && roleFilter && businessTypeFilter && 
           genderFilter && languageFilter && planFilter && statusFilter;
  });

  // Export to CSV with current filter
  const exportCSV = () => {
    const headers = [
      "ID", "Username", "Name", "Email", "Phone", "Password", 
      "IP Address", "Birthday", "Gender", "Language", "Plan", 
      "Status", "Health", "Expiry Date", "Role", "Business Type"
    ];
    const rows = filteredUsers.map(u => [
      u.id, u.username, u.name, u.email, u.phone, u.password,
      u.ipAddress, u.birthday, u.gender, u.language, u.plan,
      u.status, u.health, u.expiryDate, u.role, u.businessType
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    
    // Dynamic filename based on filter
    const filterName = filter === "all" ? "all_users" : `${filter}_users`;
    link.setAttribute("download", `${filterName}_data.csv`);
    link.click();
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Add User Modal Component
  const AddModal = () => {
    if (!addModal.open) return null;

    const [newUserData, setNewUserData] = useState({
      username: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      ipAddress: "",
      birthday: "",
      gender: "male",
      language: "English",
      plan: "free",
      status: "active",
      health: 100,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      role: "regular user",
      businessType: "Technology"
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
      
      if (!newUserData.username.trim()) newErrors.username = "Username is required";
      if (!newUserData.name.trim()) newErrors.name = "Name is required";
      if (!newUserData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(newUserData.email)) newErrors.email = "Email is invalid";
      if (!newUserData.phone.trim()) newErrors.phone = "Phone is required";
      if (!newUserData.password.trim()) newErrors.password = "Password is required";
      else if (newUserData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (!newUserData.ipAddress.trim()) newErrors.ipAddress = "IP Address is required";
      if (!newUserData.birthday) newErrors.birthday = "Birthday is required";

      // Check for duplicate username or email
      const existingUser = users.find(u => 
        u.username.toLowerCase() === newUserData.username.toLowerCase() || 
        u.email.toLowerCase() === newUserData.email.toLowerCase()
      );
      if (existingUser) {
        if (existingUser.username.toLowerCase() === newUserData.username.toLowerCase()) {
          newErrors.username = "Username already exists";
        }
        if (existingUser.email.toLowerCase() === newUserData.email.toLowerCase()) {
          newErrors.email = "Email already exists";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
      if (!validateForm()) return;
      
      confirmAction(
        `Create new user "${newUserData.name}" with username "${newUserData.username}"?`,
        () => {
          addUser(newUserData);
          setAddModal({ open: false });
          setNewUserData({
            username: "",
            name: "",
            email: "",
            phone: "",
            password: "",
            ipAddress: "",
            birthday: "",
            gender: "male",
            language: "English",
            plan: "free",
            status: "active",
            health: 100,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            role: "regular user",
            businessType: "Technology"
          });
          setErrors({});
        }
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Add New User</h2>
            <button onClick={() => {
              setAddModal({ open: false });
              setErrors({});
            }}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username *</label>
                <input
                  type="text"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Enter username"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="text"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter password (min 6 characters)"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP Address *</label>
                <input
                  type="text"
                  value={newUserData.ipAddress}
                  onChange={(e) => setNewUserData({...newUserData, ipAddress: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.ipAddress ? 'border-red-500' : ''}`}
                  placeholder="e.g., 192.168.1.100"
                />
                {errors.ipAddress && <p className="text-red-500 text-xs mt-1">{errors.ipAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birthday *</label>
                <input
                  type="date"
                  value={newUserData.birthday}
                  onChange={(e) => setNewUserData({...newUserData, birthday: e.target.value})}
                  className={`w-full p-2 border rounded-lg ${errors.birthday ? 'border-red-500' : ''}`}
                />
                {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={newUserData.gender}
                  onChange={(e) => setNewUserData({...newUserData, gender: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={newUserData.language}
                  onChange={(e) => setNewUserData({...newUserData, language: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <select
                  value={newUserData.plan}
                  onChange={(e) => setNewUserData({...newUserData, plan: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {plans.map(plan => (
                    <option key={plan} value={plan}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newUserData.status}
                  onChange={(e) => setNewUserData({...newUserData, status: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Health Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newUserData.health}
                  onChange={(e) => setNewUserData({...newUserData, health: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Type</label>
                <select
                  value={newUserData.businessType}
                  onChange={(e) => setNewUserData({...newUserData, businessType: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Fields marked with * are required. The expiry date will be automatically set to one year from today.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 p-6 border-t">
            <button
              onClick={() => {
                setAddModal({ open: false });
                setErrors({});
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Create User
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Modal Component
  const EditModal = () => {
    if (!editModal.open || !editModal.user) return null;

    const [editData, setEditData] = useState({ ...editModal.user });

    const handleSave = () => {
      confirmAction(
        `Save changes for ${editData.name}?`,
        () => {
          updateUser(editData.id, editData);
          setEditModal({ open: false, user: null });
        }
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Edit User: {editData.name}</h2>
            <button onClick={() => setEditModal({ open: false, user: null })}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="text"
                  value={editData.password}
                  onChange={(e) => setEditData({...editData, password: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP Address</label>
                <input
                  type="text"
                  value={editData.ipAddress}
                  onChange={(e) => setEditData({...editData, ipAddress: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birthday</label>
                <input
                  type="date"
                  value={editData.birthday}
                  onChange={(e) => setEditData({...editData, birthday: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={editData.gender}
                  onChange={(e) => setEditData({...editData, gender: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={editData.language}
                  onChange={(e) => setEditData({...editData, language: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <select
                  value={editData.plan}
                  onChange={(e) => setEditData({...editData, plan: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {plans.map(plan => (
                    <option key={plan} value={plan}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Health Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editData.health}
                  onChange={(e) => setEditData({...editData, health: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Type</label>
                <select
                  value={editData.businessType}
                  onChange={(e) => setEditData({...editData, businessType: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 p-6 border-t">
            <button
              onClick={() => setEditModal({ open: false, user: null })}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Expiry Date Modal
  const ExpiryModal = () => {
    if (!expiryModal.open || !expiryModal.user) return null;

    const handleExpiryUpdate = () => {
      confirmAction(
        `Update expiry date for ${expiryModal.user.name} to ${expiryModal.date}?`,
        () => {
          updateExpiryDate(expiryModal.user.id, expiryModal.date);
          setExpiryModal({ open: false, user: null, date: "" });
        }
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Update Expiry Date</h2>
            <button onClick={() => setExpiryModal({ open: false, user: null, date: "" })}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">User: {expiryModal.user.name}</p>
            <p className="text-gray-600 mb-4">Current Plan: {expiryModal.user.plan}</p>
            <label className="block text-sm font-medium mb-2">New Expiry Date</label>
            <input
              type="date"
              value={expiryModal.date}
              onChange={(e) => setExpiryModal({...expiryModal, date: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setExpiryModal({ open: false, user: null, date: "" })}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleExpiryUpdate}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Update Date
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <h1 className="text-3xl text-center font-bold">User Management</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => setAddModal({ open: true })}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus size={18} /> Add User
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={18} /> Export CSV ({filteredUsers.length})
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username, name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAdvancedFilter ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Filter size={18} /> Filter
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showAdvancedFilter && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={advancedFilter.role}
                  onChange={(e) => setAdvancedFilter({...advancedFilter, role: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Type</label>
                <select
                  value={advancedFilter.businessType}
                  onChange={(e) => setAdvancedFilter({...advancedFilter, businessType: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={advancedFilter.gender}
                  onChange={(e) => setAdvancedFilter({...advancedFilter, gender: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Genders</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={advancedFilter.language}
                  onChange={(e) => setAdvancedFilter({...advancedFilter, language: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <select
                  value={advancedFilter.plan}
                  onChange={(e) => setAdvancedFilter({...advancedFilter, plan: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Plans</option>
                  {plans.map(plan => (
                    <option key={plan} value={plan}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={advancedFilter.status}
                  onChange={(e) => setAdvancedFilter({...advancedFilter, status: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "active", "blocked", "free", "starter", "premium"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f 
                ? "bg-blue-500 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({
              f === "all" ? users.length :
              f === "premium" ? users.filter(u => u.plan === "premium").length :
              f === "starter" ? users.filter(u => u.plan === "starter").length :
              f === "free" ? users.filter(u => u.plan === "free").length :
              f === "active" ? users.filter(u => u.status === "active").length :
              users.filter(u => u.status === "blocked").length
            })
          </button>
        ))}
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Username</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Password</th>
                <th className="px-4 py-3 text-left font-semibold">IP Address</th>
                <th className="px-4 py-3 text-left font-semibold">Birthday</th>
                <th className="px-4 py-3 text-left font-semibold">Gender</th>
                <th className="px-4 py-3 text-left font-semibold">Language</th>
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Health</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Business Type</th>
                <th className="px-4 py-3 text-left font-semibold">Expiry</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.username}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-blue-600">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {showPasswords[user.id] ? user.password : "•".repeat(user.password.length)}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{user.ipAddress}</td>
                  <td className="px-4 py-3">{user.birthday}</td>
                  <td className="px-4 py-3 capitalize">{user.gender}</td>
                  <td className="px-4 py-3">{user.language}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.plan === "premium" ? "bg-green-100 text-green-800" :
                      user.plan === "starter" ? "bg-blue-100 text-blue-800" :
                      user.plan === "free" ? "bg-gray-100 text-gray-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`px-3 py-1 rounded-full text-white text-sm text-center ${
                      user.health > 70 ? "bg-green-500" : user.health > 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}>
                      {user.health}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "manager" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                      {user.businessType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.expiryDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditModal({ open: true, user })}
                        title="Edit User"
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => confirmAction(
                          `${user.status === "active" ? "Block" : "Activate"} ${user.name}?`,
                          () => updateStatus(user.id, user.status === "active" ? "blocked" : "active")
                        )}
                        title={user.status === "active" ? "Block User" : "Activate User"}
                        className={`text-white p-2 rounded transition-colors ${
                          user.status === "active" 
                            ? "bg-red-500 hover:bg-red-600" 
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.status === "active" ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>

                      <button
                        onClick={() => confirmAction(
                          `Add Premium plan to ${user.name}?`,
                          () => addPremiumPlan(user.id)
                        )}
                        title="Add Premium Plan"
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                      >
                        <Star size={16} />
                      </button>

                      <button
                        onClick={() => setExpiryModal({ open: true, user, date: user.expiryDate })}
                        title="Change Expiry Date"
                        className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === "active").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-gray-600 text-sm">Premium Users</p>
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.plan === "premium").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-gray-600 text-sm">Blocked Users</p>
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === "blocked").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-gray-600 text-sm">Managers</p>
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === "manager").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-gray-600 text-sm">Regular Users</p>
          <p className="text-2xl font-bold text-gray-600">{users.filter(u => u.role === "regular user").length}</p>
        </div>
      </div>

      {/* Modals */}
      <AddModal />
      <EditModal />
      <ExpiryModal />

      {/* Confirmation Modal - Now with highest z-index */}
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="mb-6 text-gray-700">{modal.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal({ ...modal, open: false })}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  modal.onConfirm();
                  setModal({ ...modal, open: false });
                }}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
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