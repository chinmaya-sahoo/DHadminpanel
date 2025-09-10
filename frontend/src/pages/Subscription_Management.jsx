import React, { useState } from "react";
import { 
  Pencil, Save, PlusCircle, Trash2, CreditCard, Users, 
  Calendar, Gift, UserPlus, RefreshCw, PieChart, ChevronLeft, ChevronRight 
} from "lucide-react";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const allFeatures = [
  "Basic Access",
  "Storage Access",
  "Database Access",
  "Customer Activity Access",
  "Reports Access",
  "Download Data as CSV",
];

const initialPlans = [
  { id: 1, name: "Yearly Pro", cost: 999, validity: 365, features: ["Unlimited PDF/Excel export", "Auto backup (Google Drive)", "No ads", "Advanced charts (trendlines, category analytics)", "Multi-device sync", "Invoice generator"], recommended: true, savings: 200, savingsPercentage: 1, billingCycle: "yearly" },
  { id: 2, name: "Monthly Pro", cost: 100, validity: 30, features: ["Unlimited PDF/Excel export", "Auto backup (Google Drive)", "No ads", "Advanced charts (trendlines, category analytics)", "Multi-device sync", "Invoice generator"], recommended: false, billingCycle: "monthly" },
  { id: 3, name: "Referral", cost: 0, validity: 10, features: ["Basic Access"] }
];

// Mock data for demonstration
const mockPayments = [
  { id: 1, userId: "U001", email: "john@email.com", plan: "Premium", amount: 499, date: "2024-08-20", status: "Success", transactionId: "TXN001" },
  { id: 2, userId: "U002", email: "jane@email.com", plan: "Starter", amount: 199, date: "2024-08-19", status: "Success", transactionId: "TXN002" },
  { id: 3, userId: "U003", email: "bob@email.com", plan: "Premium", amount: 499, date: "2024-08-18", status: "Failed", transactionId: "TXN003" },
  { id: 4, userId: "U004", email: "alice@email.com", plan: "Starter", amount: 199, date: "2024-08-17", status: "Success", transactionId: "TXN004" },
];

const mockSubscriptionHistory = [
  { userId: "U001", email: "john@email.com", plan: "Premium", startDate: "2024-07-20", endDate: "2024-10-20", status: "Active", renewals: 2 },
  { userId: "U002", email: "jane@email.com", plan: "Starter", startDate: "2024-08-01", endDate: "2024-08-31", status: "Expired", renewals: 0 },
  { userId: "U003", email: "bob@email.com", plan: "Freemium", startDate: "2024-08-10", endDate: "2024-08-17", status: "Active", renewals: 1 },
];

const mockActiveSubscriptions = [
  { userId: "U001", email: "john@email.com", plan: "Premium", expiry: "2024-10-20", autoRenewal: true, status: "Active" },
  { userId: "U003", email: "bob@email.com", plan: "Freemium", expiry: "2024-08-30", autoRenewal: false, status: "Expiring Soon" },
  { userId: "U005", email: "charlie@email.com", plan: "Starter", expiry: "2024-09-15", autoRenewal: true, status: "Active" },
];

const mockCoupons = [
  { id: 1, code: "WELCOME50", discount: 50, type: "percentage", plan: "All", expiryDate: "2024-12-31", usageCount: 25, maxUsage: 100, status: "Active" },
  { id: 2, code: "FREEMONTH", discount: 100, type: "percentage", plan: "Starter", expiryDate: "2024-10-31", usageCount: 15, maxUsage: 50, status: "Active" },
];

const planDistributionData = [
  { name: "Freemium", value: 45, color: "#8884d8" },
  { name: "Starter", value: 30, color: "#82ca9d" },
  { name: "Premium", value: 20, color: "#ffc658" },
  { name: "Referral", value: 5, color: "#ff7300" },
];

