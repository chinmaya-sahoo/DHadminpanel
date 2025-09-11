import React, { useState, useEffect } from 'react';
import { Save, Edit, FileText, Shield, ReceiptText, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const TandCManager = () => {
  const [policies, setPolicies] = useState({
    terms: {
      title: "Terms and Conditions",
      points: [
        { id: 1, title: "Introduction", description: "Welcome to our website. These terms govern your use of our site." },
        { id: 2, title: "User Responsibilities", description: "Users must provide accurate information and keep passwords secure." }
      ],
      lastUpdated: "2023-01-01"
    },
    privacy: {
      title: "Privacy Policy",
      points: [
        { id: 1, title: "Data Collection", description: "We collect information you provide directly to us." },
        { id: 2, title: "Data Usage", description: "We use your information to provide and improve our services." }
      ],
      lastUpdated: "2023-01-01"
    },
    about: {
      title: "About Us",
      points: [
        { id: 1, title: "Our Mission", description: "Our mission is to provide excellent services to our customers." },
        { id: 2, title: "Our Team", description: "We have a dedicated team of professionals." }
      ],
      lastUpdated: "2023-01-01"
    }
  });

  const [activeTab, setActiveTab] = useState('terms');
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [newPoint, setNewPoint] = useState({ title: '', description: '' });
  const [editingPoint, setEditingPoint] = useState(null);
  const [originalPolicies, setOriginalPolicies] = useState(null);

  // Load policies from localStorage on component mount
  useEffect(() => {
    const savedPolicies = localStorage.getItem('sitePolicies');
    if (savedPolicies) {
      const parsedPolicies = JSON.parse(savedPolicies);
      setPolicies(parsedPolicies);
      setOriginalPolicies(parsedPolicies);
    } else {
      setOriginalPolicies({...policies});
    }
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    if (editMode) {
      // Revert changes without confirmation
      setPolicies({...originalPolicies});
      setEditMode(false);
      setEditingPoint(null);
      setNewPoint({ title: '', description: '' });
    }
    setActiveTab(tab);
  };

  // Enable edit mode
  const handleEdit = () => {
    setOriginalPolicies({...policies});
    setEditMode(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setPolicies({...originalPolicies});
    setEditMode(false);
    setEditingPoint(null);
    setNewPoint({ title: '', description: '' });
    setSaveStatus('');
  };

  // Save changes
  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    
    // Simulate API call
    setTimeout(() => {
      setEditMode(false);
      setEditingPoint(null);
      setNewPoint({ title: '', description: '' });
      localStorage.setItem('sitePolicies', JSON.stringify(policies));
      setOriginalPolicies({...policies});
      
      setIsSaving(false);
      setSaveStatus('Saved successfully!');
      
      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  // Add a new point
  const handleAddPoint = () => {
    if (!newPoint.title.trim() || !newPoint.description.trim()) return;
    
    const nextId = policies[activeTab].points.length > 0 
      ? Math.max(...policies[activeTab].points.map(p => p.id)) + 1 
      : 1;
    
    const updatedPolicies = {
      ...policies,
      [activeTab]: {
        ...policies[activeTab],
        points: [...policies[activeTab].points, { id: nextId, ...newPoint }],
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    
    setPolicies(updatedPolicies);
    setNewPoint({ title: '', description: '' });
  };

  // Start editing a point
  const handleEditPoint = (point) => {
    setEditingPoint({...point});
  };

  // Save edited point
  const handleSaveEditedPoint = () => {
    if (!editingPoint.title.trim() || !editingPoint.description.trim()) return;
    
    const updatedPolicies = {
      ...policies,
      [activeTab]: {
        ...policies[activeTab],
        points: policies[activeTab].points.map(p => 
          p.id === editingPoint.id ? editingPoint : p
        ),
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    
    setPolicies(updatedPolicies);
    setEditingPoint(null);
  };

  // Delete a point
  const handleDeletePoint = (id) => {
    if (!window.confirm('Are you sure you want to delete this point?')) return;
    
    const updatedPolicies = {
      ...policies,
      [activeTab]: {
        ...policies[activeTab],
        points: policies[activeTab].points.filter(p => p.id !== id),
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    
    setPolicies(updatedPolicies);
  };

  // Move point up or down
  const handleMovePoint = (id, direction) => {
    const points = [...policies[activeTab].points];
    const index = points.findIndex(p => p.id === id);
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === points.length - 1)) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [points[index], points[newIndex]] = [points[newIndex], points[index]];
    
    const updatedPolicies = {
      ...policies,
      [activeTab]: {
        ...policies[activeTab],
        points,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    
    setPolicies(updatedPolicies);
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
            activeTab === 'about'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('about')}
        >
          <ReceiptText size={18} className="mr-2" />
          About Us
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
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Point</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Point Title</label>
                <input
                  type="text"
                  value={newPoint.title}
                  onChange={(e) => setNewPoint({...newPoint, title: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter point title"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPoint.description}
                  onChange={(e) => setNewPoint({...newPoint, description: e.target.value})}
                  className="w-full h-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter point description"
                />
              </div>
              <button
                onClick={handleAddPoint}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add Point
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Policy Points</h3>
            {policies[activeTab].points.length === 0 ? (
              <p className="text-gray-500 italic">No points added yet.</p>
            ) : (
              <div className="space-y-4">
                {policies[activeTab].points.map((point, index) => (
                  <div key={point.id} className="border rounded-lg p-4 bg-white">
                    {editingPoint && editingPoint.id === point.id ? (
                      <div className="mb-4">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Point Title</label>
                          <input
                            type="text"
                            value={editingPoint.title}
                            onChange={(e) => setEditingPoint({...editingPoint, title: e.target.value})}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingPoint.description}
                            onChange={(e) => setEditingPoint({...editingPoint, description: e.target.value})}
                            className="w-full h-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEditedPoint}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPoint(null)}
                            className="px-3 py-1 text-gray-700 border rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-medium text-gray-800">
                            {index + 1}. {point.title}
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMovePoint(point.id, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={() => handleMovePoint(point.id, 'down')}
                              disabled={index === policies[activeTab].points.length - 1}
                              className={`p-1 rounded ${index === policies[activeTab].points.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                            <button
                              onClick={() => handleEditPoint(point)}
                              className="p-1 text-blue-600 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePoint(point.id)}
                              className="p-1 text-red-600 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{point.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
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
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none mb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            {policies[activeTab].points.map((point, index) => (
              <div key={point.id} className="mb-6 last:mb-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {index + 1}. {point.title}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TandCManager;