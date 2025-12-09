import React, { useState, useEffect } from "react";
import { Pencil, Save, PlusCircle, Trash2, CreditCard, X, Check, Loader2 } from "lucide-react";
import apiService from '../../services/api';
import config from '../../config/config';


const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [editPlan, setEditPlan] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPlan, setNewPlan] = useState({
    description: '',
    text: '',
    amount: 0,
    subscription_type: 2,
    validity_days: ''
  });

  // Add confirmation modal state
  const [modal, setModal] = useState({ open: false, message: "", onConfirm: null });

  // Subscription type mapping with default validity days
  const subscriptionTypes = [
    { value: 1, label: "Yearly", defaultValidity: 365 },
    { value: 2, label: "Monthly", defaultValidity: 30 },
    { value: 3, label: "Lifetime", defaultValidity: 3650 },
    { value: 4, label: "Other", defaultValidity: null } // null means custom validity required
  ];

  // Special plans that cannot be deleted and have restricted editing
  const specialPlans = [config.SPECIAL_PLANS.FREE_TRIAL, config.SPECIAL_PLANS.REFERRAL_REWARD]; // Free Trial (0) and Referral Reward (1)

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);


  // Get default validity days for subscription type
  const getDefaultValidityDays = (subscriptionType) => {
    const typeObj = subscriptionTypes.find(t => t.value === subscriptionType);
    return typeObj ? typeObj.defaultValidity : 30;
  };

  // Check if subscription type requires custom validity (Other type)
  const requiresCustomValidity = (subscriptionType) => {
    return subscriptionType === 4;
  };

  // Handle subscription type change and auto-set validity days (except for Other)
  const handleSubscriptionTypeChange = (type) => {
    const defaultValidity = getDefaultValidityDays(type);
    // For "Other" type, don't auto-set validity, let user input it
    if (type === 4) {
      setNewPlan({ ...newPlan, subscription_type: type, validity_days: '' });
    } else {
    setNewPlan({ ...newPlan, subscription_type: type, validity_days: defaultValidity });
    }
  };

  // Check if a plan is a special plan (subscription_type = 0)
  const isSpecialPlan = (plan) => {
    // Check by subscription_type = 0 instead of subscription_id
    if (typeof plan === 'object' && plan !== null) {
      return parseInt(plan.subscription_type) === 0;
    }
    // Fallback: if plan is a number (subscription_id), check if it's in special plans
    return specialPlans.includes(Number(plan));
  };

  // Get plan type label for special plans
  const getSpecialPlanLabel = (planId) => {
    switch (planId) {
      case config.SPECIAL_PLANS.FREE_TRIAL: return "Free Trial Plan";
      case config.SPECIAL_PLANS.REFERRAL_REWARD: return "Referral Reward Plan";
      default: return "Special Plan";
    }
  };

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSubscriptionPlans();

      if (response && response.success) {
        // Extract plans from the nested structure: response.data.plans
        const plansData = response.data && response.data.plans ? response.data.plans : [];
        setPlans(plansData);
      } else {
        setError('Failed to fetch subscription plans');
        setPlans([]); // Ensure plans is always an array
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError(err.message || 'Failed to fetch subscription plans');
      setPlans([]); // Ensure plans is always an array
    } finally {
      setLoading(false);
    }
  };

  // Confirmation function
  const confirmAction = (msg, action) => {
    setModal({ open: true, message: msg, onConfirm: action });
  };

  // Create a new plan
  const handleCreatePlan = async () => {
    // Convert empty string amount to 0
    const amountValue = newPlan.amount === '' || newPlan.amount === null || newPlan.amount === undefined ? 0 : newPlan.amount;
    
    if (newPlan.description && newPlan.text && amountValue >= 0) {
      try {
        setLoading(true);

        // Prepare plan data with validity_days
        // For "Other" type, validity_days must be provided by user
        const planData = {
          description: newPlan.description,
          text: newPlan.text,
          amount: amountValue,
          subscription_type: newPlan.subscription_type,
          validity_days: requiresCustomValidity(newPlan.subscription_type) 
            ? newPlan.validity_days 
            : getDefaultValidityDays(newPlan.subscription_type)
        };

        // Validate validity_days for "Other" type
        if (requiresCustomValidity(newPlan.subscription_type) && (!newPlan.validity_days || newPlan.validity_days <= 0)) {
          setError('For "Other" subscription type, validity days is required');
          setLoading(false);
          return;
        }

        const response = await apiService.createSubscriptionPlan(planData);
        if (response && response.success) {
          await fetchPlans(); // Refresh the plans list
          setNewPlan({
            description: '',
            text: '',
            amount: 0,
            subscription_type: 2,
            validity_days: ''
          });
          setIsCreating(false);
        } else {
          setError(response?.message || 'Failed to create subscription plan');
        }
      } catch (err) {
        console.error('Error creating subscription plan:', err);
        setError(err.message || 'Failed to create subscription plan');
      } finally {
        setLoading(false);
      }
    }
  };

  // Update an existing plan
  const handleSave = async (planId) => {
    try {
      setLoading(true);
      const planToUpdate = Array.isArray(plans) ? plans.find(p => p.subscription_id === planId) : null;
      if (planToUpdate) {
        // For special plans, ensure validity_days is set
        // For "Other" type, validity_days is required
        let validityDays;
        if (isSpecialPlan(planToUpdate)) {
          validityDays = planToUpdate.validity_days || 15; // Default to 15 days for special plans
        } else if (requiresCustomValidity(planToUpdate.subscription_type)) {
          validityDays = planToUpdate.validity_days;
          if (!validityDays || validityDays <= 0) {
            setError('For "Other" subscription type, validity days is required');
            setLoading(false);
            return;
          }
        } else {
          validityDays = planToUpdate.validity_days || getDefaultValidityDays(planToUpdate.subscription_type);
        }

        // For special plans, don't send amount and subscription_type (they cannot be changed)
        // For regular plans, include all fields
        let updateData;
        if (isSpecialPlan(planToUpdate)) {
          updateData = {
            subscription_id: planToUpdate.subscription_id.toString(),
            description: planToUpdate.description,
            text: planToUpdate.text,
            validity_days: validityDays
            // Note: amount and subscription_type are NOT included for special plans
          };
        } else {
          // Convert empty string amount to 0
          const amountValue = planToUpdate.amount === '' || planToUpdate.amount === null || planToUpdate.amount === undefined ? 0 : planToUpdate.amount;
          
          updateData = {
          subscription_id: planToUpdate.subscription_id.toString(), // Convert to string
          description: planToUpdate.description,
          text: planToUpdate.text,
            amount: amountValue,
          subscription_type: planToUpdate.subscription_type.toString(), // Convert to string
          validity_days: validityDays
        };
        }

        const response = await apiService.updateSubscriptionPlan(updateData);
        if (response && response.success) {
          await fetchPlans(); // Refresh the plans list
          setEditPlan(null);
        } else {
          setError(response?.message || 'Failed to update subscription plan');
        }
      }
    } catch (err) {
      console.error('Error updating subscription plan:', err);
      setError(err.message || 'Failed to update subscription plan');
    } finally {
      setLoading(false);
    }
  };

  // Delete a plan (using confirmation modal)
  const handleDeletePlan = (planId) => {
    const planToDelete = Array.isArray(plans) ? plans.find(p => p.subscription_id === planId) : null;
    
    // Prevent deletion of plans with subscription_type = 0
    if (planToDelete && parseInt(planToDelete.subscription_type) === 0) {
      setError('Cannot delete plans with subscription_type = 0');
      return;
    }

    confirmAction(
      `Are you sure you want to delete the "${planToDelete?.description || 'this'}" plan? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiService.deleteSubscriptionPlan(planId);
          if (response && response.success) {
            await fetchPlans(); // Refresh the plans list
          } else {
            setError(response?.message || 'Failed to delete subscription plan');
          }
        } catch (err) {
          console.error('Error deleting subscription plan:', err);
          setError(err.message || 'Failed to delete subscription plan');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Get subscription type label
  const getSubscriptionTypeLabel = (type) => {
    const typeObj = subscriptionTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : 'Unknown';
  };

  if (loading && (!Array.isArray(plans) || plans.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading subscription plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Plan Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2 text-sm sm:text-base"
          disabled={loading}
        >
          <PlusCircle size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Create New Plan</span>
          <span className="sm:hidden">Create Plan</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-xs sm:text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={() => setError(null)}
                  className="bg-red-100 px-3 py-1 rounded text-xs sm:text-sm text-red-800 hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Plan Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Create New Plan</h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewPlan({
                    description: '',
                    text: '',
                    amount: 0,
                    subscription_type: 2,
                    validity_days: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Plan Description</label>
                <input
                  type="text"
                  className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Premium Monthly Plan"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Plan Text</label>
                <textarea
                  className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Get premium features for one month"
                  value={newPlan.text}
                  onChange={(e) => setNewPlan({ ...newPlan, text: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="0.00 (Enter 0 for free plan)"
                  value={newPlan.amount === '' || newPlan.amount === null || newPlan.amount === undefined ? '' : newPlan.amount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      // Allow empty field so user can completely erase
                      setNewPlan({ ...newPlan, amount: '' });
                    } else {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue) && numValue >= 0) {
                        setNewPlan({ ...newPlan, amount: numValue });
                      }
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Subscription Type</label>
                <select
                  className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  value={newPlan.subscription_type}
                  onChange={(e) => handleSubscriptionTypeChange(parseInt(e.target.value))}
                >
                  {subscriptionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} {type.defaultValidity ? `(${type.defaultValidity} days)` : '(Custom)'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {requiresCustomValidity(newPlan.subscription_type) 
                    ? 'Please enter custom validity days below'
                    : `Validity will be automatically set to ${getDefaultValidityDays(newPlan.subscription_type)} days`}
                </p>
              </div>

              {requiresCustomValidity(newPlan.subscription_type) && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Validity Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36500"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter validity days (1-36500)"
                    value={newPlan.validity_days || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : parseInt(e.target.value) || '';
                      setNewPlan({ ...newPlan, validity_days: value });
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Range: 1-36,500 days (1-100 years)
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={handleCreatePlan}
                  className="flex-1 bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Create Plan
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewPlan({
                      description: '',
                      text: '',
                      amount: 0,
                      subscription_type: 1
                    });
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.isArray(plans) && plans.map((plan) => (
          <div key={plan.subscription_id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 sm:p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {plan.description || plan.text || 'Unnamed Plan'}
              </h3>
              {isSpecialPlan(plan) && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Special Plan (Type 0)
                  </span>
                </div>
              )}
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{plan.amount}</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">
                  /{isSpecialPlan(plan)
                    ? 'special'
                    : (plan.subscription_type_label ? plan.subscription_type_label.toLowerCase() : getSubscriptionTypeLabel(plan.subscription_type).toLowerCase())
                  }
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  Validity: {plan.validity_days || getDefaultValidityDays(plan.subscription_type)} days
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 text-center">
                {plan.description && plan.text ? plan.text : (plan.description || plan.text || 'No description available')}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditPlan(plan.subscription_id)}
                  className="text-blue-600 hover:text-blue-900 p-2"
                  title="Edit Plan"
                  disabled={loading}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {!isSpecialPlan(plan) && (
                  <button
                    onClick={() => handleDeletePlan(plan.subscription_id)}
                    className="text-red-600 hover:text-red-900 p-2"
                    title="Delete Plan"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {isSpecialPlan(plan) && (
                  <button
                    className="text-gray-400 p-2 cursor-not-allowed"
                    title="Cannot delete plans with subscription_type = 0"
                    disabled
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {Array.isArray(plans) && plans.length === 0 && !loading && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription plans found</h3>
          <p className="text-gray-500">Create your first subscription plan to get started.</p>
        </div>
      )}


      {/* Edit Plan Modal */}
      {editPlan !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Plan</h2>
              <button
                onClick={() => setEditPlan(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const plan = Array.isArray(plans) ? plans.find(p => p.subscription_id == editPlan) : null;
              if (!plan) {
                return <div className="text-center py-4 text-red-500">Plan not found</div>;
              }

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Description</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={plan.description}
                      onChange={(e) => setPlans(plans.map(p =>
                        p.subscription_id === editPlan ? { ...p, description: e.target.value } : p
                      ))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Text</label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={plan.text}
                      onChange={(e) => setPlans(plans.map(p =>
                        p.subscription_id === editPlan ? { ...p, text: e.target.value } : p
                      ))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                    {isSpecialPlan(plan) ? (
                      <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
                        {plan.amount === 0 || plan.amount === '0' ? '0.00' : plan.amount}
                      </div>
                    ) : (
                    <input
                      type="number"
                      step="0.01"
                        min="0"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00 (Enter 0 for free plan)"
                        value={plan.amount === '' || plan.amount === null || plan.amount === undefined ? '' : plan.amount}
                      onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue === '') {
                            // Allow empty field so user can completely erase
                            setPlans(plans.map(p =>
                              p.subscription_id === editPlan ? { ...p, amount: '' } : p
                            ));
                          } else {
                            const numValue = parseFloat(inputValue);
                            if (!isNaN(numValue) && numValue >= 0) {
                        setPlans(plans.map(p =>
                                p.subscription_id === editPlan ? { ...p, amount: numValue } : p
                        ));
                            }
                          }
                      }}
                    />
                    )}
                    {isSpecialPlan(plan) && (
                      <p className="text-xs text-gray-500 mt-1">
                        Amount cannot be changed for special plans
                      </p>
                    )}
                  </div>

                  {!isSpecialPlan(plan) ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
                        <select
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={plan.subscription_type}
                          onChange={(e) => {
                            const newType = parseInt(e.target.value);
                            if (requiresCustomValidity(newType)) {
                              // For "Other" type, don't auto-set validity
                              setPlans(plans.map(p =>
                                p.subscription_id === editPlan ? {
                                  ...p,
                                  subscription_type: newType,
                                  validity_days: p.validity_days || ''
                                } : p
                              ));
                            } else {
                            const defaultValidity = getDefaultValidityDays(newType);
                            setPlans(plans.map(p =>
                              p.subscription_id === editPlan ? {
                                ...p,
                                subscription_type: newType,
                                validity_days: defaultValidity
                              } : p
                            ));
                            }
                          }}
                        >
                          {subscriptionTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label} {type.defaultValidity ? `(${type.defaultValidity} days)` : '(Custom)'}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {requiresCustomValidity(plan.subscription_type)
                            ? 'Please enter custom validity days below'
                            : `Validity will be automatically set to ${getDefaultValidityDays(plan.subscription_type)} days`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
                      <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
                        {getSpecialPlanLabel(plan.subscription_id)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Special plans cannot change subscription type
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validity Days
                      {requiresCustomValidity(plan.subscription_type) && <span className="text-red-500 ml-1">*</span>}
                      <span className="text-gray-500 text-sm ml-1">
                        {isSpecialPlan(plan) 
                          ? '(editable for special plans)' 
                          : requiresCustomValidity(plan.subscription_type)
                          ? '(required for Other type)'
                          : '(auto-assigned based on type)'}
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="36500"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={requiresCustomValidity(plan.subscription_type) 
                        ? 'Enter validity days (1-36500)' 
                        : `Default: ${getDefaultValidityDays(plan.subscription_type)} days`}
                      value={plan.validity_days !== null && plan.validity_days !== undefined ? plan.validity_days : ''}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Allow empty string during editing
                        const value = inputValue === '' ? '' : (parseInt(inputValue) || '');
                        setPlans(plans.map(p =>
                          p.subscription_id === editPlan ? {
                            ...p,
                            validity_days: value
                          } : p
                        ));
                      }}
                      onBlur={(e) => {
                        // Only apply default when field is empty and loses focus (for non-Other types)
                        const plan = plans.find(p => p.subscription_id === editPlan);
                        if (plan && e.target.value === '' && !requiresCustomValidity(plan.subscription_type)) {
                          const defaultValidity = getDefaultValidityDays(plan.subscription_type);
                          setPlans(plans.map(p =>
                            p.subscription_id === editPlan ? {
                              ...p,
                              validity_days: defaultValidity
                            } : p
                          ));
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Range: 1-36,500 days (1-100 years)
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleSave(editPlan)}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditPlan(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{modal.message}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  modal.onConfirm();
                  setModal({ open: false, message: "", onConfirm: null });
                }}
                className="flex-1 bg-red-600 text-white py-2 sm:py-3 rounded-lg hover:bg-red-700 text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={() => setModal({ open: false, message: "", onConfirm: null })}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Plans</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{Array.isArray(plans) ? plans.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Monthly Plans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Array.isArray(plans) ? plans.filter(p => p.subscription_type === 2).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Average Price</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{Array.isArray(plans) && plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.amount, 0) / plans.length) : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Validity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Array.isArray(plans) && plans.length > 0
                  ? Math.round(plans.reduce((sum, p) => sum + (p.validity_days || getDefaultValidityDays(p.subscription_type)), 0) / plans.length)
                  : 0} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;
