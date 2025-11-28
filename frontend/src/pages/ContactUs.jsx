import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Mail,
  Globe,
  Clock,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Download,
  Smartphone,
  Monitor,
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import apiService from '../services/api';
import { formatDate } from '../utils/dateUtils';

const ContactUs = () => {
  // State management
  const [contactConfigs, setContactConfigs] = useState([]);
  const [appDownloadLinks, setAppDownloadLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState('contact-configs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    config_type: 'whatsapp',
    config_key: '',
    config_value: '',
    display_text: '',
    icon_name: '',
    sort_order: 0,
    is_active: true
  });

  const [linkFormData, setLinkFormData] = useState({
    platform: 'android',
    platform_name: '',
    download_url: '',
    icon_name: '',
    sort_order: 0,
    is_active: true
  });

  // Config key options based on config type
  const configKeyOptions = useMemo(() => ({
    whatsapp: [
      { value: 'whatsapp_number', label: 'WhatsApp Number' },
      { value: 'whatsapp_message', label: 'WhatsApp Message' }
    ],
    phone: [
      { value: 'phone_number', label: 'Phone Number' },
      { value: 'phone_message', label: 'Phone Message' }
    ],
    email: [
      { value: 'email_address', label: 'Email Address' },
      { value: 'email_message', label: 'Email Message' }
    ],
    website: [
      { value: 'website_url', label: 'Website URL' },
      { value: 'website_message', label: 'Website Message' }
    ],
    support_hours: [
      { value: 'support_hours', label: 'Support Hours' },
      { value: 'support_hours_message', label: 'Support Hours Message' },
    ]
  }), []);

  // Icon mapping based on config type
  const configTypeIconMapping = useMemo(() => ({
    whatsapp: 'whatsapp',
    phone: 'phone',
    email: 'mail',
    website: 'globe',
    support_hours: 'clock'
  }), []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Update config_key and icon_name when config_type changes
  useEffect(() => {
    if (showCreateModal || (showEditModal && editingItem)) {
      const options = configKeyOptions[formData.config_type] || [];
      const iconName = configTypeIconMapping[formData.config_type] || '';

      setFormData(prev => ({
        ...prev,
        config_key: options.length > 0 && !prev.config_key ? options[0].value : prev.config_key,
        icon_name: iconName
      }));
    }
  }, [formData.config_type, formData.config_key, showCreateModal, showEditModal, editingItem, configKeyOptions, configTypeIconMapping]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [configsResponse, linksResponse] = await Promise.all([
        apiService.getAllContactConfigs(),
        apiService.getAllAppDownloadLinks()
      ]);

      if (configsResponse.success) {
        setContactConfigs(configsResponse.data?.configs || []);
      }

      if (linksResponse.success) {
        setAppDownloadLinks(linksResponse.data?.links || []);
      }
    } catch (err) {
      console.error('Error fetching contact us data:', err);
      setError(err.message || 'Failed to fetch contact us data');
    } finally {
      setLoading(false);
    }
  };

  // Contact Config Management
  const handleCreateConfig = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.createContactConfig(formData);
      if (response.success) {
        await fetchData();
        setShowCreateModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error creating contact config:', err);
      setError(err.message || 'Failed to create contact config');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.updateContactConfig(editingItem.config_id, formData);
      if (response.success) {
        await fetchData();
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
      }
    } catch (err) {
      console.error('Error updating contact config:', err);
      setError(err.message || 'Failed to update contact config');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfig = async (configId) => {
    if (!window.confirm('Are you sure you want to delete this contact config?')) {
      return;
    }

    try {
      const response = await apiService.deleteContactConfig(configId);
      if (response.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting contact config:', err);
      setError(err.message || 'Failed to delete contact config');
    }
  };

  // App Download Links Management
  const handleCreateLink = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.createAppDownloadLink(linkFormData);
      if (response.success) {
        await fetchData();
        setShowCreateModal(false);
        resetLinkForm();
      }
    } catch (err) {
      console.error('Error creating app download link:', err);
      setError(err.message || 'Failed to create app download link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.updateAppDownloadLink(editingItem.link_id, linkFormData);
      if (response.success) {
        await fetchData();
        setShowEditModal(false);
        setEditingItem(null);
        resetLinkForm();
      }
    } catch (err) {
      console.error('Error updating app download link:', err);
      setError(err.message || 'Failed to update app download link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this app download link?')) {
      return;
    }

    try {
      const response = await apiService.deleteAppDownloadLink(linkId);
      if (response.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting app download link:', err);
      setError(err.message || 'Failed to delete app download link');
    }
  };

  // Utility functions
  const resetForm = () => {
    setFormData({
      config_type: 'whatsapp',
      config_key: '',
      config_value: '',
      display_text: '',
      icon_name: '',
      sort_order: 0,
      is_active: true
    });
  };

  const resetLinkForm = () => {
    setLinkFormData({
      platform: 'android',
      platform_name: '',
      download_url: '',
      icon_name: '',
      sort_order: 0,
      is_active: true
    });
  };

  const openEditModal = (item, type) => {
    if (type === 'config') {
      setEditingItem(item);
      setFormData({
        config_type: item.config_type,
        config_key: item.config_key,
        config_value: item.config_value,
        display_text: item.display_text || '',
        icon_name: item.icon_name || '',
        sort_order: item.sort_order || 0,
        is_active: item.is_active === 1
      });
      setShowEditModal(true);
    } else {
      setEditingItem(item);
      setLinkFormData({
        platform: item.platform,
        platform_name: item.platform_name,
        download_url: item.download_url,
        icon_name: item.icon_name || '',
        sort_order: item.sort_order || 0,
        is_active: item.is_active === 1
      });
      setShowEditModal(true);
    }
  };

  const getConfigTypeIcon = (type) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-red-500" />;
      case 'website':
        return <Globe className="w-4 h-4 text-purple-500" />;
      case 'support_hours':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'android':
        return <Smartphone className="w-4 h-4 text-green-500" />;
      case 'ios':
        return <Smartphone className="w-4 h-4 text-gray-500" />;
      case 'web':
        return <Monitor className="w-4 h-4 text-blue-500" />;
      default:
        return <Download className="w-4 h-4 text-gray-500" />;
    }
  };

  // Filter and search
  const filteredConfigs = contactConfigs.filter(config => {
    const matchesSearch =
      config.config_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.config_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (config.display_text && config.display_text.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && config.is_active === 1) ||
      (filterType === 'inactive' && config.is_active === 0) ||
      (filterType === config.config_type);

    return matchesSearch && matchesFilter;
  });

  const filteredLinks = appDownloadLinks.filter(link => {
    const matchesSearch =
      link.platform_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.download_url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && link.is_active === 1) ||
      (filterType === 'inactive' && link.is_active === 0) ||
      (filterType === link.platform);

    return matchesSearch && matchesFilter;
  });

  // Get current config key options based on selected type
  const getCurrentConfigKeyOptions = () => {
    return configKeyOptions[formData.config_type] || [];
  };

  // Loading component
  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">Loading contact us data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
          <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-sm sm:text-base text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Contact Us Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage contact information and app download links</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('contact-configs')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${activeTab === 'contact-configs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <span className="hidden sm:inline">Contact Configurations</span>
              <span className="sm:hidden">Configs</span>
            </button>
            <button
              onClick={() => setActiveTab('app-downloads')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${activeTab === 'app-downloads'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <span className="hidden sm:inline">App Download Links</span>
              <span className="sm:hidden">Downloads</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search configurations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Items</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              {activeTab === 'contact-configs' && (
                <>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                  <option value="support_hours">Support Hours</option>
                </>
              )}
              {activeTab === 'app-downloads' && (
                <>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="web">Web</option>
                </>
              )}
            </select>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={fetchData}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Ref</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Configurations Tab */}
      {activeTab === 'contact-configs' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Display Text
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConfigs.map((config) => (
                  <tr key={config.config_id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getConfigTypeIcon(config.config_type)}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {config.config_type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.config_key}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.config_value}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.display_text || 'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.is_active === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {config.is_active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(config.createtime)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(config, 'config')}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfig(config.config_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {filteredConfigs.map((config) => (
              <div key={config.config_id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
                <div className="space-y-3">
                  {/* Header with type and status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getConfigTypeIcon(config.config_type)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {config.config_type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.is_active === 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {config.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Key and Value */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Key:</div>
                    <div className="text-sm font-medium text-gray-900">{config.config_key}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Value:</div>
                    <div className="text-sm text-gray-900">{config.config_value}</div>
                  </div>

                  {/* Display Text */}
                  {config.display_text && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Display Text:</div>
                      <div className="text-sm text-gray-900">{config.display_text}</div>
                    </div>
                  )}

                  {/* Created date and actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500">
                      Created: {formatDate(config.createtime)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(config, 'config')}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfig(config.config_id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredConfigs.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No contact configurations found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* App Download Links Tab */}
      {activeTab === 'app-downloads' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Download URL
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.link_id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPlatformIcon(link.platform)}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {link.platform}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {link.platform_name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                      <a
                        href={link.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                      >
                        {link.download_url}
                      </a>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${link.is_active === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {link.is_active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(link.createtime)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(link, 'link')}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.link_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {filteredLinks.map((link) => (
              <div key={link.link_id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
                <div className="space-y-3">
                  {/* Header with platform and status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(link.platform)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {link.platform}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${link.is_active === 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {link.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Platform Name */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Platform Name:</div>
                    <div className="text-sm font-medium text-gray-900">{link.platform_name}</div>
                  </div>

                  {/* Download URL */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Download URL:</div>
                    <a
                      href={link.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {link.download_url}
                    </a>
                  </div>

                  {/* Created date and actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500">
                      Created: {formatDate(link.createtime)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(link, 'link')}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.link_id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLinks.length === 0 && (
            <div className="text-center py-12">
              <Download className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No app download links found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {showCreateModal ? 'Add New' : 'Edit'} {activeTab === 'contact-configs' ? 'Contact Config' : 'App Download Link'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingItem(null);
                    resetForm();
                    resetLinkForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {activeTab === 'contact-configs' ? (
                <form onSubmit={showCreateModal ? handleCreateConfig : handleUpdateConfig}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Config Type
                      </label>
                      <select
                        value={formData.config_type}
                        onChange={(e) => setFormData({ ...formData, config_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                        <option value="support_hours">Support Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Config Key
                      </label>
                      <select
                        value={formData.config_key}
                        onChange={(e) => setFormData({ ...formData, config_key: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        {getCurrentConfigKeyOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Config Value
                      </label>
                      <input
                        type="text"
                        value={formData.config_value}
                        onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder={
                          formData.config_type === 'whatsapp' ? 'e.g., +91-9876543210' :
                            formData.config_type === 'phone' ? 'e.g., +91-9876543210' :
                              formData.config_type === 'email' ? 'e.g., support@company.com' :
                                formData.config_type === 'website' ? 'e.g., https://company.com' :
                                  'e.g., Mon-Fri 9AM-6PM'
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Text
                      </label>
                      <input
                        type="text"
                        value={formData.display_text}
                        onChange={(e) => setFormData({ ...formData, display_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder={
                          formData.config_type === 'whatsapp' ? 'e.g., WhatsApp Support' :
                            formData.config_type === 'phone' ? 'e.g., Customer Support' :
                              formData.config_type === 'email' ? 'e.g., Support Email' :
                                formData.config_type === 'website' ? 'e.g., Visit Website' :
                                  'e.g., Business Hours'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon Name
                      </label>
                      <input
                        type="text"
                        value={formData.icon_name}
                        onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm sm:text-base"
                        placeholder="Auto-selected based on config type"
                        disabled
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Icon is automatically selected based on the config type
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setEditingItem(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {showCreateModal ? 'Create' : 'Update'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={showCreateModal ? handleCreateLink : handleUpdateLink}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Platform
                      </label>
                      <select
                        value={linkFormData.platform}
                        onChange={(e) => setLinkFormData({ ...linkFormData, platform: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="android">Android</option>
                        <option value="ios">iOS</option>
                        <option value="web">Web</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={linkFormData.platform_name}
                        onChange={(e) => setLinkFormData({ ...linkFormData, platform_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Android"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Download URL
                      </label>
                      <input
                        type="url"
                        value={linkFormData.download_url}
                        onChange={(e) => setLinkFormData({ ...linkFormData, download_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="https://play.google.com/store/apps/..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon Name
                      </label>
                      <input
                        type="text"
                        value={linkFormData.icon_name}
                        onChange={(e) => setLinkFormData({ ...linkFormData, icon_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., android"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={linkFormData.sort_order}
                        onChange={(e) => setLinkFormData({ ...linkFormData, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="link_is_active"
                        checked={linkFormData.is_active}
                        onChange={(e) => setLinkFormData({ ...linkFormData, is_active: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="link_is_active" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setEditingItem(null);
                        resetLinkForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {showCreateModal ? 'Create' : 'Update'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;