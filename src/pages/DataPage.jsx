import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config/config';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Edit3, Save, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';

const TABS = [
  { key: 'terms', label: 'Terms and Conditions', icon: <FileText size={20} /> },
  { key: 'refund', label: 'Refund Policy', icon: <FileText size={20} /> },
  { key: 'privacy', label: 'Privacy Policy', icon: <FileText size={20} /> }
];

const API_URL = config.API_URLS.DATA_PAGE;

const DataPage = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ heading: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.get(`${API_URL}/${activeTab}`);
      setData((prev) => ({ ...prev, [activeTab]: res.data }));
      setForm({ heading: res.data.heading, content: res.data.content });
      setEditMode(false);
    } catch (err) {
      setData((prev) => ({ ...prev, [activeTab]: null }));
      setForm({ heading: '', content: '' });
      setEditMode(false);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    const d = data[activeTab];
    setForm({ heading: d?.heading || '', content: d?.content || '' });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    const d = data[activeTab];
    setForm({ heading: d?.heading || '', content: d?.content || '' });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (data[activeTab]) {
        // Update
        await axios.put(`${API_URL}/${activeTab}`, form);
        setSuccess('Policy updated successfully!');
      } else {
        // Add
        await axios.post(`${API_URL}`, { type: activeTab, ...form });
        setSuccess('Policy created successfully!');
      }
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error saving data');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Policy Management</h1>
          <p className="text-rose-700">Manage your website's legal policies and terms</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {TABS.map((tab, index) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
                ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg'
                  : 'bg-white text-rose-700 hover:bg-pink-50 border border-pink-200'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-pink-200 border-t-rose-400 rounded-full animate-spin mb-4"></div>
              <p className="text-rose-700">Loading...</p>
            </div>
          ) : editMode ? (
            // Edit Mode
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-rose-900 mb-2">
                  Policy Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={form.heading}
                  onChange={handleChange}
                  placeholder="Enter policy heading..."
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-pink-50/50"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-rose-900 mb-2">
                  Policy Content
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Enter policy content... Use lines ending with ':' to create section headers"
                  rows={12}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-pink-50/50 resize-vertical"
                />
                <p className="text-sm text-rose-600 mt-2">
                  💡 Tip: Use lines ending with ":" to create expandable section headers (e.g., "Terms and Conditions:")
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
                >
                  <AlertCircle size={20} className="text-red-500" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6"
                >
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-green-700">{success}</span>
                </motion.div>
              )}

              <div className="flex gap-4">
                <motion.button
                  onClick={handleSave}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-500 transition-all duration-200 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Policy'}
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  <X size={18} />
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-rose-900 mb-2">
                    {data[activeTab]?.heading || `${TABS.find(tab => tab.key === activeTab)?.label} - Not Set`}
                  </h2>
                  <p className="text-rose-600">
                    {data[activeTab] ? 'Policy content is configured' : 'No policy content has been set up yet'}
                  </p>
                </div>
                <motion.button
                  onClick={handleEdit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-500 transition-all duration-200"
                >
                  {data[activeTab] ? <Edit3 size={18} /> : <Plus size={18} />}
                  {data[activeTab] ? 'Edit Policy' : 'Add Policy'}
                </motion.button>
              </div>

              {data[activeTab]?.content ? (
                <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                  <div className="prose prose-pink max-w-none">
                    <pre className="whitespace-pre-wrap text-rose-800 font-sans text-sm leading-relaxed">
                      {data[activeTab].content}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-rose-900 mb-2">
                    No Content Available
                  </h3>
                  <p className="text-rose-600 mb-6">
                    This policy hasn't been set up yet. Click "Add Policy" to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DataPage; 