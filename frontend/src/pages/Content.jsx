import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Star,
  Play,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Settings,
  TrendingUp,
} from "lucide-react";
import apiService from "../services/api";

const Content = () => {
  // State management
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [loadingImages, setLoadingImages] = useState(new Set());

  // Form states
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // Tutorial form data
  const [tutorialData, setTutorialData] = useState({
    tutorial_title: "",
    tutorial_description: "",
    video_url: "",
    thumbnail_url: "",
    language: "hindi",
    category: "getting_started",
    difficulty_level: "beginner",
    duration_minutes: "",
    is_featured: false,
    sort_order: 0,
  });

  // Filters and pagination
  const [tutorialFilters, setTutorialFilters] = useState({
    language: "all",
    category: "all",
    difficulty_level: "all",
    is_featured: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  });


  // Tutorial categories
  const tutorialCategories = {
    getting_started: { label: "Getting Started", icon: Play, color: "text-green-600" },
    advanced_features: { label: "Advanced Features", icon: Settings, color: "text-blue-600" },
    tips_tricks: { label: "Tips & Tricks", icon: TrendingUp, color: "text-purple-600" },
    troubleshooting: { label: "Troubleshooting", icon: AlertCircle, color: "text-red-600" },
  };

  // Difficulty levels
  const difficultyLevels = {
    beginner: { label: "Beginner", color: "text-green-600 bg-green-50" },
    intermediate: { label: "Intermediate", color: "text-yellow-600 bg-yellow-50" },
    advanced: { label: "Advanced", color: "text-red-600 bg-red-50" },
  };

  // Languages
  const languages = {
    hindi: { label: "Hindi", flag: "🇮🇳" },
    marathi: { label: "Marathi", flag: "🇮🇳" },
    english: { label: "English", flag: "🇺🇸" },
  };


  // Fetch tutorials
  const fetchTutorials = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...tutorialFilters,
        ...params,
      };

      // Remove 'all' values from query params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all' || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await apiService.getAllTutorials(queryParams);
      console.log('Tutorials API Response:', response);

      if (response && response.success) {
        setTutorials(response.data.tutorials || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError('Failed to fetch tutorials');
        setTutorials([]);
      }
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(err.message || 'Failed to fetch tutorials');
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  }, [tutorialFilters, pagination.current_page, pagination.limit]);

  // Initial data fetch - only run once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tutorials with default filters
        const tutorialResponse = await apiService.getAllTutorials({ page: 1, limit: 10 });
        if (tutorialResponse && tutorialResponse.success) {
          setTutorials(tutorialResponse.data.tutorials || []);
          if (tutorialResponse.data.pagination) {
            setPagination(tutorialResponse.data.pagination);
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array - only run on mount

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  // Debounced search effect for tutorials
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTutorials();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tutorialFilters.search, tutorialFilters.language, tutorialFilters.category, tutorialFilters.difficulty_level, tutorialFilters.is_featured, fetchTutorials]);


  // Handle tutorial creation
  const handleCreateTutorial = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.createTutorial(tutorialData);

      if (response && response.success) {
        setSuccess('Tutorial created successfully');
        setShowTutorialModal(false);
        setTutorialData({
          tutorial_title: "",
          tutorial_description: "",
          video_url: "",
          thumbnail_url: "",
          language: "hindi",
          category: "getting_started",
          difficulty_level: "beginner",
          duration_minutes: "",
          is_featured: false,
          sort_order: 0,
        });
        fetchTutorials();
      } else {
        setError('Failed to create tutorial');
      }
    } catch (err) {
      console.error('Error creating tutorial:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to create tutorial');
    } finally {
      setLoading(false);
    }
  };




  // Handle tutorial deletion
  const handleDeleteTutorial = async (tutorialId) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;

    try {
      setLoading(true);
      const response = await apiService.deleteTutorial(tutorialId);

      if (response && response.success) {
        setSuccess('Tutorial deleted successfully');
        fetchTutorials();
      } else {
        setError('Failed to delete tutorial');
      }
    } catch (err) {
      console.error('Error deleting tutorial:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to delete tutorial');
    } finally {
      setLoading(false);
    }
  };


  // Handle tutorial analytics
  const handleViewAnalytics = async (tutorialId) => {
    try {
      setLoading(true);
      const response = await apiService.getTutorialAnalytics(tutorialId);

      if (response && response.success) {
        setSelectedTutorial(response.data);
        setShowAnalyticsModal(true);
      } else {
        setError('Failed to fetch tutorial analytics');
      }
    } catch (err) {
      console.error('Error fetching tutorial analytics:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to fetch tutorial analytics');
    } finally {
      setLoading(false);
    }
  };


  const handleTutorialFilterChange = (key, value) => {
    setTutorialFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };


  const clearTutorialFilters = () => {
    setTutorialFilters({
      language: "all",
      category: "all",
      difficulty_level: "all",
      is_featured: "all",
      search: "",
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  // Render tutorial category badge
  const renderTutorialCategoryBadge = (category) => {
    const config = tutorialCategories[category];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Render difficulty level badge
  const renderDifficultyBadge = (level) => {
    const config = difficultyLevels[level];
    if (!config) return null;
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Render language badge
  const renderLanguageBadge = (lang) => {
    const config = languages[lang];
    if (!config) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <span>{config.flag}</span>
        {config.label}
      </span>
    );
  };

  // Handle image loading start
  const handleImageLoadStart = (originalSrc) => {
    setLoadingImages(prev => new Set([...prev, originalSrc]));
  };

  // Handle image loading complete
  const handleImageLoad = (originalSrc) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(originalSrc);
      return newSet;
    });
  };

  // Handle image error to prevent infinite loops
  const handleImageError = (e, originalSrc) => {
    const img = e.target;
    const currentSrc = img.src;

    // If this is already a placeholder or we've already tried this image, don't retry
    if (currentSrc.includes('placeholder') || currentSrc.includes('data:image') || failedImages.has(originalSrc)) {
      return;
    }

    // Mark this image as failed and remove from loading
    setFailedImages(prev => new Set([...prev, originalSrc]));
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(originalSrc);
      return newSet;
    });

    // Create a data URL placeholder to avoid external requests
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Fill with light gray background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 150, 100);

    // Add text
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Image', 75, 50);

    // Set the data URL as the new source
    img.src = canvas.toDataURL();
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg bg-red-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <AlertCircle size={14} className="sm:w-4 sm:h-4" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <CheckCircle size={14} className="sm:w-4 sm:h-4" />
            {success}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Content Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => fetchTutorials()}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={14} className={`sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Ref</span>
          </button>
        </div>
      </div>


      {/* Tutorial Management */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              🎥 Tutorials
            </h3>
            <button
              onClick={() => setShowTutorialModal(true)}
              className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create Tutorial</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>

          {/* Tutorial Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={tutorialFilters.search}
                onChange={(e) => handleTutorialFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Language Filter */}
            <select
              value={tutorialFilters.language}
              onChange={(e) => handleTutorialFilterChange('language', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Languages</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
              <option value="english">English</option>
            </select>

            {/* Category Filter */}
            <select
              value={tutorialFilters.category}
              onChange={(e) => handleTutorialFilterChange('category', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Categories</option>
              <option value="getting_started">Getting Started</option>
              <option value="advanced_features">Advanced Features</option>
              <option value="tips_tricks">Tips & Tricks</option>
              <option value="troubleshooting">Troubleshooting</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={tutorialFilters.difficulty_level}
              onChange={(e) => handleTutorialFilterChange('difficulty_level', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Featured Filter */}
            <select
              value={tutorialFilters.is_featured}
              onChange={(e) => handleTutorialFilterChange('is_featured', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All</option>
              <option value="true">Featured</option>
              <option value="false">Regular</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearTutorialFilters}
              className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Clear Filters</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>

        {/* Tutorials Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm sm:text-base text-gray-600">Loading tutorials...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tutorial</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Language</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tutorials.map((tutorial) => (
                    <tr key={tutorial.tutorial_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {tutorial.thumbnail_url ? (
                            <div className="relative w-16 h-12 rounded overflow-hidden">
                              {loadingImages.has(tutorial.thumbnail_url) && (
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                              <img
                                src={tutorial.thumbnail_url}
                                alt="tutorial"
                                className="w-16 h-12 rounded object-cover"
                                onLoadStart={() => handleImageLoadStart(tutorial.thumbnail_url)}
                                onLoad={() => handleImageLoad(tutorial.thumbnail_url)}
                                onError={(e) => handleImageError(e, tutorial.thumbnail_url)}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Play size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {tutorial.tutorial_title}
                              {tutorial.is_featured && <Star size={16} className="text-yellow-500" />}
                            </div>
                            {tutorial.tutorial_description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {tutorial.tutorial_description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {renderLanguageBadge(tutorial.language)}
                      </td>
                      <td className="px-4 py-3">
                        {renderTutorialCategoryBadge(tutorial.category)}
                      </td>
                      <td className="px-4 py-3">
                        {renderDifficultyBadge(tutorial.difficulty_level)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tutorial.duration_minutes ? `${tutorial.duration_minutes}m` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tutorial.view_count || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatTimeAgo(tutorial.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewAnalytics(tutorial.tutorial_id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Analytics"
                          >
                            <BarChart3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTutorial(tutorial.tutorial_id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Tutorial"
                          >
                            <Trash2 size={16} />
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
              {tutorials.map((tutorial) => (
                <div key={tutorial.tutorial_id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50">
                  <div className="space-y-3">
                    {/* Header with thumbnail and title */}
                    <div className="flex items-start gap-3">
                      {tutorial.thumbnail_url ? (
                        <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                          {loadingImages.has(tutorial.thumbnail_url) && (
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <img
                            src={tutorial.thumbnail_url}
                            alt="tutorial"
                            className="w-16 h-12 rounded object-cover"
                            onLoadStart={() => handleImageLoadStart(tutorial.thumbnail_url)}
                            onLoad={() => handleImageLoad(tutorial.thumbnail_url)}
                            onError={(e) => handleImageError(e, tutorial.thumbnail_url)}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <Play size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          <span className="truncate">{tutorial.tutorial_title}</span>
                          {tutorial.is_featured && <Star size={16} className="text-yellow-500 flex-shrink-0" />}
                        </div>
                        {tutorial.tutorial_description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {tutorial.tutorial_description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {renderLanguageBadge(tutorial.language)}
                      {renderTutorialCategoryBadge(tutorial.category)}
                      {renderDifficultyBadge(tutorial.difficulty_level)}
                    </div>

                    {/* Stats and actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Duration: {tutorial.duration_minutes ? `${tutorial.duration_minutes}m` : 'N/A'}</span>
                        <span>Views: {tutorial.view_count || 0}</span>
                        <span>Created: {formatTimeAgo(tutorial.created_at)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAnalytics(tutorial.tutorial_id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Analytics"
                        >
                          <BarChart3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTutorial(tutorial.tutorial_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Tutorial"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tutorials.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4">
              <Play size={40} className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
            <p className="text-sm text-gray-500">Create your first tutorial to get started.</p>
          </div>
        )}
      </div>


      {/* Create Tutorial Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Create New Tutorial</h3>
              <button
                onClick={() => setShowTutorialModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tutorial Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tutorial Title *
                </label>
                <input
                  type="text"
                  value={tutorialData.tutorial_title}
                  onChange={(e) => setTutorialData({ ...tutorialData, tutorial_title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter tutorial title"
                />
              </div>

              {/* Tutorial Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={tutorialData.tutorial_description}
                  onChange={(e) => setTutorialData({ ...tutorialData, tutorial_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  rows="3"
                  placeholder="Enter tutorial description"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={tutorialData.video_url}
                  onChange={(e) => setTutorialData({ ...tutorialData, video_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="https://youtube.com/watch?v=tutorial-id"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={tutorialData.thumbnail_url}
                  onChange={(e) => setTutorialData({ ...tutorialData, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={tutorialData.language}
                    onChange={(e) => setTutorialData({ ...tutorialData, language: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="hindi">Hindi</option>
                    <option value="marathi">Marathi</option>
                    <option value="english">English</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={tutorialData.category}
                    onChange={(e) => setTutorialData({ ...tutorialData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="getting_started">Getting Started</option>
                    <option value="advanced_features">Advanced Features</option>
                    <option value="tips_tricks">Tips & Tricks</option>
                    <option value="troubleshooting">Troubleshooting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={tutorialData.difficulty_level}
                    onChange={(e) => setTutorialData({ ...tutorialData, difficulty_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={tutorialData.duration_minutes}
                    onChange={(e) => setTutorialData({ ...tutorialData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tutorialData.sort_order}
                    onChange={(e) => setTutorialData({ ...tutorialData, sort_order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="0"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={tutorialData.is_featured}
                    onChange={(e) => setTutorialData({ ...tutorialData, is_featured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured Tutorial
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTutorialModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTutorial}
                disabled={loading || !tutorialData.tutorial_title || !tutorialData.video_url}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Creating...' : 'Create Tutorial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Analytics Modal */}
      {showAnalyticsModal && selectedTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Tutorial Analytics</h3>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {selectedTutorial.tutorial && (
              <div className="space-y-4 sm:space-y-6">
                {/* Tutorial Info */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-base sm:text-lg font-medium mb-2">{selectedTutorial.tutorial.tutorial_title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Language:</span>
                      <div className="font-medium">{renderLanguageBadge(selectedTutorial.tutorial.language)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <div className="font-medium">{renderTutorialCategoryBadge(selectedTutorial.tutorial.category)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulty:</span>
                      <div className="font-medium">{renderDifficultyBadge(selectedTutorial.tutorial.difficulty_level)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <div className="font-medium">{formatTimeAgo(selectedTutorial.tutorial.created_at)}</div>
                    </div>
                  </div>
                </div>

                {/* Analytics Stats */}
                {selectedTutorial.analytics && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{selectedTutorial.analytics.total_views}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{selectedTutorial.analytics.unique_viewers}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Unique Viewers</div>
                    </div>
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">{selectedTutorial.analytics.authenticated_views}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Authenticated Views</div>
                    </div>
                    <div className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">{selectedTutorial.analytics.anonymous_views}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Anonymous Views</div>
                    </div>
                  </div>
                )}

                {/* Device Analytics */}
                {selectedTutorial.analytics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">{selectedTutorial.analytics.mobile_views}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Mobile Views</div>
                    </div>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">{selectedTutorial.analytics.desktop_views}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Desktop Views</div>
                    </div>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">{selectedTutorial.analytics.tablet_views}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Tablet Views</div>
                    </div>
                  </div>
                )}

                {/* Recent Views */}
                {selectedTutorial.recent_views && selectedTutorial.recent_views.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-3">Recent Views</h4>
                    <div className="space-y-2">
                      {selectedTutorial.recent_views.map((view, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                          <div>
                            <div className="font-medium text-sm sm:text-base">{view.user_name || 'Anonymous User'}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{view.device_type}</div>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">{formatTimeAgo(view.viewed_at)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
