import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, ImagePlus, Video, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import apiService from "../services/api";

const EditCategories = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [category, setCategory] = useState({
    _id: "",
    name: "",
    description: "",
    image: "",
    video: "",
  });

  const [files, setFiles] = useState({
    image: null,
    video: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    image: "",
    video: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [dragOver, setDragOver] = useState({
    image: false,
    video: false,
  });

  useEffect(() => {
    if (!isNew) {
      apiService.getCategory(id)
        .then((response) => {
          const cat = response.data.category || response.data;
          if (cat) {
            setCategory({
              _id: cat._id || cat.id,
              name: cat.name || '',
              description: cat.description || '',
              image: cat.image || '',
              video: cat.video || '',
            });
            if (cat.image) {
              setPreviewUrls(prev => ({
                ...prev,
                image: cat.image,
              }));
            }
            if (cat.video) {
              setPreviewUrls(prev => ({
                ...prev,
                video: cat.video,
              }));
            }
          } else {
            showToast("Category not found", "error");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch category", error);
          showToast("Error loading category", "error");
        });
    }
  }, [id, isNew]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    handleFile(file, fieldName);
  };

  const handleFile = (file, fieldName) => {
    if (file) {
      let isValid = false;
      
      if (fieldName === 'image') {
        isValid = file.type.startsWith('image/');
        if (!isValid) {
          showToast("Please upload an image file for the image field", "error");
          return;
        }
      } else if (fieldName === 'video') {
        isValid = file.type.startsWith('video/');
        if (!isValid) {
          showToast("Please upload a video file for the video field", "error");
          return;
        }
      }

      if (isValid) {
        setFiles(prev => ({
          ...prev,
          [fieldName]: file
        }));

        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrls(prev => ({
            ...prev,
            [fieldName]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: false }));
    
    const file = e.dataTransfer.files[0];
    handleFile(file, fieldName);
  };

  const handleDragOver = (e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleDragLeave = (e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!category.name || !category.description) {
        showToast("Please fill all required fields", "error");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      
      // Add text fields
      formData.append('name', category.name);
      formData.append('description', category.description);

      // Add file if available
      if (files.image) {
        formData.append('image', files.image);
      } else if (category.image) {
        formData.append('image', category.image);
      }

      if (files.video) {
        formData.append('video', files.video);
      } else if (category.video) {
        formData.append('video', category.video);
      }

      if (isNew) {
        await apiService.createCategory(formData);
        showToast("Category created successfully!");
      } else {
        await apiService.updateCategory(id, formData);
        showToast("Category updated successfully!");
      }
      
      navigate("/admin/categories");
    } catch (error) {
      console.error("Failed to save category", error);
      showToast(error.response?.data?.message || "Error saving category", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviewUrls(prev => ({ ...prev, [fieldName]: "" }));
    if (!isNew) {
      setCategory(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  const renderFileInput = (fieldName, label, required = false) => {
    const hasPreview = previewUrls[fieldName] || files[fieldName];
    const isDragging = dragOver[fieldName];
    const isVideo = fieldName === 'video';

    return (
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : hasPreview
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={(e) => handleDrop(e, fieldName)}
          onDragOver={(e) => handleDragOver(e, fieldName)}
          onDragLeave={(e) => handleDragLeave(e, fieldName)}
        >
          {hasPreview ? (
            <div className="relative">
              {isVideo ? (
                <video
                  src={previewUrls[fieldName]}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              ) : (
                <img
                  src={previewUrls[fieldName]}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <button
                type="button"
                onClick={() => removeImage(fieldName)}
                className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 text-gray-400">
                {isVideo ? <Video className="w-12 h-12" /> : <ImagePlus className="w-12 h-12" />}
              </div>
              <div className="text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a {isVideo ? 'video' : 'image'}</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept={isVideo ? "video/*" : "image/*"}
                    onChange={(e) => handleFileChange(e, fieldName)}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {isVideo ? 'Video up to 50MB' : 'Image up to 10MB'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {isNew ? "Add New Category" : "Edit Category"}
            </h1>

            {/* Toast Notification */}
            {toast.show && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                  toast.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
              >
                {toast.type === "error" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                <span>{toast.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={category.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={category.description}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category Media */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Media</h2>
                <div className="grid grid-cols-1 gap-6">
                  {renderFileInput('image', 'Category Image')}
                  {renderFileInput('video', 'Category Video')}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isNew ? "Create Category" : "Update Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategories; 