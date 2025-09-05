// File: src/pages/hisab.jsx
import React, { useState } from "react";
import IncomePersonal from "./IncomePersonal";
import IncomeBusiness from "./IncomeBusiness"; // You'll need to create this
import ExpensePersonal from "./ExpensePersonal"; // You'll need to create this
import ExpenseBusiness from "./ExpenseBusiness"; // You'll need to create this
import BudgetPersonal from "./BudgetPersonal"; // You'll need to create this
import BudgetBusiness from "./BudgetBusiness"; // You'll need to create this

export default function Hisab() {
  const [activeTab, setActiveTab] = useState("Income");
  const [account, setAccount] = useState("Personal");

  const renderContent = () => {
    switch (account) {
      case "Personal":
        switch (activeTab) {
          case "Income":
            return <IncomePersonal />;
          case "Budget":
            return <BudgetPersonal />;
          default:
            return <ExpensePersonal />;
        }
      case "Business":
        switch (activeTab) {
          case "Income":
            return <IncomeBusiness />;
          case "Budget":
            return <BudgetBusiness />;
          default:
            return <ExpenseBusiness />;
        }
      default:
        return <ExpensePersonal />;
    }
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-300 p-1 rounded-full flex space-x-4">
          {["Income","Expense", "Budget"].map((tab) => (
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

      {/* Account Selection */}
      <div className="flex justify-center mb-6">
        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="px-3 py-1 rounded-full bg-gray-300 text-gray-700 font-medium text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="Personal">Personal</option>
          <option value="Business">Business</option>
        </select>
      </div>


      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-md p-4">{renderContent()}</div>
    </div>
  );
}