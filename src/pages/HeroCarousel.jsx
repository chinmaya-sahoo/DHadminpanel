import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Grid, List, Image as ImageIcon, Loader2, AlertCircle, MoveUp, MoveDown, Eye, EyeOff } from "lucide-react";
import apiService from "../services/api";
import config from "../config/config";

const getImageUrl = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  return `${config.API_BASE_URL}${imgPath}`;
};

const isVideo = (path) => {
  return path?.toLowerCase().endsWith('.mp4');
};

const MediaPreview = ({ src, title }) => {
  if (isVideo(src)) {
    return (
      <video
        src={getImageUrl(src)}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls
      >
        Your browser does not support the video tag.
      </video>
    );
  }
  return (
    <img
      src={getImageUrl(src)}
      alt={title}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.src = '/placeholder.png';
      }}
    />
  );
};

const HeroCarousel = () => {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);

  // Fetch all carousel items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCarouselItems();
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch carousel items", error);
      setError("Failed to load carousel items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Delete carousel item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this carousel item?")) {
      try {
        setLoading(true);
        await apiService.deleteCarouselItem(id);
        await fetchItems();
      } catch (error) {
        console.error("Failed to delete carousel item", error);
        setError("Failed to delete carousel item. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle active status
  const handleToggleActive = async (id) => {
    try {
      setToggleLoading(id);
      setError(null);
      await apiService.toggleCarouselActive(id);
      await fetchItems();
    } catch (error) {
      console.error("Failed to toggle carousel item status", error);
      setError("Failed to update carousel item status. Please try again later.");
    } finally {
      setToggleLoading(null);
    }
  };

  // Move item up/down in order
  const handleMove = async (currentIndex, direction) => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= items.length) return;
    
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    try {
      await apiService.updateCarouselOrder(newItems);
      await fetchItems();
    } catch (error) {
      console.error("Failed to update order", error);
      setError("Failed to update order. Please try again later.");
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Hero Carousel Management</h1>
        <Link
          to="/admin/hero-carousel/new"
          className="flex items-center justify-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Slide
        </Link>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="relative flex-1 max-w-md mb-4 md:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search carousel items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div key={item._id} className={`bg-white rounded-lg shadow-md overflow-hidden ${!item.isActive ? 'border-2 border-red-300' : ''}`}>
              <div className="relative aspect-video">
                <MediaPreview src={item.image} title={item.title} />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.isMobile ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.isMobile ? 'Mobile' : 'Desktop'}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(item._id)}
                    disabled={toggleLoading === item._id}
                    className={`p-1 rounded-full ${
                      item.isActive ? 'bg-green-500' : 'bg-gray-500'
                    } text-white transition-colors ${
                      toggleLoading === item._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
                    }`}
                    title={item.isActive ? 'Active' : 'Inactive'}
                  >
                    {toggleLoading === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : item.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  {isVideo(item.image) && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      Video
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-gray-400' : 'text-amber-600 hover:bg-amber-100'}`}
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === items.length - 1}
                      className={`p-1 rounded ${index === items.length - 1 ? 'text-gray-400' : 'text-amber-600 hover:bg-amber-100'}`}
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/hero-carousel/edit/${item._id}`}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 h-16 relative rounded-lg overflow-hidden">
                      <MediaPreview src={item.image} title={item.title} />
                    </div>
                    <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${item.isMobile ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.isMobile ? 'Mobile' : 'Desktop'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      {isVideo(item.image) && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          Video
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(item._id)}
                      disabled={toggleLoading === item._id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        toggleLoading === item._id
                          ? 'bg-gray-100 text-gray-500'
                          : item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {toggleLoading === item._id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          Updating...
                        </>
                      ) : (
                        item.isActive ? 'Active' : 'Inactive'
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${index === 0 ? 'text-gray-400' : 'text-amber-600 hover:bg-amber-100'}`}
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === items.length - 1}
                        className={`p-1 rounded ${index === items.length - 1 ? 'text-gray-400' : 'text-amber-600 hover:bg-amber-100'}`}
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/admin/hero-carousel/edit/${item._id}`}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-700"
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
      )}
    </div>
  );
};

export default HeroCarousel; 