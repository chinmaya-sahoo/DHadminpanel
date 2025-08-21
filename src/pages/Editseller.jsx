import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, ImagePlus, AlertCircle, CheckCircle, Plus, Loader2 } from 'lucide-react';
import apiService from "../services/api";

const EditSeller = () => {
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
    rating: "",
    reviews: "",
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

  const [categories, setCategories] = useState([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

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
      const fetchProduct = async () => {
        try {
          // First try to get from bestseller products
          const response = await apiService.getBestSeller(id);
          let prod = response.data.product;

          // If not found in bestseller products, try other collections
          if (!prod) {
            // Try regular products
            const regularResponse = await apiService.getProducts();
            prod = (regularResponse.data.products || regularResponse.data).find(
              (p) => p._id?.toString() === id?.toString()
            );

            // Try featured products
            if (!prod) {
              const featuredResponse = await apiService.getFeaturedProducts();
              prod = (featuredResponse.data.products || []).find(
                (p) => p._id?.toString() === id?.toString()
              );
            }

            // Try loved products
            if (!prod) {
              const lovedResponse = await apiService.getLovedProducts();
              prod = (lovedResponse.data.products || []).find(
                (p) => p._id?.toString() === id?.toString()
              );
            }
          }

          if (prod) {
            console.log('Found product:', prod);
            setProduct({
              ...prod,
              id: prod._id,
              price: prod.price?.toString() || "",
              regularPrice: prod.regularPrice?.toString() || "",
              inStock: !!prod.inStock,
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
        } catch (error) {
          console.error("Failed to fetch product:", error);
          showToast("Error loading product", "error");
        }
      };

      fetchProduct();
    }
  }, [id, isNew]);

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
        if (product[key] !== undefined && product[key] !== null && key !== 'id') {
          formData.append(key, product[key]);
        }
      });

      // Add files to FormData
      if (files.mainImage) formData.append('mainImage', files.mainImage);
      for (let i = 1; i <= 3; i++) {
        if (files[`image${i}`]) {
          formData.append(`image${i}`, files[`image${i}`]);
          console.log(`Adding image${i}:`, files[`image${i}`].name);
        }
      }

      if (isNew) {
        await apiService.createBestSeller(formData);
        showToast("Product created successfully!");
      } else {
        if (Object.values(files).some(file => file instanceof File)) {
          await apiService.updateBestSeller(product.id, formData);
        } else {
          const productData = {
            ...product,
            price: parseFloat(product.price),
            regularPrice: parseFloat(product.regularPrice),
          };
          delete productData.id; // Remove id from update data
          await apiService.updateBestSeller(product.id, productData);
        }
        showToast("Product updated successfully!");
      }
      
      navigate("/admin/seller");
    } catch (error) {
      console.error("Failed to save product", error);
      let errorMessage = "Error saving product";
      if (error.response?.data?.error) {
        errorMessage += `: ${error.response.data.error}`;
      }
      if (error.response?.data?.details) {
        errorMessage += `\nDetails: ${error.response.data.details}`;
      }
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
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
              <ImagePlus className="w-8 h-8 mb-2" />
              <span className="text-sm">Drag & drop or click to upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, fieldName)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
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
              {isNew ? "Add New Best Seller Product" : "Edit Best Seller Product"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
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
                    <label className="block font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
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
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCategory(true)}
                        className="mt-1 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        New
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Material <span className="text-red-500">*</span></label>
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
                    <label className="block font-medium text-gray-700">Size <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="size"
                      value={product.size}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="e.g. 60x40cm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Colour <span className="text-red-500">*</span></label>
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
                    <label className="block font-medium text-gray-700">Weight <span className="text-red-500">*</span></label>
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
                    <label className="block font-medium text-gray-700">Utility <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="utility"
                      value={product.utility}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Care <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="care"
                      value={product.care}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="block w-full pl-7 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Regular Price <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="regularPrice"
                        value={product.regularPrice}
                        onChange={handleChange}
                        className="block w-full pl-7 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
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

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/seller")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 rounded-lg shadow-lg p-4 max-w-sm w-full transition-all transform duration-300 ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          <div className="flex items-center">
            {toast.type === "success" ? (
              <CheckCircle className="w-6 h-6 text-white mr-2" />
            ) : (
              <AlertCircle className="w-6 h-6 text-white mr-2" />
            )}
            <p className="text-white">{toast.message}</p>
          </div>
        </div>
      )}

      {/* New Category Modal */}
      {isAddingNewCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNewCategorySubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSeller;
