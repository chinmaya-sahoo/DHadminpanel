// File: src/pages/hisab.jsx
import React, { useState } from "react";
import Income from "./Income";
import Expense from "./Expense";
import Budget from "./Budget";

export default function Hisab() {
  const [activeTab, setActiveTab] = useState("Expense");

  const renderContent = () => {
    switch (activeTab) {
      case "Income":
        return <Income />;
      case "Budget":
        return <Budget />;
      default:
        return <Expense />;
    }
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-300 p-1 rounded-full flex space-x-4">
          {["Expense", "Income", "Budget"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-6 py-1 md:py-2 rounded-full font-medium text-sm md:text-lg transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-gray-700 shadow"
                  : "text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-md p-4">{renderContent()}</div>
    </div>
  );
}
