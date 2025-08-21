import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, ImagePlus, AlertCircle, CheckCircle, Plus, Loader2, Pencil, Trash2, Save, XCircle, PlusCircle } from 'lucide-react';
import apiService from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [product, setProduct] = useState({
    id: "",
    name: "",
    material: "",
    description: "",
    size: "",
    colour: "",
    category: "",
    weight: "",
    utility: "",
    care: "",
    price: "",
    regularPrice: "",
    inStock: true,
    isBestSeller: false,
    isFeatured: false,
    isMostLoved: false,
    codAvailable: false,
    stock: 0
  });

  const [files, setFiles] = useState({
    mainImage: null,
    image1: null,
    image2: null,
    image3: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    mainImage: "",
    image1: "",
    image2: "",
    image3: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [dragOver, setDragOver] = useState({
    mainImage: false,
    image1: false,
    image2: false,
    image3: false,
  });

  // Add states for categories and new category
  const [categories, setCategories] = useState([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Add states for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReview, setEditReview] = useState({ stars: 5, reviewTitle: '', reviewDescription: '', userEmail: '', userName: '' });
  const [newReview, setNewReview] = useState({ stars: 5, reviewTitle: '', reviewDescription: '', userEmail: '', userName: '' });

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        showToast("Failed to load categories", "error");
      }
    };

    fetchCategories();

    if (!isNew) {
      apiService.getProducts()
        .then((response) => {
  
          console.log('Looking for product with ID:', id);
          const prod = (response.data.products || response.data).find((p) => {
            console.log('Comparing:', p._id, id);
            return p._id?.toString() === id?.toString();
          });
          
          if (prod) {
            console.log('Found product:', prod);
            setProduct({
              ...prod,
              id: prod._id,
              price: prod.price?.toString() || "",
              regularPrice: prod.regularPrice?.toString() || "",
              inStock: !!prod.inStock,
              isBestSeller: !!prod.isBestSeller,
              isFeatured: !!prod.isFeatured,
              isMostLoved: !!prod.isMostLoved,
              codAvailable: !!prod.codAvailable,
              stock: typeof prod.stock !== 'undefined' ? prod.stock : 0
            });

            // Set preview URLs for existing images
            if (prod.images && Array.isArray(prod.images)) {
              const imageMapping = {
                mainImage: prod.images[0] || "",
                image1: prod.images[1] || "",
                image2: prod.images[2] || "",
                image3: prod.images[3] || "",
              };
              setPreviewUrls(imageMapping);
            } else if (prod.image) {
              setPreviewUrls({
                mainImage: prod.image,
                image1: "",
                image2: "",
                image3: "",
              });
            }
          } else {
            console.error('Product not found with ID:', id);
            showToast("Product not found", "error");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch product:", error);
          showToast("Error loading product", "error");
        });
    }
  }, [id, isNew]);

  // Fetch reviews for this product
  useEffect(() => {
    if (!isNew && product.id) {
      setReviewLoading(true);
      apiService.getProductReviews(product.id)
        .then(res => setReviews(res.data.reviews || []))
        .catch(() => setReviews([]))
        .finally(() => setReviewLoading(false));
    }
  }, [isNew, product.id]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    handleFile(file, fieldName);
  };

  const handleFile = (file, fieldName) => {
    if (file && file.type.startsWith('image/')) {
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
      // Validate required fields
      const requiredFields = [
        "name",
        "material",
        "description",
        "size",
        "colour",
        "category",
        "weight",
        "utility",
        "care",
        "price",
        "regularPrice"
      ];

      const missingFields = requiredFields.filter(field => !product[field]);
      if (missingFields.length > 0) {
        showToast(`Please fill in the following required fields: ${missingFields.join(", ")}`, "error");
        setLoading(false);
        return;
      }

      // Validate price and regularPrice
      const price = parseFloat(product.price);
      const regularPrice = parseFloat(product.regularPrice);
      
      if (isNaN(price) || price < 0) {
        showToast("Please enter a valid price", "error");
        setLoading(false);
        return;
      }

      if (isNaN(regularPrice) || regularPrice < 0) {
        showToast("Please enter a valid regular price", "error");
        setLoading(false);
        return;
      }

      if (price > regularPrice) {
        showToast("Price cannot be greater than regular price", "error");
        setLoading(false);
        return;
      }

      // Validate main image for new products
      if (isNew && (!files.mainImage || !(files.mainImage instanceof File))) {
        showToast("Please upload a valid main image file", "error");
        setLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      
      // Log what's being added to FormData
      
      
      // Add all product fields to FormData
      Object.keys(product).forEach(key => {
        if (product[key] !== undefined && product[key] !== null) {
          formData.append(key, product[key]);
        }
      });

      // Add files to FormData
      if (files.mainImage) {
        formData.append('mainImage', files.mainImage);
        console.log('Adding main image:', files.mainImage.name);
      }

      for (let i = 1; i <= 3; i++) {
        if (files[`image${i}`]) {
          formData.append(`image${i}`, files[`image${i}`]);
          console.log(`Adding image${i}:`, files[`image${i}`].name);
        }
      }

      // Log the complete FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      let response;
      if (isNew) {
        response = await apiService.createProduct(formData);
      } else {
        response = await apiService.updateProduct(product.id, formData);
      }

      showToast(
        isNew ? "Product created successfully!" : "Product updated successfully!",
        "success"
      );
      
      
      
      // Navigate back after success
      navigate('/products');
    } catch (error) {
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || "An error occurred";
      showToast(errorMessage, "error");
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditReview({
      stars: review.stars,
      reviewTitle: review.reviewTitle,
      reviewDescription: review.reviewDescription,
      userEmail: review.userEmail,
      userName: review.userName
    });
  };

  const handleSaveReview = async (reviewId) => {
    try {
      await apiService.updateReview(reviewId, editReview);
      showToast('Review updated!');
      setEditingReviewId(null);
      // Refresh reviews
      const res = await apiService.getProductReviews(product.id);
      setReviews(res.data.reviews || []);
    } catch (err) {
      showToast('Failed to update review', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await apiService.deleteReview(reviewId);
      showToast('Review deleted!');
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  const handleAddReview = async () => {
    try {
      await apiService.createReview({ ...newReview, productId: product.id });
      showToast('Review added!');
      setNewReview({ stars: 5, reviewTitle: '', reviewDescription: '', userEmail: '', userName: '' });
      // Refresh reviews
      const res = await apiService.getProductReviews(product.id);
      setReviews(res.data.reviews || []);
    } catch (err) {
      showToast('Failed to add review', 'error');
    }
  };

  const removeImage = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviewUrls(prev => ({ ...prev, [fieldName]: "" }));
  };

  const handleNewCategorySubmit = async () => {
    try {
      if (!newCategory.name || !newCategory.description) {
        showToast("Please fill in both name and description for the new category", "error");
        return;
      }

      const response = await apiService.createCategory(newCategory);
      const createdCategory = response.data;
      
      setCategories(prev => [...prev, createdCategory]);
      setProduct(prev => ({ ...prev, category: createdCategory.name }));
      setIsAddingNewCategory(false);
      setNewCategory({ name: "", description: "" });
      showToast("New category created successfully", "success");
    } catch (error) {
      console.error("Failed to create new category", error);
      showToast("Failed to create new category", "error");
    }
  };

  const renderFileInput = (fieldName, label, required = false) => {
    const hasPreview = previewUrls[fieldName] || files[fieldName];
    const isDragging = dragOver[fieldName];

    return (
      <div className="col-span-1">
        <label className="block font-medium mb-2 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div
          className={`relative h-48 rounded-lg border-2 border-dashed transition-all duration-200 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${hasPreview ? 'bg-gray-50' : 'bg-white'}`}
          onDrop={(e) => handleDrop(e, fieldName)}
          onDragOver={(e) => handleDragOver(e, fieldName)}
          onDragLeave={(e) => handleDragLeave(e, fieldName)}
        >
          {hasPreview ? (
            <div className="relative h-full">
              <img
                src={previewUrls[fieldName] || URL.createObjectURL(files[fieldName])}
                alt={`Preview ${label}`}
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(fieldName)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <ImagePlus className="w-12 h-12 mb-2" />
              <p className="text-sm font-medium">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, fieldName)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
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
              {isNew ? "Add New Product" : "Edit Product"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Material</label>
                    <input
                      type="text"
                      name="material"
                      value={product.material}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Category</label>
                    {!isAddingNewCategory ? (
                      <div className="flex gap-2">
                        <select
                          name="category"
                          value={product.category}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewCategory(true)}
                          className="mt-1 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-1">
                        <div>
                          <input
                            type="text"
                            placeholder="New Category Name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Category Description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleNewCategorySubmit}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Save Category
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewCategory(false);
                              setNewCategory({ name: "", description: "" });
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={product.size}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Colour</label>
                    <input
                      type="text"
                      name="colour"
                      value={product.colour}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={product.weight}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Regular Price</label>
                    <input
                      type="number"
                      name="regularPrice"
                      value={product.regularPrice}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={product.stock || 0}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="codAvailable"
                      name="codAvailable"
                      checked={!!product.codAvailable}
                      onChange={e => setProduct(prev => ({ ...prev, codAvailable: e.target.checked }))}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="codAvailable" className="ml-2 text-gray-700 font-medium">
                      Cash on Delivery Available
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Utility</label>
                    <textarea
                      name="utility"
                      value={product.utility}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Care Instructions</label>
                    <textarea
                      name="care"
                      value={product.care}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={product.inStock}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">In Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Sections */}
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Product Sections
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isBestSeller"
                          checked={product.isBestSeller}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Best Seller</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={product.isFeatured}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Featured</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isMostLoved"
                          checked={product.isMostLoved}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Most Loved</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderFileInput('mainImage', 'Main Image', true)}
                  {renderFileInput('image1', 'Additional Image 1')}
                  {renderFileInput('image2', 'Additional Image 2')}
                  {renderFileInput('image3', 'Additional Image 3')}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
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
                  <span>{isNew ? "Create Product" : "Update Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all transform ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        } ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <div className="flex items-center space-x-2 text-white">
            {toast.type === 'error' ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
      {!isNew && (
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span>Product Reviews</span>
            <PlusCircle className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => setEditingReviewId('new')} title="Add new review" />
          </h2>
          {reviewLoading ? (
            <div className="text-gray-500">Loading reviews...</div>
          ) : (
            <div className="space-y-6">
              {editingReviewId === 'new' && (
                <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-2 mb-4">
                  <div className="flex gap-2">
                    <input type="text" placeholder="User Name" value={newReview.userName} onChange={e => setNewReview(r => ({ ...r, userName: e.target.value }))} className="border rounded px-2 py-1 flex-1" />
                    <input type="email" placeholder="User Email" value={newReview.userEmail} onChange={e => setNewReview(r => ({ ...r, userEmail: e.target.value }))} className="border rounded px-2 py-1 flex-1" />
                    <input type="number" min="1" max="5" placeholder="Stars" value={newReview.stars} onChange={e => setNewReview(r => ({ ...r, stars: e.target.value }))} className="border rounded px-2 py-1 w-20" />
                  </div>
                  <input type="text" placeholder="Title" value={newReview.reviewTitle} onChange={e => setNewReview(r => ({ ...r, reviewTitle: e.target.value }))} className="border rounded px-2 py-1" />
                  <textarea placeholder="Description" value={newReview.reviewDescription} onChange={e => setNewReview(r => ({ ...r, reviewDescription: e.target.value }))} className="border rounded px-2 py-1" />
                  <div className="flex gap-2 mt-2">
                    <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddReview}><Save className="w-4 h-4 inline mr-1" />Save</button>
                    <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={() => setEditingReviewId(null)}><XCircle className="w-4 h-4 inline mr-1" />Cancel</button>
                  </div>
                </div>
              )}
              {reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2">
                  {editingReviewId === review._id ? (
                    <>
                      <div className="flex gap-2">
                        <input type="text" placeholder="User Name" value={editReview.userName} onChange={e => setEditReview(r => ({ ...r, userName: e.target.value }))} className="border rounded px-2 py-1 flex-1" />
                        <input type="email" placeholder="User Email" value={editReview.userEmail} onChange={e => setEditReview(r => ({ ...r, userEmail: e.target.value }))} className="border rounded px-2 py-1 flex-1" />
                        <input type="number" min="1" max="5" placeholder="Stars" value={editReview.stars} onChange={e => setEditReview(r => ({ ...r, stars: e.target.value }))} className="border rounded px-2 py-1 w-20" />
                      </div>
                      <input type="text" placeholder="Title" value={editReview.reviewTitle} onChange={e => setEditReview(r => ({ ...r, reviewTitle: e.target.value }))} className="border rounded px-2 py-1" />
                      <textarea placeholder="Description" value={editReview.reviewDescription} onChange={e => setEditReview(r => ({ ...r, reviewDescription: e.target.value }))} className="border rounded px-2 py-1" />
                      <div className="flex gap-2 mt-2">
                        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleSaveReview(review._id)}><Save className="w-4 h-4 inline mr-1" />Save</button>
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={() => setEditingReviewId(null)}><XCircle className="w-4 h-4 inline mr-1" />Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2 items-center">
                        <span className="font-semibold text-gray-800">{review.userName}</span>
                        <span className="text-gray-500 text-xs">({review.userEmail})</span>
                        <span className="ml-2 text-yellow-500">{'★'.repeat(review.stars)}</span>
                        <span className="ml-2 text-gray-500 text-xs">{review.reviewTitle}</span>
                      </div>
                      <div className="text-gray-700 mb-2">{review.reviewDescription}</div>
                      <div className="flex gap-2">
                        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1" onClick={() => handleEditReview(review)}><Pencil className="w-4 h-4" />Edit</button>
                        <button type="button" className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1" onClick={() => handleDeleteReview(review._id)}><Trash2 className="w-4 h-4" />Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditProduct;
