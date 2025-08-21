// File: admin/src/pages/income.jsx
import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp } from 'lucide-react';

const IncomeManager = () => {
  const [incomes, setIncomes] = useState([
    {
      id: 1,
      name: 'Salary',
      amount: 5000,
      totalSpend: 3200,
      totalItems: 12
    },
    {
      id: 2,
      name: 'Freelance',
      amount: 2000,
      totalSpend: 1500,
      totalItems: 8
    },
    {
      id: 3,
      name: 'Investments',
      amount: 800,
      totalSpend: 0,
      totalItems: 0
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({
    name: '',
    amount: ''
  });

  const handleCreateIncome = () => {
    if (newIncome.name && newIncome.amount) {
      const income = {
        id: Date.now(),
        name: newIncome.name,
        amount: parseFloat(newIncome.amount),
        totalSpend: 0,
        totalItems: 0
      };
      
      setIncomes([...incomes, income]);
      setNewIncome({ name: '', amount: '' });
      setIsDialogOpen(false);
    }
  };

  const calculateProgressPerc = (totalSpend, amount) => {
    const perc = (totalSpend / amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(1);
  };

  const IncomeItem = ({ income }) => (
    <div className="p-6 border-2 border-gray-200 rounded-xl hover:shadow-lg cursor-pointer h-44 bg-white transition-all duration-300 hover:border-blue-300">
      <div className="flex gap-3 items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800">{income.name}</h3>
          <p className="text-sm text-gray-500">{income.totalItems} transactions</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-green-600 text-lg">${income.amount.toLocaleString()}</h3>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Spent: ${income.totalSpend.toLocaleString()}</span>
          <span className="text-gray-600">{calculateProgressPerc(income.totalSpend, income.amount)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${calculateProgressPerc(income.totalSpend, income.amount)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const CreateIncomeCard = () => (
    <div 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl border-2 border-dashed border-blue-300 cursor-pointer hover:shadow-lg transition-all duration-300 h-44 flex flex-col items-center justify-center group"
      onClick={() => setIsDialogOpen(true)}
    >
      <div className="text-4xl text-blue-500 mb-2 group-hover:scale-110 transition-transform">
        <Plus size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">Create New Income Source</h3>
      <p className="text-sm text-gray-500 mt-1">Track your revenue streams</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Sources</h1>
        <p className="text-gray-600">Manage and track your income streams</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${incomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Active Sources</p>
                <p className="text-2xl font-bold text-gray-900">{incomes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <DollarSign className="text-red-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${incomes.reduce((sum, income) => sum + income.totalSpend, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateIncomeCard />
        {incomes.map((income) => (
          <IncomeItem key={income.id} income={income} />
        ))}
      </div>

      {/* Dialog Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Income Source</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. YouTube, Freelance, Salary"
                  value={newIncome.name}
                  onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Amount
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. 5000"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewIncome({ name: '', amount: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newIncome.name || !newIncome.amount}
                onClick={handleCreateIncome}
              >
                Create Income Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeManager;
