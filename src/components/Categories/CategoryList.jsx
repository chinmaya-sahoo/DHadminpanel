import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper function to get absolute URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    
    // Handle video files from category.json (they are stored as filenames like "1.mp4")
    if (isVideoFile(imgPath)) {
      return `https://pawnbackend-xmqa.onrender.com/pawnbackend/data/${imgPath}`;
    }
    
    // Handle regular image paths
    return `https://pawnbackend-xmqa.onrender.com${imgPath}`;
  };

  // Helper function to determine if file is video
  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Helper function to render media (image or video)
  const renderMedia = (url, alt) => {
    try {
      const absoluteUrl = getImageUrl(url);
      
      if (!absoluteUrl) {
        return (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No media</span>
          </div>
        );
      }

      if (isVideoFile(url)) {
        return (
          <video
            src={absoluteUrl}
            className="w-16 h-16 object-cover rounded-md"
            controls
            muted
            loop
            preload="metadata"
            onError={(e) => {
              console.error('Video load error:', e);
              e.target.style.display = 'none';
            }}
          >
            <source src={absoluteUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }

      return (
        <img
          src={absoluteUrl}
          alt={alt || 'Category'}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => {
            console.error('Image load error:', e);
            e.target.style.display = 'none';
          }}
        />
      );
    } catch (error) {
      console.error('Error rendering media:', error);
      return (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-400 text-xs">Error</span>
        </div>
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data.categories || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id, formData);
        setSuccess('Category updated successfully');
      } else {
        await apiService.createCategory(formData);
        setSuccess('Category added successfully');
      }

      setFormData({ name: '', description: '', image: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiService.deleteCategory(id);
        setSuccess('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Image/Video URL (supports .mp4, .jpg, .png, etc.)"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderMedia(category.image, category.name)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 text-blue-600 hover:text-blue-900 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-3 py-1 text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList; 