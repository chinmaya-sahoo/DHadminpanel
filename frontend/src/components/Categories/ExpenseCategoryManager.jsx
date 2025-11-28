import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Upload, X, Search, Filter } from 'lucide-react';
import apiService from '../../services/api';
import MaterialIconSelector from '../MaterialIconSelector';
import config from '../../config/config';

const ExpenseCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    category_id: '',
    category_name: '',
    category_type: 1, // 1 = Expense
    account_type: 1, // 1 = Personal, 2 = Business, 3 = Freelance
    deletable: 0, // 0 = not deletable by users, 1 = deletable by users
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        category_type: 1, // Expense
        include_deleted: false
      };

      const response = await apiService.getAllAdminCategories(params);
      console.log('Expense Categories API Response:', response); // Debug log

      if (response && response.success) {
        let filteredCategories = response.data.categories || [];

        // Debug: Log the first category to see its structure
        if (filteredCategories.length > 0) {
          console.log('Sample category data:', filteredCategories[0]);
          console.log('Account type value:', filteredCategories[0].account_type);
          console.log('Account type label:', config.getAccountTypeLabel(filteredCategories[0].account_type));
        }

        // Client-side search filter
        if (searchTerm) {
          filteredCategories = filteredCategories.filter(category =>
            category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setCategories(filteredCategories);
      } else {
        setError('Failed to fetch expense categories');
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching expense categories:', err);
      setError(err.message || 'Failed to fetch expense categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);


  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCategories();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchCategories]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      const categoryData = {
        ...formData
      };

      if (editingCategory) {
        // Send iconFile (either uploaded file or converted Material Icon PNG)
        await apiService.updateAdminCategory(categoryData, iconFile);
        setSuccess('Expense category updated successfully');
      } else {
        // Send iconFile (either uploaded file or converted Material Icon PNG)
        await apiService.createAdminCategory(categoryData, iconFile);
        setSuccess('Expense category created successfully');
      }

      // Reset form
      setFormData({ category_id: '', category_name: '', category_type: 2, account_type: 1 });
      setIconFile(null);
      setIconPreview(null);
      setSelectedIcon(null);
      setShowIconSelector(false);
      setEditingCategory(null);
      setShowForm(false);

      // Refresh categories
      fetchCategories();
    } catch (err) {
      console.error('Error saving expense category:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Error saving expense category');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = async (category) => {
    setEditingCategory(category);
    setFormData({
      category_id: category.category_id,
      category_name: category.category_name,
      category_type: category.category_type,
      account_type: category.account_type || 1,
      deletable: category.deletable || 0,
    });

    // Check if icon is a Material Icon name or uploaded image
    if (category.icon && !category.icon.startsWith('data:') && !category.icon.startsWith('http')) {
      // It's a Material Icon name - convert to file for editing
      setSelectedIcon(category.icon);
      const iconFile = await materialIconToPng(category.icon);
      if (iconFile) {
        setIconFile(iconFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setIconPreview(e.target.result);
        };
        reader.readAsDataURL(iconFile);
      }
    } else {
      // It's an uploaded image
      setSelectedIcon(null);
      setIconPreview(category.icon || null);
      setIconFile(null);
    }

    setShowIconSelector(false);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this expense category?')) {
      try {
        setLoading(true);
        await apiService.deleteAdminCategory(categoryId);
        setSuccess('Expense category deleted successfully');
        fetchCategories();
      } catch (err) {
        console.error('Error deleting expense category:', err);
        setError(err.response?.data?.msg?.[0] || err.message || 'Error deleting expense category');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert Material Icon to PNG file
  const materialIconToPng = async (iconName) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 128; // High resolution for better quality

      canvas.width = size;
      canvas.height = size;

      // Set background to transparent
      ctx.clearRect(0, 0, size, size);

      // Create a temporary element to render the Material Icon
      const tempElement = document.createElement('span');
      tempElement.className = 'material-icons';
      tempElement.style.fontSize = `${size * 0.8}px`;
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.top = '-9999px';
      tempElement.textContent = iconName;

      document.body.appendChild(tempElement);

      // Get the computed style to measure the icon
      const computedStyle = window.getComputedStyle(tempElement);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Set font properties
      ctx.font = `${fontSize}px 'Material Icons'`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';

      // Draw the Material Icon
      ctx.fillText(iconName, size / 2, size / 2);

      // Clean up temporary element
      document.body.removeChild(tempElement);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `material_icon_${iconName}_${Date.now()}.png`, {
            type: 'image/png'
          });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/png');
    });
  };

  // Handle icon selection from MaterialIconSelector
  const handleIconSelect = async (iconName) => {
    setSelectedIcon(iconName);
    setShowIconSelector(false);

    // Convert Material Icon to PNG file
    const iconFile = await materialIconToPng(iconName);
    if (iconFile) {
      setIconFile(iconFile);

      // Create preview from the icon file
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target.result);
      };
      reader.readAsDataURL(iconFile);
    }
  };

  // Handle custom file upload from IconSelector
  const handleCustomIconUpload = (file) => {
    setIconFile(file);
    setSelectedIcon(null); // Clear emoji selection when file is uploaded

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      category_id: '',
      category_name: '',
      category_type: 2, // Expense
      account_type: 1, // Personal
      deletable: 0 // Default to not deletable
    });
    setIconFile(null);
    setIconPreview(null);
    setSelectedIcon(null);
    setShowIconSelector(false);
    setEditingCategory(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
  };


  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expense Categories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Expense Category</span>
          <span className="sm:hidden">Add Category</span>
        </button>
      </div>


      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search expense categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              {editingCategory ? 'Edit Expense Category' : 'Add New Expense Category'}
            </h3>
            <button
              onClick={clearForm}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter expense category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type *
                </label>
                <select
                  value={formData.account_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_type: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                  required
                >
                  {config.getAccountTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deletable by Users
                </label>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="deletable"
                    checked={formData.deletable === 1}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      deletable: e.target.checked ? 1 : 0
                    }))}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 mt-1 flex-shrink-0"
                    style={{ accentColor: '#dc2626' }}
                  />
                  <div className="min-w-0 flex-1">
                    <label htmlFor="deletable" className="text-xs sm:text-sm text-gray-600 block">
                    Allow users to delete this category
                  </label>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.deletable === 1
                    ? "✓ Users can delete this category"
                    : "✗ Users cannot delete this category (admin only)"
                  }
                </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Icon (Optional)
              </label>

              {/* Current Selection Display */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  {selectedIcon ? (
                    <span className="material-icons text-2xl sm:text-3xl text-gray-700 flex-shrink-0">{selectedIcon}</span>
                  ) : iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">No Icon</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      {selectedIcon ? 'Material Icon Selected' : iconPreview ? 'Custom Icon Selected' : 'No Icon Selected'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Click "Select Icon" to choose from predefined icons or upload your own
                    </p>
                  </div>
                </div>
              </div>

              {/* Icon Selection Button */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{showIconSelector ? 'Hide Icon Selector' : 'Select Icon'}</span>
                  <span className="sm:hidden">{showIconSelector ? 'Hide' : 'Select'}</span>
                </button>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="icon-file-input"
                />
                <label
                  htmlFor="icon-file-input"
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <Upload size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Upload Custom</span>
                  <span className="sm:hidden">Upload</span>
                </label>
              </div>

              {/* Icon Selector */}
              {showIconSelector && (
                <MaterialIconSelector
                  selectedIcon={selectedIcon}
                  onIconSelect={handleIconSelect}
                  onFileUpload={handleCustomIconUpload}
                  categoryType="expense"
                  className="mb-4"
                />
              )}
            </div>



            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">{editingCategory ? 'Updating...' : 'Creating...'}</span>
                    <span className="sm:hidden">{editingCategory ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{editingCategory ? 'Update Category' : 'Create Category'}</span>
                    <span className="sm:hidden">{editingCategory ? 'Update' : 'Create'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading && categories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading expense categories...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deletable</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(categories) && categories.map((category) => (
                  <tr key={category.category_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.category_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.icon ? (
                        category.icon.startsWith('data:') || category.icon.startsWith('http') ? (
                          <img
                            src={category.icon}
                            alt={category.category_name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="material-icons text-3xl text-gray-700">{category.icon}</span>
                        )
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Icon</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.category_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.getAccountTypeColor(category.account_type || 1)}`}>
                        {config.getAccountTypeLabel(category.account_type || 1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                        {category.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${category.deletable === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {category.deletable === 1 ? '✓ Yes' : '✗ No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.createtime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Category"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.category_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Category"
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
            <div className="md:hidden">
              {Array.isArray(categories) && categories.map((category) => (
                <div key={category.category_id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {category.icon ? (
                          category.icon.startsWith('data:') || category.icon.startsWith('http') ? (
                            <img
                              src={category.icon}
                              alt={category.category_name}
                              className="w-10 h-10 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="material-icons text-2xl text-gray-700">{category.icon}</span>
                          )
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Icon</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{category.category_name}</h3>
                          <span className="text-xs text-gray-500">ID: {category.category_id}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.getAccountTypeColor(category.account_type || 1)}`}>
                            {config.getAccountTypeLabel(category.account_type || 1)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                            {category.status || 'Active'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${category.deletable === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {category.deletable === 1 ? '✓ Deletable' : '✗ Not Deletable'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500">Created: {category.createtime}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        title="Edit Category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.category_id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
              <Filter size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expense categories found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategoryManager;