// Component 1: List of All Payments
const PaymentsList = () => {
  const [payments] = useState(mockPayments);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">💳 All Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Transaction ID</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Plan</th>
              <th className="border border-gray-300 p-2 text-left">Amount</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{payment.transactionId}</td>
                <td className="border border-gray-300 p-2">{payment.email}</td>
                <td className="border border-gray-300 p-2">{payment.plan}</td>
                <td className="border border-gray-300 p-2">₹{payment.amount}</td>
                <td className="border border-gray-300 p-2">{payment.date}</td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === 'Success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component 2: User-wise Subscription History
const SubscriptionHistory = () => {
  const [history] = useState(mockSubscriptionHistory);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">👤 User Subscription History</h2>
      <div className="grid gap-4">
        {history.map((sub, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{sub.email}</h3>
                <p className="text-gray-600">User ID: {sub.userId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                sub.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {sub.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Plan</p>
                <p className="font-semibold">{sub.plan}</p>
              </div>
              <div>
                <p className="text-gray-500">Start Date</p>
                <p className="font-semibold">{sub.startDate}</p>
              </div>
              <div>
                <p className="text-gray-500">End Date</p>
                <p className="font-semibold">{sub.endDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Renewals</p>
                <p className="font-semibold">{sub.renewals}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component 3: Active Subscriptions
const ActiveSubscriptions = () => {
  const [activeSubscriptions] = useState(mockActiveSubscriptions);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">📅 Active Subscriptions</h2>
      <div className="grid gap-4">
        {activeSubscriptions.map((sub, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{sub.email}</h3>
                <p className="text-gray-600">Plan: {sub.plan}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                sub.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {sub.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-semibold">{sub.expiry}</p>
              </div>
              <div>
                <p className="text-gray-500">Auto Renewal</p>
                <p className={`font-semibold ${sub.autoRenewal ? 'text-green-600' : 'text-red-600'}`}>
                  {sub.autoRenewal ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component 4: Create Coupon Codes
const CouponManagement = () => {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    plan: 'All',
    expiryDate: '',
    maxUsage: ''
  });

  const handleCreateCoupon = () => {
    if (newCoupon.code && newCoupon.discount && newCoupon.expiryDate && newCoupon.maxUsage) {
      const coupon = {
        id: Date.now(),
        ...newCoupon,
        usageCount: 0,
        status: 'Active'
      };
      setCoupons([...coupons, coupon]);
      setNewCoupon({
        code: '',
        discount: '',
        type: 'percentage',
        plan: 'All',
        expiryDate: '',
        maxUsage: ''
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
        <h2 className="text-xl text-center font-semibold">Coupon Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">Create New Coupon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Discount Value"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
              className="p-2 border rounded"
            />
            <select
              value={newCoupon.type}
              onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
              className="p-2 border rounded"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <select
              value={newCoupon.plan}
              onChange={(e) => setNewCoupon({...newCoupon, plan: e.target.value})}
              className="p-2 border rounded"
            >
              <option value="All">All Plans</option>
              <option value="Starter">Starter</option>
              <option value="Premium">Premium</option>
            </select>
            <input
              type="date"
              value={newCoupon.expiryDate}
              onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Max Usage"
              value={newCoupon.maxUsage}
              onChange={(e) => setNewCoupon({...newCoupon, maxUsage: e.target.value})}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateCoupon}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{coupon.code}</h3>
                <p className="text-gray-600">
                  {coupon.discount}{coupon.type === 'percentage' ? '%' : '₹'} off on {coupon.plan}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {coupon.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Expiry</p>
                <p className="font-semibold">{coupon.expiryDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Usage</p>
                <p className="font-semibold">{coupon.usageCount}/{coupon.maxUsage}</p>
              </div>
              <div>
                <p className="text-gray-500">Plan</p>
                <p className="font-semibold">{coupon.plan}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component 5: Manual Subscription Upgrade
const ManualUpgrade = () => {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Starter');
  const [upgradeHistory, setUpgradeHistory] = useState([]);

  const handleManualUpgrade = () => {
    if (email) {
      const upgrade = {
        id: Date.now(),
        email,
        plan: selectedPlan,
        date: new Date().toISOString().split('T')[0],
        upgradedBy: 'Admin'
      };
      setUpgradeHistory([upgrade, ...upgradeHistory]);
      setEmail('');
      setSelectedPlan('Starter');
      // alert(`Successfully upgraded ${email} to ${selectedPlan} plan!`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">⬆️ Manual Subscription Upgrade</h2>
      
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-3">Upgrade User Subscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Freemium">Freemium</option>
            <option value="Starter">Starter</option>
            <option value="Premium">Premium</option>
          </select>
          <button
            onClick={handleManualUpgrade}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Upgrade User
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-3">Recent Manual Upgrades</h3>
        {upgradeHistory.length === 0 ? (
          <p className="text-gray-500">No manual upgrades yet</p>
        ) : (
          <div className="space-y-2">
            {upgradeHistory.map((upgrade) => (
              <div key={upgrade.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-semibold">{upgrade.email}</span>
                  <span className="text-gray-600 ml-2">→ {upgrade.plan}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {upgrade.date} by {upgrade.upgradedBy}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component 6: Auto-renewals and Failed Payments
const RenewalPayments = () => {
  const autoRenewals = [
    { email: "john@email.com", plan: "Premium", nextRenewal: "2024-10-20", amount: 499, status: "Scheduled" },
    { email: "alice@email.com", plan: "Starter", nextRenewal: "2024-09-15", amount: 199, status: "Scheduled" },
  ];

  const failedPayments = [
    { email: "bob@email.com", plan: "Premium", amount: 499, failedDate: "2024-08-18", reason: "Card Declined", retryCount: 2 },
    { email: "charlie@email.com", plan: "Starter", amount: 199, failedDate: "2024-08-19", reason: "Insufficient Funds", retryCount: 1 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">🔄 Auto-renewals & Failed Payments</h2>
      
      {/* Auto Renewals */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <RefreshCw size={16} />
          Scheduled Auto-renewals
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Plan</th>
                <th className="text-left p-2">Next Renewal</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {autoRenewals.map((renewal, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">{renewal.email}</td>
                  <td className="p-2">{renewal.plan}</td>
                  <td className="p-2">{renewal.nextRenewal}</td>
                  <td className="p-2">₹{renewal.amount}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {renewal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failed Payments */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CreditCard size={16} />
          Failed Payments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Plan</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Failed Date</th>
                <th className="text-left p-2">Reason</th>
                <th className="text-left p-2">Retry Count</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {failedPayments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">{payment.email}</td>
                  <td className="p-2">{payment.plan}</td>
                  <td className="p-2">₹{payment.amount}</td>
                  <td className="p-2">{payment.failedDate}</td>
                  <td className="p-2">{payment.reason}</td>
                  <td className="p-2">{payment.retryCount}</td>
                  <td className="p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                      Retry
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component 7: Plan Distribution Pie Chart
const PlanDistribution = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">📊 Plan Distribution</h2>
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer>
            <RechartsPieChart>
              <Pie
                data={planDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {planDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} users`} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {planDistributionData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="font-semibold">{item.name}</span>
              </div>
              <p className="text-2xl font-bold text-gray-700">{item.value}</p>
              <p className="text-sm text-gray-500">users</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Original Plan Management Component
const PlanManagement = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [editPlan, setEditPlan] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    cost: 0,
    validity: 0,
    features: []
  });
  
  // Add confirmation modal state
  const [modal, setModal] = useState({ open: false, message: "", onConfirm: null });

  // Confirmation function (same as in User Management)
  const confirmAction = (msg, action) => {
    setModal({ open: true, message: msg, onConfirm: action });
  };

  // Create a new plan
  const handleCreatePlan = () => {
    if (newPlan.name && newPlan.cost >= 0 && newPlan.validity >= 0) {
      const plan = {
        id: Date.now(),
        name: newPlan.name,
        cost: parseFloat(newPlan.cost),
        validity: parseInt(newPlan.validity),
        features: [...newPlan.features]
      };
      
      setPlans([...plans, plan]);
      setNewPlan({
        name: '',
        cost: 0,
        validity: 0,
        features: []
      });
      setIsCreating(false);
    }
  };

  // Update an existing plan
  const handleSave = (planId) => {
    setEditPlan(null);
    // The state is already updated through the controlled inputs
  };

  // Delete a plan (using confirmation modal)
  const handleDeletePlan = (planId) => {
    const planToDelete = plans.find(p => p.id === planId);
    confirmAction(
      `Are you sure you want to delete the "${planToDelete.name}" plan? This action cannot be undone.`,
      () => {
        setPlans(plans.filter(p => p.id !== planId));
      }
    );
  };

  // Add feature to a plan (for both new and existing plans)
  const handleFeatureAdd = (planId, feature) => {
    if (planId === 'new') {
      setNewPlan({
        ...newPlan,
        features: [...new Set([...newPlan.features, feature])]
      });
    } else {
      setPlans(plans.map(p =>
        p.id === planId
          ? { ...p, features: [...new Set([...p.features, feature])] }
          : p
      ));
    }
  };

  // Remove feature from a plan (for both new and existing plans)
  const handleFeatureRemove = (planId, feature) => {
    if (planId === 'new') {
      setNewPlan({
        ...newPlan,
        features: newPlan.features.filter(f => f !== feature)
      });
    } else {
      setPlans(plans.map(p =>
        p.id === planId
          ? { ...p, features: p.features.filter(f => f !== feature) }
          : p
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Plan Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Create New Plan
        </button>
      </div>

      {/* Create New Plan Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Plan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Enterprise, Professional"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost (₹)</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="499"
                  value={newPlan.cost}
                  onChange={(e) => setNewPlan({...newPlan, cost: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity (days)</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                  value={newPlan.validity}
                  onChange={(e) => setNewPlan({...newPlan, validity: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newPlan.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                    >
                      {f}
                      <button
                        onClick={() => handleFeatureRemove('new', f)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                
                <select
                  onChange={e => handleFeatureAdd('new', e.target.value)}
                  className="p-2 border rounded w-full"
                  defaultValue=""
                >
                  <option value="" disabled>
                    ➕ Add Feature
                  </option>
                  {allFeatures
                    .filter(f => !newPlan.features.includes(f))
                    .map((f, idx) => (
                      <option key={idx} value={f}>
                        {f}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsCreating(false);
                  setNewPlan({
                    name: '',
                    cost: 0,
                    validity: 0,
                    features: []
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!newPlan.name || newPlan.cost < 0 || newPlan.validity < 0}
                onClick={handleCreatePlan}
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded-lg shadow bg-white relative">
            {editPlan === plan.id ? (
              <>
                <input
                  type="text"
                  value={plan.name}
                  onChange={e =>
                    setPlans(plans.map(p => (p.id === plan.id ? { ...p, name: e.target.value } : p)))
                  }
                  className="w-full p-2 border rounded mb-2 font-bold text-lg"
                />
                <input
                  type="number"
                  value={plan.cost}
                  onChange={e =>
                    setPlans(plans.map(p => (p.id === plan.id ? { ...p, cost: e.target.value } : p)))
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Cost"
                />
                <input
                  type="number"
                  value={plan.validity}
                  onChange={e =>
                    setPlans(plans.map(p => (p.id === plan.id ? { ...p, validity: e.target.value } : p)))
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Validity (days)"
                />

                <div className="mb-2">
                  <h2 className="font-semibold mb-1">Features:</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {plan.features.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                      >
                        {f}
                        <button
                          onClick={() => handleFeatureRemove(plan.id, f)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <select
                    onChange={e => handleFeatureAdd(plan.id, e.target.value)}
                    className="p-2 border rounded w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      ➕ Add Feature
                    </option>
                    {allFeatures
                      .filter(f => !plan.features.includes(f))
                      .map((f, idx) => (
                        <option key={idx} value={f}>
                          {f}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(plan.id)}
                    className="flex-1 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={() => setEditPlan(null)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                  title="Delete plan"
                >
                  <Trash2 size={16} />
                </button>
                
                <h2 className="text-xl font-bold mb-2 pr-8">{plan.name}</h2>
                <p className="text-gray-700 font-bold">Cost: <span className="font-medium">₹{plan.cost}</span></p>
                <p className="text-gray-700 font-bold">Validity: <span className="font-medium">{plan.validity} days</span></p>

                <div className="mt-2">
                  <h3 className="font-semibold">Features:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setEditPlan(plan.id)}
                  className="mt-3 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <Pencil size={16} /> Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal - Same as in User Management */}
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
};
// Main Subscription Management Component with Navigation
export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { name: "Plan Management", icon: <CreditCard size={16} />, component: <PlanManagement /> },
    { name: "All Payments", icon: <CreditCard size={16} />, component: <PaymentsList /> },
    { name: "User History", icon: <Users size={16} />, component: <SubscriptionHistory /> },
    { name: "Active Plans", icon: <Calendar size={16} />, component: <ActiveSubscriptions /> },
    { name: "Coupons", icon: <Gift size={16} />, component: <CouponManagement /> },
    { name: "Manual Upgrade", icon: <UserPlus size={16} />, component: <ManualUpgrade /> },
    { name: "Auto-Renewals", icon: <RefreshCw size={16} />, component: <RenewalPayments /> },
    // { name: "Plan Distribution", icon: <PieChart size={16} />, component: <PlanDistribution /> }
  ];

  const nextTab = () => {
    setActiveTab((prev) => (prev + 1) % tabs.length);
  };

  const prevTab = () => {
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl gap-3 items-center font-bold text-gray-800">
              Subscription Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all subscription-related activities</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Previous Button */}
            {/* <button
              onClick={prevTab}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button> */}

            {/* Tab Navigation */}
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="flex flex-wrap lg:flex-nowrap overflow-x-hidden gap-1 sm:gap-2">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-xs sm:text-sm ${
                      activeTab === index
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden xs:inline sm:inline">{tab.name}</span>
                  </button>
              ))}
            </div>
          </div>

            {/* Next Button */}
            {/* <button
              onClick={nextTab}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button> */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {tabs[activeTab].component}
        </div>
      </div>

      {/* Tab Counter */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-semibold">
        {activeTab + 1} / {tabs.length}
      </div>
    </div>
  );
}