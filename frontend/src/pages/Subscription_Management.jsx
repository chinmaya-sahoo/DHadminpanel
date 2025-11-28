import React, { useState } from "react";
import {
  CreditCard, Users, Calendar, Gift, UserPlus, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";

// Import all subscription components
import PaymentsList from '../components/Subscription/PaymentsList';
import SubscriptionHistory from '../components/Subscription/SubscriptionHistory';
import ActiveSubscriptions from '../components/Subscription/ActiveSubscriptions';
import ReferEarnManagement from '../components/Subscription/ReferEarnManagement';
import ManualUpgrade from '../components/Subscription/ManualUpgrade';
import RenewalPayments from '../components/Subscription/RenewalPayments';
import PlanManagement from '../components/Subscription/PlanManagement';

// Main Subscription Management Component with Navigation
export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "Plan Management", icon: <CreditCard size={16} />, component: <PlanManagement /> },
    { name: "All Payments", icon: <CreditCard size={16} />, component: <PaymentsList /> },
    { name: "User History", icon: <Users size={16} />, component: <SubscriptionHistory /> },
    { name: "Active Plans", icon: <Calendar size={16} />, component: <ActiveSubscriptions /> },
    { name: "Refer & Earn", icon: <Gift size={16} />, component: <ReferEarnManagement /> },
    { name: "Manual Upgrade", icon: <UserPlus size={16} />, component: <ManualUpgrade /> },
    { name: "Auto-Renewals", icon: <RefreshCw size={16} />, component: <RenewalPayments /> },
  ];

  const nextTab = () => {
    setActiveTab((prev) => (prev + 1) % tabs.length);
  };

  const prevTab = () => {
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage plans, payments, and user subscriptions</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === index
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span className="hidden sm:inline">{tab.icon}</span>
                  <span className="sm:hidden text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden text-xs">
                    {tab.name.length > 12 ? tab.name.substring(0, 12) + '...' : tab.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <button
                onClick={prevTab}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous Tab"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextTab}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next Tab"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        {tabs[activeTab]?.component}
      </div>
    </div>
  );
}