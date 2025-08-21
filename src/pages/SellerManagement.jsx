import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMail, FiPhone, FiMapPin, FiCalendar, FiTag, FiLink, FiDollarSign, FiShoppingCart, FiSmartphone, FiDownload, FiEdit, FiTrash2, FiEye, FiTrendingUp, FiFilter, FiArrowUp, FiArrowDown, FiX, FiCheck, FiXCircle, FiClock, FiImage } from 'react-icons/fi';
import config from '../config/config';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader.jsx';
import RikoCraftPoster from '../components/RikoCraftPoster.jsx';
import RikoCraftcert from '../components/RikoCraftcert.jsx';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQRCode, setCurrentQRCode] = useState('/qr.jpg');
  const posterRef = useRef();
  const certRef = useRef();
  const [editingSeller, setEditingSeller] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);
  const [sortBy, setSortBy] = useState('joinedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBlocked, setFilterBlocked] = useState('all');
  const [withdrawalActionLoading, setWithdrawalActionLoading] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showAllApprovals, setShowAllApprovals] = useState(false);
  const [sellerWithdrawals, setSellerWithdrawals] = useState([]);
  const [sellerWithdrawalsLoading, setSellerWithdrawalsLoading] = useState(false);
  const [sellerCommissions, setSellerCommissions] = useState([]);
  const [sellerCommissionsLoading, setSellerCommissionsLoading] = useState(false);
  const [showCommissions, setShowCommissions] = useState(false);
  const [commissionActionLoading, setCommissionActionLoading] = useState(null);

  useEffect(() => {
    fetchSellers();
    fetchAllWithdrawals();
  }, []);

  const fetchSellers = async () => {
    try {
      console.log('Fetching sellers from:', `${config.API_URLS.SELLER}/all`);
      
      const response = await fetch(`${config.API_URLS.SELLER}/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sellers');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch sellers');
      }

      // Check each seller object and their withdrawals
      data.sellers.forEach(seller => {

        

      });

      setSellers(data.sellers || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
     
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWithdrawals = async () => {
    try {

      const response = await fetch(`${config.API_URLS.WITHDRAWAL}/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch withdrawals');
      setWithdrawals(data.withdrawals || []);

    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error(error.message || 'Error fetching withdrawals');
    }
  };

  const fetchSellerCommissions = async (sellerId) => {
    try {

      const response = await fetch(`${config.API_URLS.COMMISSION}/admin/all?sellerId=${sellerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch commissions');
      setSellerCommissions(data.commissionHistory || []);

    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast.error(error.message || 'Error fetching commissions');
    }
  };

  const downloadQRCode = async (seller) => {
    if (!seller.qrCode) {
      toast.error('QR code not available for this seller');
      return;
    }
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      import('../components/RikoCraftPoster.jsx').then(({ default: RikoCraftPoster }) => {
        const root = createRoot(tempDiv);
        root.render(<RikoCraftPoster qrSrc={seller.qrCode} />);
        setTimeout(async () => {
          const canvas = await html2canvas(tempDiv, { backgroundColor: null, useCORS: true });
          const url = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = url;
          link.download = `${seller.businessName}-poster.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          root.unmount();
          document.body.removeChild(tempDiv);
          toast.success('Poster downloaded successfully!');
        }, 200);
      });
    } catch (error) {
      console.error('Error downloading poster:', error);
      toast.error('Failed to download poster');
    }
  };

  const downloadcert = async (seller) => {
    if (!seller.qrCode) {
      toast.error('QR code not available for this seller');
      return;
    }
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      import('../components/RikoCraftcert.jsx').then(({ default: RikoCraftcert }) => {
        const root = createRoot(tempDiv);
        root.render(<RikoCraftcert qrSrc={seller.qrCode} />);
        setTimeout(async () => {
          const canvas = await html2canvas(tempDiv, { backgroundColor: null, useCORS: true });
          const url = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = url;
          link.download = `${seller.businessName}-poster.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          root.unmount();
          document.body.removeChild(tempDiv);
          toast.success('certificate downloaded successfully!');
        }, 200);
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };


  const handleDeleteSeller = async (sellerId) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URLS.SELLER}/${sellerId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to delete seller');
      toast.success('Seller deleted successfully');
      fetchSellers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete seller');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (seller) => {
    setEditingSeller(seller);
    setEditForm({
      businessName: seller.businessName || '',
      phone: seller.phone || '',
      address: seller.address || '',
      businessType: seller.businessType || '',
      accountHolderName: seller.accountHolderName || '',
      bankAccountNumber: seller.bankAccountNumber || '',
      ifscCode: seller.ifscCode || '',
      bankName: seller.bankName || '',
      blocked: !!seller.blocked,
      upi: seller.upi || seller.bankDetails?.upi || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      // Update profile fields
      const response = await fetch(`${config.API_URLS.SELLER}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, email: editingSeller.email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to update seller');
      // Update blocked status if changed
      if (editingSeller.blocked !== editForm.blocked) {
        const blockRes = await fetch(`${config.API_URLS.SELLER}/${editingSeller._id}/block`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocked: editForm.blocked }),
        });
        const blockData = await blockRes.json();
        if (!blockRes.ok || !blockData.success) throw new Error(blockData.message || 'Failed to update block status');
      }
      toast.success('Seller updated successfully');
      setEditingSeller(null);
      fetchSellers();
    } catch (err) {
      toast.error(err.message || 'Failed to update seller');
    } finally {
      setEditLoading(false);
    }
  };

  const getTotalWithdrawalAmount = (seller) => {
    if (!seller.withdrawals || seller.withdrawals.length === 0) return 0;
    return seller.withdrawals.reduce((total, withdrawal) => total + (withdrawal.amount || 0), 0);
  };

  const getWithdrawalRequestsCount = (seller) => {
    if (!seller.withdrawals) return 0;
    return seller.withdrawals.filter(w => w.status === 'pending').length;
  };

  // Helper function to get bank details from seller
  const getBankDetails = (seller) => {
    // Check if bankDetails object exists
    if (seller.bankDetails) {
      return {
        accountHolderName: seller.bankDetails.accountName || seller.accountHolderName || '',
        accountNumber: seller.bankDetails.accountNumber || seller.bankAccountNumber || '',
        ifscCode: seller.bankDetails.ifsc || seller.ifscCode || '',
        bankName: seller.bankDetails.bankName || seller.bankName || '',
        upi: seller.bankDetails.upi || seller.upi || ''
      };
    }
    
    // Fallback to individual fields
    return {
      accountHolderName: seller.accountHolderName || '',
      accountNumber: seller.bankAccountNumber || '',
      ifscCode: seller.ifscCode || '',
      bankName: seller.bankName || '',
      upi: seller.upi || ''
    };
  };

  // Handle withdrawal status updates
  const handleWithdrawalAction = async (withdrawalId, action, additionalData = {}) => {
    try {
      setWithdrawalActionLoading(withdrawalId);
      
      let url = '';
      let method = 'PATCH';
      let body = {};

      // Ensure withdrawalId is a string
      const withdrawalIdStr = withdrawalId?.toString();

      if (!withdrawalIdStr) {
        throw new Error('Invalid withdrawal ID');
      }

      switch (action) {
        case 'approve':
          url = `${config.API_URLS.WITHDRAWAL}/admin/approve/${withdrawalIdStr}`;
          break;
        case 'reject':
          url = `${config.API_URLS.WITHDRAWAL}/admin/reject/${withdrawalIdStr}`;
          body = { rejectionReason: additionalData.rejectionReason || 'Withdrawal request rejected' };
          break;
        case 'complete':
          url = `${config.API_URLS.WITHDRAWAL}/admin/complete/${withdrawalIdStr}`;
          break;
        default:
          throw new Error('Invalid action');
      }

      console.log('Making withdrawal action request:', {
        url,
        method,
        action,
        withdrawalId: withdrawalIdStr,
        body
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} withdrawal`);
      }

      if (!data.success) {
        throw new Error(data.message || `Failed to ${action} withdrawal`);
      }

      toast.success(`Withdrawal ${action}d successfully`);
      
      // Refresh sellers data to get updated withdrawal status
      await fetchSellers();
      
      // Update selected seller if viewing details
      if (selectedSeller) {
        try {
          const updatedSellersResponse = await fetch(`${config.API_URLS.SELLER}/all`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (updatedSellersResponse.ok) {
            const updatedSellersData = await updatedSellersResponse.json();
            if (updatedSellersData.success) {
              const updatedSeller = updatedSellersData.sellers.find(s => s._id === selectedSeller._id);
              if (updatedSeller) {
                setSelectedSeller(updatedSeller);
                console.log('Updated selected seller with new withdrawal status');
              }
            }
          }
        } catch (error) {
          console.error('Error updating selected seller:', error);
        }
      }
      
    } catch (error) {
      console.error(`Error ${action} withdrawal:`, error);
      toast.error(error.message || `Failed to ${action} withdrawal`);
    } finally {
      setWithdrawalActionLoading(null);
    }
  };

  const handleApprovalAction = async (sellerId, approved) => {
    try {
      const response = await fetch(`${config.API_URLS.SELLER}/${sellerId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ approved })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${approved ? 'approve' : 'disapprove'} seller`);
      }

      toast.success(`Seller ${approved ? 'approved' : 'disapproved'} successfully`);
      
      // Refresh sellers data
      await fetchSellers();
      
      // Update selected seller if viewing details
      if (selectedSeller && selectedSeller._id === sellerId) {
        try {
          const updatedSellersResponse = await fetch(`${config.API_URLS.SELLER}/all`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (updatedSellersResponse.ok) {
            const updatedSellersData = await updatedSellersResponse.json();
            if (updatedSellersData.success) {
              const updatedSeller = updatedSellersData.sellers.find(s => s._id === selectedSeller._id);
              if (updatedSeller) {
                setSelectedSeller(updatedSeller);
              }
            }
          }
        } catch (error) {
          console.error('Error updating selected seller:', error);
        }
      }
      
    } catch (error) {
      console.error(`Error updating approval status:`, error);
      toast.error(error.message || `Failed to update approval status`);
    }
  };

  const handleCommissionAction = async (commissionId, action, additionalData = {}) => {
    try {
      setCommissionActionLoading(commissionId);
      console.log(`Performing ${action} action on commission:`, commissionId);
      
      let url = '';
      let method = 'PUT';
      let body = {};
      
      switch (action) {
        case 'confirm':
          url = `${config.API_URLS.COMMISSION}/admin/confirm/${commissionId}`;
          break;
        case 'cancel':
          url = `${config.API_URLS.COMMISSION}/admin/cancel/${commissionId}`;
          body = { reason: additionalData.reason || 'No reason provided' };
          break;
        default:
          throw new Error('Invalid action');
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
      });
      
      const data = await response.json();
      console.log('Commission action response:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${action} commission`);
      }
      
      toast.success(`Commission ${action}ed successfully`);
      
      // Refresh the commissions list
      if (selectedSeller) {
        await fetchSellerCommissions(selectedSeller._id);
      }
      
    } catch (error) {
      console.error(`Error ${action}ing commission:`, error);
      toast.error(error.message || `Failed to ${action} commission`);
    } finally {
      setCommissionActionLoading(null);
    }
  };

  const sortSellers = (sellers) => {
    return [...sellers].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'joinedDate':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'withdrawalRequests':
          aValue = getWithdrawalRequestsCount(a);
          bValue = getWithdrawalRequestsCount(b);
          break;
        case 'totalWithdrawal':
          aValue = getTotalWithdrawalAmount(a);
          bValue = getTotalWithdrawalAmount(b);
          break;
        case 'businessName':
          aValue = a.businessName?.toLowerCase();
          bValue = b.businessName?.toLowerCase();
          break;
        case 'totalOrders':
          aValue = a.totalOrders || 0;
          bValue = b.totalOrders || 0;
          break;
        case 'totalCommission':
          aValue = a.totalCommission || 0;
          bValue = b.totalCommission || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filterSellers = (sellers) => {
    if (filterBlocked === 'all') return sellers;
    return sellers.filter(seller => 
      filterBlocked === 'blocked' ? seller.blocked : !seller.blocked
    );
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
    >
      {label}
      {sortBy === field && (
        sortOrder === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
      )}
    </button>
  );

  const filteredAndSortedSellers = sortSellers(filterSellers(sellers));

  // Fetch withdrawals for selected seller when modal opens
  useEffect(() => {
    if (showDetails && selectedSeller) {
      setSellerWithdrawalsLoading(true);
      fetch(`${config.API_URLS.WITHDRAWAL}/admin/by-seller/${selectedSeller._id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setSellerWithdrawals(data.withdrawals || []);
          setSellerWithdrawalsLoading(false);
        })
        .catch(() => setSellerWithdrawalsLoading(false));
    }
  }, [showDetails, selectedSeller]);

  // Fetch commissions for selected seller when modal opens
  useEffect(() => {
    if (showDetails && selectedSeller) {
      setSellerCommissionsLoading(true);
      fetchSellerCommissions(selectedSeller._id).finally(() => {
        setSellerCommissionsLoading(false);
      });
    }
  }, [showDetails, selectedSeller]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Hidden poster for download */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={posterRef}>
          <RikoCraftPoster qrSrc={currentQRCode} />
        </div>

        <div ref={certRef}>
          <RikoCraftcert qrSrc={currentQRCode} />
        </div>


        
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
        <p className="mt-2 text-gray-600">View and manage all registered sellers</p>
      </div>

      {/* Filters and Sort Controls */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filterBlocked}
              onChange={(e) => setFilterBlocked(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Sellers</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              <SortButton field="joinedDate" label="Join Date" />
              <SortButton field="withdrawalRequests" label="Withdrawal Requests" />
              <SortButton field="totalWithdrawal" label="Total Withdrawal" />
              <SortButton field="businessName" label="Business Name" />
              <SortButton field="totalOrders" label="Orders" />
              <SortButton field="totalCommission" label="Commission" />
            </div>
          </div>
          
          {/* Test Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllApprovals(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Show All Approvals
            </button>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawals</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedSellers.map((seller) => (
                <motion.tr
            key={seller._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Seller Info */}
                  <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <FiUsers className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                        <div className="text-sm font-semibold text-gray-900">{seller.businessName}</div>
                        <div className="text-xs text-gray-500">ID: {seller._id.slice(-8)}</div>
                        <div className="text-xs text-gray-500">Joined: {new Date(seller.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <FiMail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">{seller.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiPhone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">{seller.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiMapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900 truncate max-w-xs">{seller.address}</span>
                      </div>
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FiShoppingCart className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{seller.totalOrders || 0} Orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">₹{Math.round(seller.totalCommission || 0)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiTag className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-600 truncate">{seller.sellerToken}</span>
                  </div>
                </div>
                  </td>

                  {/* Withdrawals */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">₹{getTotalWithdrawalAmount(seller)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">{getWithdrawalRequestsCount(seller)} pending</span>
                      </div>
                      {seller.withdrawals && seller.withdrawals.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedSeller(seller);
                            setShowWithdrawals(true);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          View Details
                        </button>
                )}
              </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      {/* Approval Status */}
                      {seller.approved ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending Approval
                        </span>
                      )}
                      
                      {/* Block Status */}
                      {seller.blocked ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                      
                      {/* Approval Button */}
                      {!seller.approved && (
                        <button
                          onClick={() => handleApprovalAction(seller._id, true)}
                          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                          title="Approve Seller"
                        >
                          <FiCheck className="w-3 h-3" />
                          Approve
                        </button>
                      )}
                      
                      {seller.qrCode && (
                        <button
                          onClick={() => downloadQRCode(seller)}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800"
                        >
                          <FiDownload className="w-3 h-3" />
                          Download Poster
                        </button>
                      )}

{seller.qrCode && (
                        <button
                          onClick={() => downloadcert(seller)}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800"
                        >
                          <FiDownload className="w-3 h-3" />
                          Download certificate
                        </button>
                      )}
                </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSeller(seller);
                          setShowDetails(true);
                        }}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(seller)}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                        title="Edit Seller"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSeller(seller._id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        title="Delete Seller"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
                </div>
                </div>

      {filteredAndSortedSellers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No sellers found</p>
                </div>
      )}

      {/* Seller Details Modal */}
      {showDetails && selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Seller Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
                </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="space-y-3">
                  <div><span className="font-medium">Business Name:</span> {selectedSeller.businessName}</div>
                  <div><span className="font-medium">Email:</span> {selectedSeller.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedSeller.phone}</div>
                  <div><span className="font-medium">Address:</span> {selectedSeller.address}</div>
                  <div><span className="font-medium">Business Type:</span> {selectedSeller.businessType}</div>
                  <div><span className="font-medium">Joined:</span> {new Date(selectedSeller.createdAt).toLocaleString()}</div>
                  <div><span className="font-medium">Seller Token:</span> {selectedSeller.sellerToken}</div>
                  <div>
                    <span className="font-medium">Approval Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedSeller.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSeller.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                {(() => {
                  const bankDetails = getBankDetails(selectedSeller);
                  const hasBankDetails = bankDetails.accountHolderName || bankDetails.accountNumber || bankDetails.ifscCode || bankDetails.bankName;
                  
                  return hasBankDetails ? (
                    <div className="space-y-3">
                      {bankDetails.accountHolderName && (
                        <div><span className="font-medium">Account Holder:</span> {bankDetails.accountHolderName}</div>
                      )}
                      {bankDetails.accountNumber && (
                        <div><span className="font-medium">Account Number:</span> {bankDetails.accountNumber}</div>
                      )}
                      {bankDetails.ifscCode && (
                        <div><span className="font-medium">IFSC Code:</span> {bankDetails.ifscCode}</div>
                      )}
                      {bankDetails.bankName && (
                        <div><span className="font-medium">Bank Name:</span> {bankDetails.bankName}</div>
                      )}
                      {bankDetails.upi && (
                        <div><span className="font-medium">UPI:</span> {bankDetails.upi}</div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bank details available</p>
                  );
                })()}
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FiShoppingCart className="w-5 h-5 text-blue-500" />
                    <span><span className="font-medium">Total Orders:</span> {selectedSeller.totalOrders || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="w-5 h-5 text-green-500" />
                    <span><span className="font-medium">Total Commission:</span> ₹{Math.round(selectedSeller.totalCommission || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="w-5 h-5 text-orange-500" />
                    <span><span className="font-medium">Total Withdrawals:</span> ₹{getTotalWithdrawalAmount(selectedSeller)}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {selectedSeller.qrCode && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                  <div className="flex flex-col items-center space-y-3">
                    <img 
                      src={selectedSeller.qrCode} 
                      alt={`${selectedSeller.businessName} QR Code`} 
                      className="w-32 h-32 border border-gray-200 rounded-lg"
                    />
                    <button
                      onClick={() => downloadQRCode(selectedSeller)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download Poster
                    </button>
                  </div>
                </div>
              )}

              {/* Seller Images */}
              {Array.isArray(selectedSeller.images) && selectedSeller.images.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Business Images ({selectedSeller.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedSeller.images.map((image, index) => {
                      // Support both string and object formats
                      const imageUrl = typeof image === 'string' ? image : image?.url;
                      const imageAlt = typeof image === 'object' && image?.alt ? image.alt : `Business image ${index + 1}`;
                      if (!imageUrl) return null;
                      return (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => window.open(imageUrl, '_blank')}
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 p-2 rounded-full"
                              title="View full size"
                            >
                              <FiEye className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600">Click on any image to view it in full size</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Business Images</h3>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No images uploaded yet</p>
                    <p className="text-sm text-gray-400">This seller hasn't uploaded any business images</p>
                  </div>
                </div>
              )}

              {/* Withdrawals for this seller */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Withdrawals</h3>
                {sellerWithdrawalsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : sellerWithdrawals.length === 0 ? (
                  <p className="text-gray-500">No withdrawal requests found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Requested At</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sellerWithdrawals.map((withdrawal) => (
                          <tr key={withdrawal._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{withdrawal.amount}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                withdrawal.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : withdrawal.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : withdrawal.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {withdrawal.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {withdrawal.requestDate ? new Date(withdrawal.requestDate).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              {withdrawal.status === 'pending' && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={async () => {
                                      await handleWithdrawalAction(withdrawal._id, 'approve');
                                      // Refetch after action
                                      setSellerWithdrawalsLoading(true);
                                      fetch(`${config.API_URLS.WITHDRAWAL}/admin/by-seller/${selectedSeller._id}`, {
                                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                      })
                                        .then(res => res.json())
                                        .then(data => {
                                          setSellerWithdrawals(data.withdrawals || []);
                                          setSellerWithdrawalsLoading(false);
                                        })
                                        .catch(() => setSellerWithdrawalsLoading(false));
                                    }}
                                    disabled={withdrawalActionLoading === withdrawal._id}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                    title="Approve withdrawal"
                                  >
                                    {withdrawalActionLoading === withdrawal._id ? (
                                      <FiClock className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <FiCheck className="w-3 h-3" />
                                    )}
                                    Approve
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const reason = prompt('Enter rejection reason:');
                                      if (reason) {
                                        await handleWithdrawalAction(withdrawal._id, 'reject', { rejectionReason: reason });
                                        setSellerWithdrawalsLoading(true);
                                        fetch(`${config.API_URLS.WITHDRAWAL}/admin/by-seller/${selectedSeller._id}`, {
                                          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                        })
                                          .then(res => res.json())
                                          .then(data => {
                                            setSellerWithdrawals(data.withdrawals || []);
                                            setSellerWithdrawalsLoading(false);
                                          })
                                          .catch(() => setSellerWithdrawalsLoading(false));
                                      }
                                    }}
                                    disabled={withdrawalActionLoading === withdrawal._id}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                    title="Reject withdrawal"
                                  >
                                    {withdrawalActionLoading === withdrawal._id ? (
                                      <FiClock className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <FiXCircle className="w-3 h-3" />
                                    )}
                                    Reject
                                  </button>
                                </div>
                              )}
                              {withdrawal.status === 'approved' && (
                                <span className="text-xs text-blue-600 font-medium">Approved - Payment in 3-5 days</span>
                              )}
                              {withdrawal.status === 'completed' && (
                                <span className="text-xs text-green-600 font-medium">Payment Completed</span>
                              )}
                              {withdrawal.status === 'rejected' && (
                                <span className="text-xs text-red-600 font-medium">Rejected</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Commissions for this seller */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Commissions</h3>
                  <button
                    onClick={() => {
                      setSellerCommissionsLoading(true);
                      fetchSellerCommissions(selectedSeller._id).finally(() => {
                        setSellerCommissionsLoading(false);
                      });
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                {sellerCommissionsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : sellerCommissions.length === 0 ? (
                  <p className="text-gray-500">No commission records found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sellerCommissions.map((commission) => (
                          <tr key={commission._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                commission.type === 'earned' 
                                  ? 'bg-green-100 text-green-800' 
                                  : commission.type === 'deducted'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {commission.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{commission.amount}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                commission.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : commission.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : commission.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {commission.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {commission.createdAt ? new Date(commission.createdAt).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              {commission.status === 'pending' && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={async () => {
                                      await handleCommissionAction(commission._id, 'confirm');
                                    }}
                                    disabled={commissionActionLoading === commission._id}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                    title="Confirm commission"
                                  >
                                    {commissionActionLoading === commission._id ? (
                                      <FiClock className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <FiCheck className="w-3 h-3" />
                                    )}
                                    Confirm
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const reason = prompt('Enter cancellation reason:');
                                      if (reason) {
                                        await handleCommissionAction(commission._id, 'cancel', { reason });
                                      }
                                    }}
                                    disabled={commissionActionLoading === commission._id}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                    title="Cancel commission"
                                  >
                                    {commissionActionLoading === commission._id ? (
                                      <FiClock className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <FiXCircle className="w-3 h-3" />
                                    )}
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {commission.status === 'confirmed' && (
                                <span className="text-xs text-green-600 font-medium">Confirmed</span>
                              )}
                              {commission.status === 'cancelled' && (
                                <span className="text-xs text-red-600 font-medium">Cancelled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawals Modal */}
      {showWithdrawals && selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Withdrawal Requests - {selectedSeller.businessName}</h2>
              <button
                onClick={() => setShowWithdrawals(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            {selectedSeller.withdrawals && selectedSeller.withdrawals.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Requests</div>
                    <div className="text-2xl font-bold text-blue-900">{selectedSeller.withdrawals.length}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium">Pending</div>
                    <div className="text-2xl font-bold text-yellow-900">{selectedSeller.withdrawals.filter(w => w.status === 'pending').length}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Completed</div>
                    <div className="text-2xl font-bold text-green-900">{selectedSeller.withdrawals.filter(w => w.status === 'completed').length}</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">Rejected</div>
                    <div className="text-2xl font-bold text-red-900">{selectedSeller.withdrawals.filter(w => w.status === 'rejected').length}</div>
                </div>
              </div>

                  <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Requested At</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bank Details</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedSeller.withdrawals.slice().reverse().map((withdrawal, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{withdrawal.amount}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              withdrawal.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : withdrawal.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : withdrawal.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {withdrawal.requestedAt ? new Date(withdrawal.requestedAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {withdrawal.bankDetails ? (
                              <div className="space-y-1">
                                <div><span className="font-medium">Name:</span> {withdrawal.bankDetails.accountName}</div>
                                <div><span className="font-medium">Account:</span> {withdrawal.bankDetails.accountNumber}</div>
                                <div><span className="font-medium">IFSC:</span> {withdrawal.bankDetails.ifsc}</div>
                                <div><span className="font-medium">Bank:</span> {withdrawal.bankDetails.bankName}</div>
                                <div><span className="font-medium">UPI:</span> {withdrawal.bankDetails.upi}</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">No details available</span>
                            )}
                            </td>
                          <td className="px-4 py-3">
                            {withdrawal.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    console.log('Approving withdrawal with ID:', withdrawal._id);
                                    handleWithdrawalAction(withdrawal._id, 'approve');
                                  }}
                                  disabled={withdrawalActionLoading === withdrawal._id}
                                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                  title="Approve withdrawal"
                                >
                                  {withdrawalActionLoading === withdrawal._id ? (
                                    <FiClock className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <FiCheck className="w-3 h-3" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Enter rejection reason:');
                                    if (reason) {
                                      console.log('Rejecting withdrawal with ID:', withdrawal._id);
                                      handleWithdrawalAction(withdrawal._id, 'reject', { rejectionReason: reason });
                                    }
                                  }}
                                  disabled={withdrawalActionLoading === withdrawal._id}
                                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                  title="Reject withdrawal"
                                >
                                  {withdrawalActionLoading === withdrawal._id ? (
                                    <FiClock className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <FiXCircle className="w-3 h-3" />
                                  )}
                                  Reject
                                </button>
                              </div>
                            )}
                            {withdrawal.status === 'approved' && (
                              <span className="text-xs text-blue-600 font-medium">Approved - Payment in 3-5 days</span>
                            )}
                            {withdrawal.status === 'completed' && (
                              <span className="text-xs text-green-600 font-medium">Payment Completed</span>
                            )}
                            {withdrawal.status === 'rejected' && (
                              <span className="text-xs text-red-600 font-medium">Rejected</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No withdrawal requests found</p>
              </div>
            )}
      </div>
        </div>
      )}

      {/* Edit Seller Modal */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Seller</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="text" name="businessName" value={editForm.businessName} onChange={handleEditChange} placeholder="Business Name" className="w-full border rounded p-2" required />
              <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Phone" className="w-full border rounded p-2" />
              <input type="text" name="address" value={editForm.address} onChange={handleEditChange} placeholder="Address" className="w-full border rounded p-2" />
              <input type="text" name="businessType" value={editForm.businessType} onChange={handleEditChange} placeholder="Business Type" className="w-full border rounded p-2" />
              <input type="text" name="accountHolderName" value={editForm.accountHolderName} onChange={handleEditChange} placeholder="Account Holder Name" className="w-full border rounded p-2" />
              <input type="text" name="bankAccountNumber" value={editForm.bankAccountNumber} onChange={handleEditChange} placeholder="Bank Account Number" className="w-full border rounded p-2" />
              <input type="text" name="ifscCode" value={editForm.ifscCode} onChange={handleEditChange} placeholder="IFSC Code" className="w-full border rounded p-2" />
              <input type="text" name="bankName" value={editForm.bankName} onChange={handleEditChange} placeholder="Bank Name" className="w-full border rounded p-2" />
              <input type="text" name="upi" value={editForm.upi} onChange={handleEditChange} placeholder="UPI ID" className="w-full border rounded p-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="blocked" checked={editForm.blocked} onChange={handleEditChange} />
                Block Seller
              </label>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setEditingSeller(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={editLoading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">{editLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Withdrawals Modal */}
      {showAllApprovals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Withdrawal Requests</h2>
              <button
                onClick={() => setShowAllApprovals(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Seller</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Requested At</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawals.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No withdrawal requests found</td></tr>
                  ) : (
                    withdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {withdrawal.seller
                            ? typeof withdrawal.seller === 'object'
                              ? withdrawal.seller.businessName || withdrawal.seller._id
                              : withdrawal.seller
                            : 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{withdrawal.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            withdrawal.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : withdrawal.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : withdrawal.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {withdrawal.requestedAt ? new Date(withdrawal.requestedAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {withdrawal.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  await handleWithdrawalAction(withdrawal._id, 'approve');
                                  fetchAllWithdrawals();
                                }}
                                disabled={withdrawalActionLoading === withdrawal._id}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                title="Approve withdrawal"
                              >
                                {withdrawalActionLoading === withdrawal._id ? (
                                  <FiClock className="w-3 h-3 animate-spin" />
                                ) : (
                                  <FiCheck className="w-3 h-3" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={async () => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) {
                                    await handleWithdrawalAction(withdrawal._id, 'reject', { rejectionReason: reason });
                                    fetchAllWithdrawals();
                                  }
                                }}
                                disabled={withdrawalActionLoading === withdrawal._id}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                title="Reject withdrawal"
                              >
                                {withdrawalActionLoading === withdrawal._id ? (
                                  <FiClock className="w-3 h-3 animate-spin" />
                                ) : (
                                  <FiXCircle className="w-3 h-3" />
                                )}
                                Reject
                              </button>
                            </div>
                          )}
                          {withdrawal.status === 'approved' && (
                            <span className="text-xs text-blue-600 font-medium">Approved - Payment in 3-5 days</span>
                          )}
                          {withdrawal.status === 'completed' && (
                            <span className="text-xs text-green-600 font-medium">Payment Completed</span>
                          )}
                          {withdrawal.status === 'rejected' && (
                            <span className="text-xs text-red-600 font-medium">Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagement; 