import React, { useState } from 'react';
import { X, Search, Image, Upload } from 'lucide-react';

const IconSelector = ({
  selectedIcon,
  onIconSelect,
  onFileUpload,
  categoryType = 'general',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadOption, setShowUploadOption] = useState(false);

  // Predefined icons organized by categories
  const iconCategories = {
    income: [
      { name: 'Money', icon: '💰', keywords: ['money', 'cash', 'income', 'salary'] },
      { name: 'Dollar', icon: '💵', keywords: ['dollar', 'bill', 'cash', 'money'] },
      { name: 'Bank', icon: '🏦', keywords: ['bank', 'financial', 'institution'] },
      { name: 'Credit Card', icon: '💳', keywords: ['credit', 'card', 'payment'] },
      { name: 'Piggy Bank', icon: '🐷', keywords: ['savings', 'piggy', 'bank', 'money'] },
      { name: 'Gold', icon: '🥇', keywords: ['gold', 'precious', 'metal', 'value'] },
      { name: 'Gift', icon: '🎁', keywords: ['gift', 'present', 'bonus', 'reward'] },
      { name: 'Star', icon: '⭐', keywords: ['star', 'excellent', 'premium', 'quality'] },
      { name: 'Trophy', icon: '🏆', keywords: ['trophy', 'achievement', 'win', 'success'] },
      { name: 'Diamond', icon: '💎', keywords: ['diamond', 'precious', 'luxury', 'valuable'] },
      { name: 'Briefcase', icon: '💼', keywords: ['briefcase', 'business', 'work', 'professional'] },
      { name: 'Chart', icon: '📈', keywords: ['chart', 'growth', 'increase', 'trend'] },
      { name: 'Handshake', icon: '🤝', keywords: ['handshake', 'deal', 'agreement', 'business'] },
      { name: 'Light Bulb', icon: '💡', keywords: ['idea', 'innovation', 'creative', 'solution'] },
      { name: 'Rocket', icon: '🚀', keywords: ['rocket', 'launch', 'growth', 'success'] },
      { name: 'Coins', icon: '🪙', keywords: ['coins', 'currency', 'money', 'change'] },
      { name: 'Wallet', icon: '👛', keywords: ['wallet', 'money', 'purse', 'finance'] },
      { name: 'Receipt', icon: '🧾', keywords: ['receipt', 'invoice', 'payment', 'transaction'] },
      { name: 'Calculator', icon: '🧮', keywords: ['calculator', 'math', 'calculation', 'numbers'] },
      { name: 'Target', icon: '🎯', keywords: ['target', 'goal', 'objective', 'aim'] }
    ],
    expense: [
      { name: 'Shopping Cart', icon: '🛒', keywords: ['shopping', 'cart', 'purchase', 'buy'] },
      { name: 'Credit Card', icon: '💳', keywords: ['credit', 'card', 'payment', 'expense'] },
      { name: 'Food', icon: '🍕', keywords: ['food', 'meal', 'restaurant', 'dining'] },
      { name: 'Car', icon: '🚗', keywords: ['car', 'vehicle', 'transport', 'gas'] },
      { name: 'House', icon: '🏠', keywords: ['house', 'home', 'rent', 'mortgage'] },
      { name: 'Medical', icon: '🏥', keywords: ['medical', 'health', 'hospital', 'doctor'] },
      { name: 'Education', icon: '🎓', keywords: ['education', 'school', 'learning', 'student'] },
      { name: 'Entertainment', icon: '🎬', keywords: ['entertainment', 'movie', 'fun', 'leisure'] },
      { name: 'Travel', icon: '✈️', keywords: ['travel', 'flight', 'vacation', 'trip'] },
      { name: 'Shopping Bag', icon: '🛍️', keywords: ['shopping', 'bag', 'retail', 'store'] },
      { name: 'Phone', icon: '📱', keywords: ['phone', 'mobile', 'communication', 'tech'] },
      { name: 'Internet', icon: '🌐', keywords: ['internet', 'web', 'online', 'connection'] },
      { name: 'Electricity', icon: '⚡', keywords: ['electricity', 'power', 'energy', 'utility'] },
      { name: 'Water', icon: '💧', keywords: ['water', 'utility', 'bill', 'service'] },
      { name: 'Gas', icon: '⛽', keywords: ['gas', 'fuel', 'petrol', 'energy'] },
      { name: 'Insurance', icon: '🛡️', keywords: ['insurance', 'protection', 'coverage', 'security'] },
      { name: 'Gym', icon: '💪', keywords: ['gym', 'fitness', 'health', 'exercise'] },
      { name: 'Coffee', icon: '☕', keywords: ['coffee', 'drink', 'beverage', 'cafe'] },
      { name: 'Gift', icon: '🎁', keywords: ['gift', 'present', 'donation', 'charity'] },
      { name: 'Repair', icon: '🔧', keywords: ['repair', 'maintenance', 'fix', 'service'] }
    ],
    general: [
      { name: 'Money', icon: '💰', keywords: ['money', 'cash', 'finance'] },
      { name: 'Dollar', icon: '💵', keywords: ['dollar', 'bill', 'cash'] },
      { name: 'Bank', icon: '🏦', keywords: ['bank', 'financial'] },
      { name: 'Credit Card', icon: '💳', keywords: ['credit', 'card', 'payment'] },
      { name: 'Piggy Bank', icon: '🐷', keywords: ['savings', 'piggy', 'bank'] },
      { name: 'Gold', icon: '🥇', keywords: ['gold', 'precious', 'metal'] },
      { name: 'Gift', icon: '🎁', keywords: ['gift', 'present', 'bonus'] },
      { name: 'Star', icon: '⭐', keywords: ['star', 'excellent', 'premium'] },
      { name: 'Trophy', icon: '🏆', keywords: ['trophy', 'achievement', 'win'] },
      { name: 'Diamond', icon: '💎', keywords: ['diamond', 'precious', 'luxury'] },
      { name: 'Shopping Cart', icon: '🛒', keywords: ['shopping', 'cart', 'purchase'] },
      { name: 'Food', icon: '🍕', keywords: ['food', 'meal', 'restaurant'] },
      { name: 'Car', icon: '🚗', keywords: ['car', 'vehicle', 'transport'] },
      { name: 'House', icon: '🏠', keywords: ['house', 'home', 'rent'] },
      { name: 'Medical', icon: '🏥', keywords: ['medical', 'health', 'hospital'] },
      { name: 'Education', icon: '🎓', keywords: ['education', 'school', 'learning'] },
      { name: 'Entertainment', icon: '🎬', keywords: ['entertainment', 'movie', 'fun'] },
      { name: 'Travel', icon: '✈️', keywords: ['travel', 'flight', 'vacation'] },
      { name: 'Phone', icon: '📱', keywords: ['phone', 'mobile', 'communication'] },
      { name: 'Internet', icon: '🌐', keywords: ['internet', 'web', 'online'] }
    ]
  };

  // Get icons based on category type
  const getIconsForCategory = () => {
    if (categoryType === 'income') return iconCategories.income;
    if (categoryType === 'expense') return iconCategories.expense;
    return iconCategories.general;
  };

  // Filter icons based on search term
  const filteredIcons = getIconsForCategory().filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
      setShowUploadOption(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Category Icon</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadOption(!showUploadOption)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Upload custom icon"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      {/* Custom Upload Option */}
      {showUploadOption && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-blue-800 mb-2">
            Upload Custom Icon
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          <p className="text-xs text-blue-600 mt-1">
            Supported formats: PNG, JPG, JPEG, SVG (Recommended: 64x64px)
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Selected Icon Display */}
      {selectedIcon && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{selectedIcon}</div>
            <div>
              <p className="text-sm font-medium text-green-800">Selected Icon</p>
              <p className="text-xs text-green-600">Click on an icon below to change</p>
            </div>
          </div>
        </div>
      )}

      {/* Icon Grid */}
      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredIcons.map((icon, index) => (
            <button
              key={index}
              onClick={() => onIconSelect(icon.icon, icon.name)}
              className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-md ${selectedIcon === icon.icon
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              title={icon.name}
            >
              <div className="text-2xl">{icon.icon}</div>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No icons found matching your search.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Click on any icon to select it, or upload your own custom icon.
          Icons help users quickly identify categories.
        </p>
      </div>
    </div>
  );
};

export default IconSelector;
