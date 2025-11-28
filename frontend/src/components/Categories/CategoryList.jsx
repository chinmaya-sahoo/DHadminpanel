import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Upload, X, Filter, Search } from 'lucide-react';
import apiService from '../../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    category_name: '',
    category_type: 1, // 1 = Income, 2 = Expense
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    category_type: 'all',
    include_deleted: false,
    search: ''
  });

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.category_type !== 'all') {
        params.category_type = filters.category_type;
      }
      if (filters.include_deleted) {
        params.include_deleted = true;
      }

      const response = await apiService.getAllAdminCategories(params);
      console.log('Admin Categories API Response:', response); // Debug log

      if (response && response.success) {
        let filteredCategories = response.data.categories || [];

        // Client-side search filter
        if (filters.search) {
          filteredCategories = filteredCategories.filter(category =>
            category.category_name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setCategories(filteredCategories);
      } else {
        setError('Failed to fetch categories');
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category_type, filters.include_deleted, filters.search]);

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
  }, [filters.search, fetchCategories]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      if (editingCategory) {
        await apiService.updateAdminCategory(formData, iconFile);
        setSuccess('Category updated successfully');
      } else {
        await apiService.createAdminCategory(formData, iconFile);
        setSuccess('Category created successfully');
      }

      // Reset form
      setFormData({ category_name: '', category_type: 1 });
      setIconFile(null);
      setIconPreview(null);
      setEditingCategory(null);
      setShowForm(false);

      // Refresh categories
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      category_type: category.category_type,
    });
    setIconFile(null);
    setIconPreview(category.icon_url || null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLoading(true);
        await apiService.deleteAdminCategory(categoryId);
        setSuccess('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        setError(err.response?.data?.msg?.[0] || err.message || 'Error deleting category');
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

  // Clear form
  const clearForm = () => {
    setFormData({ category_name: '', category_type: 1 });
    setIconFile(null);
    setIconPreview(null);
    setEditingCategory(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
  };

  // Get category type label
  const getCategoryTypeLabel = (type) => {
    return type === 1 ? 'Income' : 'Expense';
  };

  // Get category type color
  const getCategoryTypeColor = (type) => {
    return type === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Category Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.category_type}
            onChange={(e) => setFilters(prev => ({ ...prev, category_type: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="1">Income</option>
            <option value="2">Expense</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.include_deleted}
              onChange={(e) => setFilters(prev => ({ ...prev, include_deleted: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Deleted</span>
          </label>

          <button
            onClick={() => setFilters({ category_type: 'all', include_deleted: false, search: '' })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button
              onClick={clearForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Type *
                </label>
                <select
                  value={formData.category_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_type: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={1}>Income</option>
                  <option value={2}>Expense</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Icon (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {iconPreview && (
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    {editingCategory ? 'Update Category' : 'Create Category'}
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
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                      {category.icon_url ? (
                        <img
                          src={category.icon_url}
                          alt={category.category_name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryTypeColor(category.category_type)}`}>
                        {getCategoryTypeLabel(category.category_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                        {category.status || 'Active'}
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
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
              <Filter size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList; 