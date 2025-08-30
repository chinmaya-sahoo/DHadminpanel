import React, { useState, useEffect } from 'react';
import { Save, Edit, FileText, Shield, RefreshCw } from 'lucide-react';

const TandCManager = () => {
  const [policies, setPolicies] = useState({
    terms: {
      title: "Terms and Conditions",
      content: `Please update your terms and conditions here...`,
      lastUpdated: "2023-01-01"
    },
    privacy: {
      title: "Privacy Policy",
      content: `Please update your privacy policy here...`,
      lastUpdated: "2023-01-01"
    },
    refund: {
      title: "Return and Refund Policy",
      content: `Please update your return and refund policy here...`,
      lastUpdated: "2023-01-01"
    }
  });

  const [activeTab, setActiveTab] = useState('terms');
  const [editMode, setEditMode] = useState(false);
  const [tempContent, setTempContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load policies from localStorage on component mount
  useEffect(() => {
    const savedPolicies = localStorage.getItem('sitePolicies');
    if (savedPolicies) {
      setPolicies(JSON.parse(savedPolicies));
    }
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    if (editMode) {
      if (window.confirm('You have unsaved changes. Are you sure you want to switch tabs?')) {
        setEditMode(false);
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  // Enable edit mode
  const handleEdit = () => {
    setTempContent(policies[activeTab].content);
    setEditMode(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setSaveStatus('');
  };

  // Save changes
  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    
    // Simulate API call
    setTimeout(() => {
      const updatedPolicies = {
        ...policies,
        [activeTab]: {
          ...policies[activeTab],
          content: tempContent,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      };
      
      setPolicies(updatedPolicies);
      localStorage.setItem('sitePolicies', JSON.stringify(updatedPolicies));
      
      setEditMode(false);
      setIsSaving(false);
      setSaveStatus('Saved successfully!');
      
      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Management</h1>
        <p className="text-gray-600">Update your website's policies and terms</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6 overflow-x-scroll md:overflow-x-auto">
        <button
          className={`flex items-center px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'terms'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('terms')}
        >
          <FileText size={18} className="mr-2" />
          Terms & Conditions
        </button>
        <button
          className={`flex items-center px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'privacy'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('privacy')}
        >
          <Shield size={18} className="mr-2" />
          Privacy Policy
        </button>
        <button
          className={`flex items-center px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'refund'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('refund')}
        >
          <RefreshCw size={18} className="mr-2" />
          Return & Refund
        </button>
      </div>

      {/* Policy Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{policies[activeTab].title}</h2>
          <p className="text-sm text-gray-500">
            Last updated: {policies[activeTab].lastUpdated}
          </p>
        </div>
        {!editMode && (
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={18} className="mr-2" />
            Edit
          </button>
        )}
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-3 rounded-lg mb-6 ${
          saveStatus.includes('success') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {saveStatus}
        </div>
      )}

      {/* Policy Content */}
      {editMode ? (
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {policies[activeTab].title} Content
            </label>
            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter your ${policies[activeTab].title.toLowerCase()} here...`}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none mb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            {policies[activeTab].content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TandCManager;