import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Download, Filter, Search, Loader2, Calendar } from "lucide-react";
import apiService from '../../services/api';


const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 20,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [summary, setSummary] = useState({
    total_payments: 0,
    successful_payments: 0,
    pending_payments: 0,
    failed_payments: 0,
    total_amount: 0,
    successful_amount: 0
  });

  // Fetch payments from API
  const fetchPayments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.currentPage,
        limit: pagination.perPage,
        ...params
      };

      // Add filters to query params
      // Note: Status filter removed as backend now only returns 'paid' payments
      if (subscriptionTypeFilter !== 'All') {
        queryParams.subscription_type = subscriptionTypeFilter;
      }
      if (dateRange.startDate) {
        queryParams.start_date = dateRange.startDate;
      }
      if (dateRange.endDate) {
        queryParams.end_date = dateRange.endDate;
      }
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      const response = await apiService.getPaymentHistory(queryParams);
      console.log('Payment History API Response:', response); // Debug log

      if (response && response.success) {
        setPayments(response.data.payments || []);
        setPagination(prev => response.data.pagination || prev);
        setSummary(prev => response.data.summary || prev);
      } else {
        setError('Failed to fetch payment history');
        setPayments([]);
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError(err.message || 'Failed to fetch payment history');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.perPage, subscriptionTypeFilter, dateRange, searchTerm]);

  // Fetch payments on component mount and when filters change
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments; // API handles filtering, so we use payments directly

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed':
      case 'declined': return 'bg-red-100 text-red-800';
      case 'pending':
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ['Transaction ID', 'Order ID', 'User Name', 'Email', 'Mobile', 'Plan Name', 'Amount', 'Currency', 'Status', 'Payment Date'],
      ...filteredPayments.map(payment => [
        payment.transaction_id,
        payment.order_id,
        payment.user_name,
        payment.user_email,
        payment.user_phone_code + payment.user_mobile,
        payment.plan_name,
        payment.amount,
        payment.currency,
        payment.status_label || payment.status,
        payment.payment_date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading payment history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">All Payments</h2>
        <button
          onClick={exportPayments}
          className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base"
          disabled={loading}
        >
          <Download size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-xs sm:text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={() => setError(null)}
                  className="bg-red-100 px-3 py-1 rounded text-xs sm:text-sm text-red-800 hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <select
            value={subscriptionTypeFilter}
            onChange={(e) => setSubscriptionTypeFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="All">All Types</option>
            <option value="1">Yearly</option>
            <option value="2">Monthly</option>
            <option value="3">Lifetime</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSubscriptionTypeFilter('All');
              setDateRange({ startDate: '', endDate: '' });
            }}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Filter size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Date Range Filter - Separate Row */}
        <div className="mt-3 sm:mt-4">
          <div className="flex gap-2">
            <input
              type="date"
              placeholder="Start Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            />
            <input
              type="date"
              placeholder="End Date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredPayments) && filteredPayments.map((payment) => (
                <tr key={payment.transaction_id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.transaction_id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium text-gray-900">{payment.user_name}</div>
                      <div className="text-gray-500">{payment.user_email}</div>
                      <div className="text-gray-500">{payment.user_phone_code}{payment.user_mobile}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium">{payment.plan_name}</div>
                      <div className="text-gray-500">{payment.subscription_type_label}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium">{payment.currency} {payment.amount}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.payment_date}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status_label || payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {Array.isArray(filteredPayments) && filteredPayments.map((payment) => (
            <div key={payment.transaction_id} className="border-b border-gray-200 p-3 sm:p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{payment.user_name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status_label || payment.status}
                    </span>
                  </div>

                  <div className="space-y-1 mb-2">
                    <p className="text-xs text-gray-500">Transaction: {payment.transaction_id}</p>
                    <p className="text-xs text-gray-500">{payment.user_email}</p>
                    <p className="text-xs text-gray-500">{payment.user_phone_code}{payment.user_mobile}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Plan:</span>
                      <span className="text-xs font-medium">{payment.plan_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Amount:</span>
                      <span className="text-xs font-medium">{payment.currency} {payment.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Date:</span>
                      <span className="text-xs font-medium">{payment.payment_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(filteredPayments) && filteredPayments.length === 0 && !loading && (
          <div className="text-center py-8">
            <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
              disabled={!pagination.hasPrevPage || loading}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
              disabled={!pagination.hasNextPage || loading}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.currentPage - 1) * pagination.perPage) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.perPage, pagination.totalRecords)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalRecords}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  disabled={!pagination.hasPrevPage || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  disabled={!pagination.hasNextPage || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Payments</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{summary.total_payments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Successful</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{summary.successful_payments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{summary.pending_payments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Failed</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{summary.failed_payments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">₹{summary.total_amount?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Successful Revenue</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">₹{summary.successful_amount?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
