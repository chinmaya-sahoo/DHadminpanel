import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

function toIST(dateString) {
  return new Date(dateString).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [stateFilter, setStateFilter] = useState([]);
  const [showStateFilter, setShowStateFilter] = useState(false);
  
  // Indian states list (same as checkout page)
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh", 
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Puducherry",
    "Andaman and Nicobar Islands"
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders();
      const ordersData = response.data.orders || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  // Filter orders by multiple states
  const handleStateFilterChange = (selectedStates) => {
    setStateFilter(selectedStates);
    if (selectedStates.length === 0) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => {
        const orderState = order.state || (order.address && order.address.state);
        return selectedStates.includes(orderState);
      });
      setFilteredOrders(filtered);
    }
  };

  const toggleStateFilter = (state) => {
    const newFilter = stateFilter.includes(state)
      ? stateFilter.filter(s => s !== state)
      : [...stateFilter, state];
    handleStateFilterChange(newFilter);
  };

  const clearAllFilters = () => {
    setStateFilter([]);
    setFilteredOrders(orders);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      setError(null);
      setSuccess(null);
      
      await apiService.updateOrderStatus(orderId, newStatus);
      
      setSuccess(`Order status updated to ${newStatus} successfully!`);
      fetchOrders(); // Refresh orders list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    manufacturing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_upfront: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-600 text-center p-4">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Filter by State
              </label>
              <button
                onClick={() => setShowStateFilter(!showStateFilter)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showStateFilter ? 'Hide' : 'Show'} States
              </button>
            </div>
            
            {showStateFilter && (
              <div className="border border-gray-300 rounded-md p-3 bg-gray-50 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {indianStates.map((state) => (
                    <label key={state} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={stateFilter.includes(state)}
                        onChange={() => toggleStateFilter(state)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{state}</span>
                    </label>
                  ))}
                </div>
                {stateFilter.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {stateFilter.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Selected: </span>
                <span className="text-xs text-indigo-600 font-medium">
                  {stateFilter.join(', ')}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="w-full" style={{ minWidth: '900px' }}>
          <table className="w-full min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const firstItem = order.items && order.items[0];
                const orderName = firstItem?.name || firstItem?.type || firstItem?.text || 'Order';
                return (
                <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{orderName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {toIST(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updatingOrder === order._id}
                      className={`text-sm rounded-full px-3 py-1 font-semibold ${statusColors[order.orderStatus]} ${updatingOrder === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                          {updatingOrder === order._id && status === order.orderStatus ? ' (Updating...)' : ''}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus === 'pending_upfront' ? 'Upfront Paid' : order.paymentStatus}
                    </span>
                    {order.paymentMethod === 'cod' && order.upfrontAmount > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        ₹{order.upfrontAmount} upfront
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
      {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg mx-auto bg-white bg-opacity-80 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white bg-opacity-70 rounded-full p-2 shadow"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2 text-indigo-700 text-center">
                {selectedOrder.items?.[0]?.name || selectedOrder.items?.[0]?.type || selectedOrder.items?.[0]?.text || 'Order'}
              </h2>
              <div className="text-center text-xs text-gray-400 mb-4">Order ID: {selectedOrder._id}</div>
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p>Name: {selectedOrder.customerName}</p>
                <p>Email: {selectedOrder.email}</p>
                <p>Phone: {selectedOrder.phone}</p>
              </div>

              {/* Shipping Address */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p>{selectedOrder.address.street}</p>
                <p>{selectedOrder.address.city}, {selectedOrder.address.state}</p>
                <p>{selectedOrder.address.pincode}, {selectedOrder.address.country}</p>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.name || item.type || 'Item'}</span>
                        <span>₹{item.price}</span>
                      </div>
                      <p>Quantity: {item.quantity}</p>
                      {item.color && <p>Color: {item.color}</p>}
                      {item.size && <p>Size: {item.size}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">Payment Information</h4>
                <p>Method: {selectedOrder.paymentMethod?.toUpperCase()}</p>
                <p>Status: {selectedOrder.paymentStatus}</p>
                {selectedOrder.paymentMethod === 'cod' && selectedOrder.upfrontAmount > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800 text-sm font-medium">COD Payment Breakdown:</p>
                    <p className="text-blue-700 text-xs">✅ Upfront Paid: ₹{selectedOrder.upfrontAmount}</p>
                    <p className="text-blue-700 text-xs">💰 On Delivery: ₹{selectedOrder.remainingAmount}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <p className="font-bold">Total Amount: ₹{selectedOrder.totalAmount}</p>
              </div>
            </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;