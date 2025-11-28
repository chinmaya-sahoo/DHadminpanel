import React, { useState } from "react";
import { RefreshCw, AlertTriangle, Search, Filter, Download, Play, Pause, Trash2 } from "lucide-react";

// Mock data for demonstration
const mockAutoRenewals = [
  {
    id: 1,
    email: "john@email.com",
    plan: "Premium",
    nextRenewal: "2024-10-20",
    amount: 499,
    status: "Scheduled",
    autoRenew: true,
    lastRenewal: "2024-07-20",
    renewalCount: 2
  },
  {
    id: 2,
    email: "alice@email.com",
    plan: "Starter",
    nextRenewal: "2024-09-15",
    amount: 199,
    status: "Scheduled",
    autoRenew: true,
    lastRenewal: "2024-08-15",
    renewalCount: 1
  },
  {
    id: 3,
    email: "bob@email.com",
    plan: "Premium",
    nextRenewal: "2024-09-01",
    amount: 499,
    status: "Paused",
    autoRenew: false,
    lastRenewal: "2024-06-01",
    renewalCount: 3
  },
];

const mockFailedPayments = [
  {
    id: 1,
    email: "bob@email.com",
    plan: "Premium",
    amount: 499,
    failedDate: "2024-08-18",
    reason: "Card Declined",
    retryCount: 2,
    nextRetry: "2024-08-25",
    status: "Retry Scheduled"
  },
  {
    id: 2,
    email: "charlie@email.com",
    plan: "Starter",
    amount: 199,
    failedDate: "2024-08-19",
    reason: "Insufficient Funds",
    retryCount: 1,
    nextRetry: "2024-08-26",
    status: "Retry Scheduled"
  },
  {
    id: 3,
    email: "diana@email.com",
    plan: "Premium",
    amount: 499,
    failedDate: "2024-08-17",
    reason: "Expired Card",
    retryCount: 3,
    nextRetry: "Manual",
    status: "Manual Intervention Required"
  },
];

const RenewalPayments = () => {
  const [autoRenewals, setAutoRenewals] = useState(mockAutoRenewals);
  const [failedPayments, setFailedPayments] = useState(mockFailedPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

  const filteredAutoRenewals = autoRenewals.filter(renewal => {
    const matchesSearch = renewal.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || renewal.status === statusFilter;
    const matchesPlan = planFilter === 'All' || renewal.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const filteredFailedPayments = failedPayments.filter(payment => {
    const matchesSearch = payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'All' || payment.plan === planFilter;

    return matchesSearch && matchesPlan;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Retry Scheduled': return 'bg-orange-100 text-orange-800';
      case 'Manual Intervention Required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleAutoRenew = (id) => {
    setAutoRenewals(autoRenewals.map(renewal =>
      renewal.id === id
        ? {
          ...renewal,
          autoRenew: !renewal.autoRenew,
          status: !renewal.autoRenew ? 'Scheduled' : 'Paused'
        }
        : renewal
    ));
  };

  const handleRetryPayment = (id) => {
    setFailedPayments(failedPayments.map(payment =>
      payment.id === id
        ? {
          ...payment,
          retryCount: payment.retryCount + 1,
          nextRetry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
        : payment
    ));
  };

  const handleCancelRenewal = (id) => {
    if (window.confirm('Are you sure you want to cancel this auto-renewal?')) {
      setAutoRenewals(autoRenewals.map(renewal =>
        renewal.id === id
          ? { ...renewal, status: 'Cancelled', autoRenew: false }
          : renewal
      ));
    }
  };

  const exportData = (type) => {
    const data = type === 'renewals' ? filteredAutoRenewals : filteredFailedPayments;
    const headers = type === 'renewals'
      ? ['Email', 'Plan', 'Next Renewal', 'Amount', 'Status', 'Last Renewal', 'Renewal Count']
      : ['Email', 'Plan', 'Amount', 'Failed Date', 'Reason', 'Retry Count', 'Next Retry', 'Status'];

    const csvContent = [
      headers,
      ...data.map(item =>
        type === 'renewals'
          ? [item.email, item.plan, item.nextRenewal, item.amount, item.status, item.lastRenewal, item.renewalCount]
          : [item.email, item.plan, item.amount, item.failedDate, item.reason, item.retryCount, item.nextRetry, item.status]
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDaysUntilRenewal = (nextRenewal) => {
    const today = new Date();
    const renewal = new Date(nextRenewal);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">🔄 Auto-renewals & Failed Payments</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Paused">Paused</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Plans</option>
            <option value="Premium">Premium</option>
            <option value="Starter">Starter</option>
            <option value="Freemium">Freemium</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setPlanFilter('All');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Auto Renewals */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Scheduled Auto-renewals
          </h3>
          <button
            onClick={() => exportData('renewals')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Plan</th>
                <th className="text-left p-4 font-semibold">Next Renewal</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Days Left</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAutoRenewals.map((renewal) => {
                const daysLeft = getDaysUntilRenewal(renewal.nextRenewal);
                return (
                  <tr key={renewal.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{renewal.email}</td>
                    <td className="p-4">{renewal.plan}</td>
                    <td className="p-4">{renewal.nextRenewal}</td>
                    <td className="p-4">₹{renewal.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(renewal.status)}`}>
                        {renewal.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${daysLeft > 7 ? 'bg-green-100 text-green-800' :
                        daysLeft > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleAutoRenew(renewal.id)}
                          className={`p-1 rounded ${renewal.autoRenew
                            ? 'text-yellow-600 hover:bg-yellow-100'
                            : 'text-green-600 hover:bg-green-100'
                            }`}
                          title={renewal.autoRenew ? 'Pause Auto Renew' : 'Enable Auto Renew'}
                        >
                          {renewal.autoRenew ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCancelRenewal(renewal.id)}
                          className="text-red-600 hover:bg-red-100 p-1 rounded"
                          title="Cancel Auto Renew"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAutoRenewals.length === 0 && (
          <div className="text-center py-8">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No auto-renewals found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Failed Payments */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Failed Payments
          </h3>
          <button
            onClick={() => exportData('failed')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Plan</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Failed Date</th>
                <th className="text-left p-4 font-semibold">Reason</th>
                <th className="text-left p-4 font-semibold">Retry Count</th>
                <th className="text-left p-4 font-semibold">Next Retry</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFailedPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{payment.email}</td>
                  <td className="p-4">{payment.plan}</td>
                  <td className="p-4">₹{payment.amount}</td>
                  <td className="p-4">{payment.failedDate}</td>
                  <td className="p-4">{payment.reason}</td>
                  <td className="p-4">{payment.retryCount}</td>
                  <td className="p-4">{payment.nextRetry}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRetryPayment(payment.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      disabled={payment.retryCount >= 3}
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFailedPayments.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No failed payments found</h3>
            <p className="text-gray-500">All payments are processing successfully!</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Scheduled Renewals</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredAutoRenewals.filter(r => r.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Failed Payments</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredFailedPayments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Paused Renewals</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredAutoRenewals.filter(r => r.status === 'Paused').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue at Risk</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{filteredFailedPayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalPayments;
