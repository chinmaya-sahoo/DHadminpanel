import React, { useState, useEffect, useCallback } from 'react';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';
import apiService from '../../services/api';

const FAQManagement = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // UI states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    category_name: '',
    category_title: '',
    category_description: '',
    category_icon: 'help-circle',
    sort_order: 0
  });

  const [faqForm, setFaqForm] = useState({
    category_id: '',
    question: '',
    answer: '',
    youtube_tutorial_url: '',
    youtube_thumbnail_url: '',
    youtube_video_id: '',
    is_featured: false,
    sort_order: 1
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [categoriesRes, faqsRes] = await Promise.all([
        apiService.getAllFaqCategories(),
        apiService.getAllFaqs({
          category_id: activeCategory === 'all' ? null : activeCategory,
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || null
        })
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }

      if (faqsRes.success) {
        setFaqs(faqsRes.data.faqs || []);
      }
    } catch (err) {
      console.error('Error fetching FAQ data:', err);
      setError('Failed to load FAQ data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, currentPage, searchQuery, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Category management
  const handleCreateCategory = async () => {
    try {
      setSaveStatus('Creating category...');
      const response = await apiService.createFaqCategory(categoryForm);

      if (response.success) {
        setSaveStatus('Category created successfully!');
        setShowCategoryModal(false);
        setCategoryForm({
          category_name: '',
          category_title: '',
          category_description: '',
          category_icon: 'help-circle',
          sort_order: 0
        });
        await fetchData();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to create category. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setSaveStatus('Failed to create category. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // FAQ management
  const handleCreateFaq = async () => {
    try {
      setSaveStatus('Creating FAQ...');
      const response = await apiService.createFaqItem(faqForm);

      if (response.success) {
        setSaveStatus('FAQ created successfully!');
        setShowFaqModal(false);
        setFaqForm({
          category_id: '',
          question: '',
          answer: '',
          youtube_tutorial_url: '',
          youtube_thumbnail_url: '',
          youtube_video_id: '',
          is_featured: false,
          sort_order: 1
        });
        await fetchData();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to create FAQ. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error creating FAQ:', err);
      setSaveStatus('Failed to create FAQ. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq) return;

    try {
      setSaveStatus('Updating FAQ...');
      const response = await apiService.updateFaqItem(editingFaq.faq_id, faqForm);

      if (response.success) {
        setSaveStatus('FAQ updated successfully!');
        setShowFaqModal(false);
        setEditingFaq(null);
        setFaqForm({
          category_id: '',
          question: '',
          answer: '',
          youtube_tutorial_url: '',
          youtube_thumbnail_url: '',
          youtube_video_id: '',
          is_featured: false,
          sort_order: 1
        });
        await fetchData();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to update FAQ. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error updating FAQ:', err);
      setSaveStatus('Failed to update FAQ. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      setSaveStatus('Deleting FAQ...');
      const response = await apiService.deleteFaqItem(faqId);

      if (response.success) {
        setSaveStatus('FAQ deleted successfully!');
        await fetchData();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to delete FAQ. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      setSaveStatus('Failed to delete FAQ. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      category_id: faq.category_id,
      question: faq.question,
      answer: faq.answer,
      youtube_tutorial_url: faq.youtube_tutorial_url || '',
      youtube_thumbnail_url: faq.youtube_thumbnail_url || '',
      youtube_video_id: faq.youtube_video_id || '',
      is_featured: faq.is_featured || false,
      sort_order: faq.sort_order || 1
    });
    setShowFaqModal(true);
  };

  const handleAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFaqAnalytics();
      if (response.success) {
        setAnalytics(response.data);
        setShowAnalyticsModal(true);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  // Update YouTube fields when URL changes
  const handleYouTubeUrlChange = (url) => {
    const videoId = extractYouTubeId(url);
    setFaqForm(prev => ({
      ...prev,
      youtube_tutorial_url: url,
      youtube_video_id: videoId,
      youtube_thumbnail_url: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
    }));
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading FAQ data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">FAQ Management</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage frequently asked questions and categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAnalytics}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
          >
            <BarChart3 size={16} className="mr-2" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Category</span>
          </button>
          <button
            onClick={() => setShowFaqModal(true)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">Add FAQ</span>
            <span className="sm:hidden">FAQ</span>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm sm:text-base text-blue-800">{saveStatus}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_title} ({category.active_faqs || 0})
            </option>
          ))}
        </select>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faqs.map((faq) => (
                <tr key={faq.faq_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {faq.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {faq.question}
                        </div>
                        {faq.youtube_tutorial_url && (
                          <div className="flex items-center mt-1">
                            <Play className="w-3 h-3 text-red-500 mr-1" />
                            <span className="text-xs text-gray-500">Video Tutorial</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {faq.category_title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faq.view_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFaq(faq)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit FAQ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.faq_id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete FAQ"
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
          {faqs.map((faq) => (
            <div key={faq.faq_id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
              <div className="space-y-3">
                {/* Header with question and actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {faq.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                      )}
                      <h3 className="text-sm sm:text-base font-medium text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    {faq.youtube_tutorial_url && (
                      <div className="flex items-center mt-1">
                        <Play className="w-3 h-3 text-red-500 mr-1" />
                        <span className="text-xs text-gray-500">Video Tutorial</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditFaq(faq)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit FAQ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.faq_id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Badges and stats */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {faq.category_title}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {faq.view_count || 0} views
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.category_name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, category_name: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., troubleshooting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Title</label>
                <input
                  type="text"
                  value={categoryForm.category_title}
                  onChange={(e) => setCategoryForm({ ...categoryForm, category_title: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Troubleshooting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={categoryForm.category_description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, category_description: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  rows="3"
                  placeholder="Category description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input
                  type="text"
                  value={categoryForm.category_icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, category_icon: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., help-circle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={categoryForm.sort_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  setCategoryForm({
                    category_name: '',
                    category_title: '',
                    category_description: '',
                    category_icon: 'help-circle',
                    sort_order: 0
                  });
                }}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={faqForm.category_id}
                  onChange={(e) => setFaqForm({ ...faqForm, category_id: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter the FAQ question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  rows="4"
                  placeholder="Enter the FAQ answer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Tutorial URL</label>
                <input
                  type="url"
                  value={faqForm.youtube_tutorial_url}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {faqForm.youtube_thumbnail_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail</label>
                  <img
                    src={faqForm.youtube_thumbnail_url}
                    alt="Video thumbnail"
                    className="w-24 sm:w-32 h-16 sm:h-20 object-cover rounded border"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={faqForm.is_featured}
                  onChange={(e) => setFaqForm({ ...faqForm, is_featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                  Featured FAQ
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={faqForm.sort_order}
                  onChange={(e) => setFaqForm({ ...faqForm, sort_order: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowFaqModal(false);
                  setEditingFaq(null);
                  setFaqForm({
                    category_id: '',
                    question: '',
                    answer: '',
                    youtube_tutorial_url: '',
                    youtube_thumbnail_url: '',
                    youtube_video_id: '',
                    is_featured: false,
                    sort_order: 1
                  });
                }}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={editingFaq ? handleUpdateFaq : handleCreateFaq}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">FAQ Analytics</h3>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {analytics.analytics && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
                      <div>
                        <p className="text-xs sm:text-sm text-blue-600">Total FAQs</p>
                        <p className="text-lg sm:text-2xl font-bold text-blue-900">{analytics.total_faqs || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center">
                      <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-2 sm:mr-3" />
                      <div>
                        <p className="text-xs sm:text-sm text-green-600">Total Views</p>
                        <p className="text-lg sm:text-2xl font-bold text-green-900">
                          {analytics.analytics.reduce((sum, faq) => sum + (faq.view_count || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-2 sm:mr-3" />
                      <div>
                        <p className="text-xs sm:text-sm text-purple-600">Unique Users</p>
                        <p className="text-lg sm:text-2xl font-bold text-purple-900">
                          {analytics.analytics.reduce((sum, faq) => sum + (faq.unique_users || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            FAQ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unique Users
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.analytics.map((faq) => (
                          <tr key={faq.faq_id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {faq.category_title}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {faq.view_count || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {faq.unique_users || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden">
                    {analytics.analytics.map((faq) => (
                      <div key={faq.faq_id} className="border-b border-gray-200 p-4 sm:p-6">
                        <div className="space-y-3">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900">{faq.question}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {faq.category_title}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {faq.view_count || 0} views
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {faq.unique_users || 0} users
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
