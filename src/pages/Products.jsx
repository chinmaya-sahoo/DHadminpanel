import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Grid, List, Image as ImageIcon, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import apiService from "../services/api";

const getImageUrl = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  return `https://pawnbackend-xmqa.onrender.com${imgPath}`;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Section options
  const sections = [
    { id: 'all', label: 'All Products' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'featured', label: 'Featured' },
    { id: 'mostloved', label: 'Most Loved' }
  ];

  // Fetch products based on section
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (selectedSection === 'all') {
        response = await apiService.getProducts();
      } else {
        response = await apiService.getProductsBySection(selectedSection);
      }
      
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedSection]);

  // Delete product by id
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        console.log('Products page - Deleting product with ID:', id);
        await apiService.deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
        setError("Failed to delete product. Please try again later.");
      }
    }
  };

  // Get all images for a product
  const getProductImages = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  };

  // Handle image navigation
  const handleImageChange = (productId, direction) => {
    const product = products.find(p => p._id === productId);
    const images = getProductImages(product);
    const currentIndex = selectedImageIndex[productId] || 0;
    
    if (direction === 'next') {
      setSelectedImageIndex(prev => ({
        ...prev,
        [productId]: (currentIndex + 1) % images.length
      }));
    } else {
      setSelectedImageIndex(prev => ({
        ...prev,
        [productId]: currentIndex === 0 ? images.length - 1 : currentIndex - 1
      }));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, productId) => {
    const product = products.find(p => p._id === productId);
    const images = getProductImages(product);
    
    if (images.length <= 1) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleImageChange(productId, 'prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleImageChange(productId, 'next');
    }
  };

  // Handle image load error
  const handleImageError = (productId, imageIndex) => {
    console.log(`Image failed to load for product ${productId}, image ${imageIndex}`);
    setImageErrors(prev => ({
      ...prev,
      [`${productId}-${imageIndex}`]: true
    }));
  };

  // Handle section toggle
  const handleSectionToggle = async (productId, section) => {
    try {
      const sections = {
        bestsellers: 'isBestSeller',
        featured: 'isFeatured',
        mostloved: 'isMostLoved'
      };
      
      const sectionKey = sections[section];
      const product = products.find(p => p._id === productId);
      const currentValue = product[sectionKey] || false;
      
      await apiService.updateProductSections(productId, {
        [sectionKey]: !currentValue
      });
      
      // Update local state
      setProducts(prev => prev.map(p => 
        p._id === productId 
          ? { ...p, [sectionKey]: !currentValue }
          : p
      ));
    } catch (error) {
      console.error(`Failed to toggle ${section}`, error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductCard = ({ product }) => {
    const images = getProductImages(product);
    const currentImageIndex = selectedImageIndex[product._id] || 0;
    const currentImage = images[currentImageIndex];
    const imageErrorKey = `${product._id}-${currentImageIndex}`;
    const hasImageError = imageErrors[imageErrorKey];

    return (
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, product._id)}
      >
        {/* Image Section */}
        <div className="relative aspect-square bg-gray-50">
          {currentImage && !hasImageError ? (
            <div className="relative h-full group">
              <img
                src={getImageUrl(currentImage)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => handleImageError(product._id, currentImageIndex)}
                onLoad={() => console.log(`Image loaded successfully: ${currentImage}`)}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleImageChange(product._id, 'prev');
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full p-2 hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleImageChange(product._id, 'next');
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full p-2 hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image indicator dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-white shadow-lg' 
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Section Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <button
              onClick={() => handleSectionToggle(product._id, 'bestsellers')}
              className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                product.isBestSeller 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
              }`}
            >
              Best Seller
            </button>
            <button
              onClick={() => handleSectionToggle(product._id, 'featured')}
              className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                product.isFeatured 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-purple-100'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => handleSectionToggle(product._id, 'mostloved')}
              className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                product.isMostLoved 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-pink-100'
              }`}
            >
              Most Loved
            </button>
            {!product.inStock && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Image Count Badge */}
          {images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
          {/* Product Rating Stars */}
          {typeof product.rating === 'number' && product.reviews > 0 && (
            <div className="flex items-center mb-1">
              <span className="text-yellow-400 mr-1">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className="text-xs text-gray-500">{product.rating.toFixed(1)} / 5 ({product.reviews})</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{product.category}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-green-600 text-lg">₹{product.price?.toFixed(2) || '0.00'}</div>
              {product.regularPrice && product.regularPrice > product.price && (
                <div className="text-gray-400 text-xs line-through">₹{product.regularPrice.toFixed(2)}</div>
              )}
            </div>
            {/* Stock Available Indicator (replaces review stars) */}
            <div className="flex items-center space-x-1">
              {typeof product.stock === 'number' ? (
                product.stock > 0 ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )
              ) : (
                <span className="text-xs font-semibold text-gray-500">Stock unknown</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Link
              to={`/admin/products/edit/${product._id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(product._id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link
          to="/admin/products/edit/new"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Section Filter */}
        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center p-4 mb-6 text-red-800 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
