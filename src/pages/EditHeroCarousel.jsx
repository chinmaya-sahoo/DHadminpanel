import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, ImagePlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import apiService from "../services/api";
import config from "../config/config";

const EditHeroCarousel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [item, setItem] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    isActive: true,
    order: 0
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!isNew);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (!isNew && id) {
      fetchCarouselItem();
    } else {
      setInitialLoading(false);
    }
  }, [id, isNew]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchCarouselItem = async () => {
    try {
      setInitialLoading(true);
      const response = await apiService.getCarouselItem(id);
      const carouselItem = response.data;
      
      if (!carouselItem) {
        showToast("Carousel item not found", "error");
        navigate('/admin/hero-carousel');
        return;
      }
      
      setItem({
        ...carouselItem,
        id: carouselItem._id
      });
      if (carouselItem.image) {
        setPreviewUrl(carouselItem.image);
      }
      if (typeof carouselItem.isMobile !== 'undefined') {
        setIsMobile(carouselItem.isMobile);
      }
    } catch (error) {
      console.error("Error fetching carousel item:", error);
      showToast("Failed to fetch carousel item", "error");
      navigate('/admin/hero-carousel');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!item.title) {
        showToast("Title is required", "error");
        setLoading(false);
        return;
      }

      if (isNew && !file) {
        showToast("Image is required", "error");
        setLoading(false);
        return;
      }
      
      // Create FormData
      const formData = new FormData();
      
      // Add all item fields to FormData
      Object.keys(item).forEach(key => {
        if (item[key] !== undefined && item[key] !== null && key !== '_id' && key !== 'id') {
          formData.append(key, item[key]);
        }
      });

      formData.append('isMobile', isMobile);
      if (file) {
        formData.append('image', file);
      }

      let response;
      if (isNew) {
        response = await apiService.createCarouselItem(formData);
        showToast("Carousel item created successfully");
      } else {
        const itemId = item.id || item._id;
        if (!itemId) {
          showToast("Invalid carousel item ID", "error");
          setLoading(false);
          return;
        }
        response = await apiService.updateCarouselItem(itemId, formData);
        showToast("Carousel item updated successfully");
      }

      navigate('/admin/hero-carousel');
    } catch (error) {
      console.error('Error saving carousel item:', error);
      showToast(error.response?.data?.message || error.message || 'Failed to save carousel item', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isVideo = (path) => {
    if (!path) return false;
    if (path instanceof File) return path.type === 'video/mp4';
    return path.toLowerCase().endsWith('.mp4');
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isNew ? 'Add New Carousel Item' : 'Edit Carousel Item'}
        </h1>

        {/* Toast notification */}
        {toast.show && (
          <div className={`mb-4 p-4 rounded-lg flex items-center ${
            toast.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            {toast.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload (required)</label>
            <div className="border-2 border-dashed rounded-lg p-6 border-gray-300">
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded" />
                  <button type="button" onClick={() => { setFile(null); setPreviewUrl(""); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-amber-600 hover:text-amber-500">Upload image</span>
                      <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setPreviewUrl(URL.createObjectURL(f)); } }} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Banner Checkbox */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="isMobile"
              name="isMobile"
              checked={isMobile}
              onChange={e => setIsMobile(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="isMobile" className="ml-2 block text-sm text-gray-700">
              Mobile Banner
            </label>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={item.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={item.subtitle}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={item.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* Button Text */}
          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">
              Button Text
            </label>
            <input
              type="text"
              id="buttonText"
              name="buttonText"
              value={item.buttonText}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* Button Link */}
          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700">
              Button Link
            </label>
            <input
              type="text"
              id="buttonLink"
              name="buttonLink"
              value={item.buttonLink}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={item.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/hero-carousel')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHeroCarousel; 