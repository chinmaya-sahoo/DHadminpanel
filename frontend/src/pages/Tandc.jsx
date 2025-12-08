import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Shield, ReceiptText, History, Save, AlertCircle, HelpCircle } from 'lucide-react';
import TermsAndConditions from '../components/TandC/TermsAndConditions';
import PrivacyPolicy from '../components/TandC/PrivacyPolicy';
import AboutUs from '../components/TandC/AboutUs';
import FAQManagement from '../components/TandC/FAQManagement';
import apiService from '../services/api';

const TandCManager = () => {
  const [policies, setPolicies] = useState({});
  const [activeTab, setActiveTab] = useState('terms');
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [newPoint, setNewPoint] = useState({ title: '', description: '' });
  const [editingPoint, setEditingPoint] = useState(null);
  const [originalPolicies, setOriginalPolicies] = useState(null);
  const [versionHistory, setVersionHistory] = useState({});
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionData, setVersionData] = useState({
    version_number: '',
    version_description: '',
    effective_date: new Date().toISOString().split('T')[0]
  });

  // Load policies from API
  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [, termsRes, privacyRes, aboutRes] = await Promise.all([
        apiService.getAllPolicyCategories(),
        apiService.getPolicyContent('terms'),
        apiService.getPolicyContent('privacy'),
        apiService.getPolicyContent('about')
      ]);

      // Categories are fetched but not used in current implementation
      // if (categoriesRes.success) {
      //   setCategories(categoriesRes.data);
      // }

      const policiesData = {};

      if (termsRes.success) {
        policiesData.terms = {
          ...termsRes.data.category,
          points: termsRes.data.points,
          lastUpdated: termsRes.data.latest_version?.effective_date || 'N/A'
        };
      }

      if (privacyRes.success) {
        policiesData.privacy = {
          ...privacyRes.data.category,
          points: privacyRes.data.points,
          lastUpdated: privacyRes.data.latest_version?.effective_date || 'N/A'
        };
      }

      if (aboutRes.success) {
        policiesData.about = {
          ...aboutRes.data.category,
          points: aboutRes.data.points,
          lastUpdated: aboutRes.data.latest_version?.effective_date || 'N/A'
        };
      }

      setPolicies(policiesData);
      setOriginalPolicies(policiesData);
    } catch (err) {
      console.error('Error fetching policies:', err);
      setError('Failed to load policies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Helper function to get category ID
  const getCategoryId = (tabName) => {
    const categoryMap = {
      'terms': 1,
      'privacy': 2,
      'about': 3
    };
    return categoryMap[tabName] || 1;
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    if (editMode) {
      // Revert changes without confirmation
      setPolicies({ ...originalPolicies });
      setEditMode(false);
      setEditingPoint(null);
      setNewPoint({ title: '', description: '' });
    }
    setActiveTab(tab);
  };

  // Enable edit mode
  const handleEdit = () => {
    setOriginalPolicies({ ...policies });
    setEditMode(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setPolicies({ ...originalPolicies });
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
      setOriginalPolicies({ ...policies });

      setIsSaving(false);
      setSaveStatus('Saved successfully!');

      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  // Add a new point
  const handleAddPoint = async () => {
    if (!newPoint.title.trim() || !newPoint.description.trim()) return;

    try {
      setIsSaving(true);
      setSaveStatus('Adding point...');

      const categoryId = getCategoryId(activeTab);
      const pointOrder = policies[activeTab]?.points?.length + 1 || 1;

      const response = await apiService.createPolicyPoint({
        category_id: categoryId,
        point_title: newPoint.title,
        point_description: newPoint.description,
        point_order: pointOrder
      });

      if (response.success) {
        setSaveStatus('Point added successfully!');
        await fetchPolicies(); // Refresh data
        setNewPoint({ title: '', description: '' });
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to add point. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error adding point:', err);
      setSaveStatus('Failed to add point. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Start editing a point
  const handleEditPoint = (point) => {
    setEditingPoint({ ...point });
  };

  // Save edited point
  const handleSaveEditedPoint = async () => {
    // Check for both field name formats (point_title/point_description or title/description)
    const title = editingPoint.point_title || editingPoint.title || '';
    const description = editingPoint.point_description || editingPoint.description || '';
    
    if (!title.trim() || !description.trim()) {
      setSaveStatus('Please fill in both title and description.');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('Updating point...');

      const response = await apiService.updatePolicyPoint(editingPoint.point_id, {
        point_title: title,
        point_description: description,
        point_order: editingPoint.point_order,
        is_active: editingPoint.is_active !== undefined ? editingPoint.is_active : 1
      });

      if (response.success) {
        setSaveStatus('Point updated successfully!');
        await fetchPolicies(); // Refresh data
        setEditingPoint(null);
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to update point. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error updating point:', err);
      setSaveStatus('Failed to update point. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a point
  const handleDeletePoint = async (pointId) => {
    if (!window.confirm('Are you sure you want to delete this point?')) return;

    try {
      setIsSaving(true);
      setSaveStatus('Deleting point...');

      const response = await apiService.deletePolicyPoint(pointId);

      if (response.success) {
        setSaveStatus('Point deleted successfully!');
        await fetchPolicies(); // Refresh data
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to delete point. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting point:', err);
      setSaveStatus('Failed to delete point. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Move point up or down
  const handleMovePoint = async (pointId, direction) => {
    const points = [...policies[activeTab].points];
    const index = points.findIndex(p => p.point_id === pointId);

    if ((direction === 'up' && index === 0) ||
      (direction === 'down' && index === points.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [points[index], points[newIndex]] = [points[newIndex], points[index]];

    try {
      setIsSaving(true);
      setSaveStatus('Reordering points...');

      const reorderData = points.map((point, idx) => ({
        point_id: point.point_id,
        point_order: idx + 1
      }));

      const response = await apiService.reorderPolicyPoints(getCategoryId(activeTab), {
        points: reorderData
      });

      if (response.success) {
        setSaveStatus('Points reordered successfully!');
        await fetchPolicies(); // Refresh data
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to reorder points. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error reordering points:', err);
      setSaveStatus('Failed to reorder points. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Version management functions
  const handleCreateVersion = async () => {
    if (!versionData.version_number.trim()) return;

    try {
      setIsSaving(true);
      setSaveStatus('Creating version...');

      const response = await apiService.createPolicyVersion({
        category_id: getCategoryId(activeTab),
        version_number: versionData.version_number,
        version_description: versionData.version_description,
        effective_date: versionData.effective_date,
        policy_data: {
          points: policies[activeTab]?.points || []
        }
      });

      if (response.success) {
        setSaveStatus('Version created successfully!');
        setShowVersionModal(false);
        setVersionData({
          version_number: '',
          version_description: '',
          effective_date: new Date().toISOString().split('T')[0]
        });
        await fetchPolicies(); // Refresh data
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to create version. Please try again.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Error creating version:', err);
      setSaveStatus('Failed to create version. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewVersionHistory = async () => {
    try {
      const response = await apiService.getPolicyVersionHistory(getCategoryId(activeTab));
      if (response.success) {
        setVersionHistory({
          ...versionHistory,
          [activeTab]: response.data
        });
      }
    } catch (err) {
      console.error('Error fetching version history:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-sm sm:text-base text-gray-600">Loading policies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPolicies}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Policy Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Update your website's policies and terms</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleViewVersionHistory}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              <History size={16} className="mr-2" />
              <span className="hidden sm:inline">Version History</span>
              <span className="sm:hidden">History</span>
            </button>
            <button
              onClick={() => setShowVersionModal(true)}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <Save size={16} className="mr-2" />
              <span className="hidden sm:inline">Create Version</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-4 sm:mb-6 overflow-x-scroll md:overflow-x-auto">
        <button
          className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 font-medium border-b-2 transition-colors text-xs sm:text-sm ${activeTab === 'terms'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => handleTabChange('terms')}
        >
          <FileText size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Terms & Conditions</span>
          <span className="sm:hidden">Terms</span>
        </button>
        <button
          className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 font-medium border-b-2 transition-colors text-xs sm:text-sm ${activeTab === 'privacy'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => handleTabChange('privacy')}
        >
          <Shield size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Privacy Policy</span>
          <span className="sm:hidden">Privacy</span>
        </button>
        <button
          className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 font-medium border-b-2 transition-colors text-xs sm:text-sm ${activeTab === 'about'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => handleTabChange('about')}
        >
          <ReceiptText size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">About Us</span>
          <span className="sm:hidden">About</span>
        </button>
        <button
          className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 font-medium border-b-2 transition-colors text-xs sm:text-sm ${activeTab === 'faq'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => handleTabChange('faq')}
        >
          <HelpCircle size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">FAQ Management</span>
          <span className="sm:hidden">FAQ</span>
        </button>
      </div>

      {/* Render Active Component */}
      {activeTab === 'terms' && (
        <TermsAndConditions
          policy={policies.terms}
          editMode={editMode}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={isSaving}
          saveStatus={saveStatus}
          onAddPoint={handleAddPoint}
          onEditPoint={handleEditPoint}
          onSaveEditedPoint={handleSaveEditedPoint}
          onDeletePoint={handleDeletePoint}
          onMovePoint={handleMovePoint}
          newPoint={newPoint}
          setNewPoint={setNewPoint}
          editingPoint={editingPoint}
          setEditingPoint={setEditingPoint}
        />
      )}

      {activeTab === 'privacy' && (
        <PrivacyPolicy
          policy={policies.privacy}
          editMode={editMode}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={isSaving}
          saveStatus={saveStatus}
          onAddPoint={handleAddPoint}
          onEditPoint={handleEditPoint}
          onSaveEditedPoint={handleSaveEditedPoint}
          onDeletePoint={handleDeletePoint}
          onMovePoint={handleMovePoint}
          newPoint={newPoint}
          setNewPoint={setNewPoint}
          editingPoint={editingPoint}
          setEditingPoint={setEditingPoint}
        />
      )}

      {activeTab === 'about' && (
        <AboutUs
          policy={policies.about}
          editMode={editMode}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={isSaving}
          saveStatus={saveStatus}
          onAddPoint={handleAddPoint}
          onEditPoint={handleEditPoint}
          onSaveEditedPoint={handleSaveEditedPoint}
          onDeletePoint={handleDeletePoint}
          onMovePoint={handleMovePoint}
          newPoint={newPoint}
          setNewPoint={setNewPoint}
          editingPoint={editingPoint}
          setEditingPoint={setEditingPoint}
        />
      )}

      {activeTab === 'faq' && (
        <FAQManagement />
      )}

      {/* Version Creation Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Create Policy Version</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Number</label>
                <input
                  type="text"
                  value={versionData.version_number}
                  onChange={(e) => setVersionData({ ...versionData, version_number: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., 1.1, 2.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={versionData.version_description}
                  onChange={(e) => setVersionData({ ...versionData, version_description: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  rows="3"
                  placeholder="Describe the changes in this version"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={versionData.effective_date}
                  onChange={(e) => setVersionData({ ...versionData, effective_date: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVersion}
                disabled={isSaving || !versionData.version_number.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
              >
                {isSaving ? 'Creating...' : 'Create Version'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TandCManager;