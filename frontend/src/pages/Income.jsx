// File: src/components/IncomeManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, Filter, Trash2, Tag, CreditCard, X } from 'lucide-react';

const IncomeManager = ({ 
  accountType = null, 
  initialAccounts = [], 
  initialCategories = [], 
  initialIncomes = [] 
}) => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [categories, setCategories] = useState(initialCategories);
  const [incomes, setIncomes] = useState(initialIncomes);

  // Dialog states
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  // Form states
  const [newIncome, setNewIncome] = useState({
    name: '',
    amount: '',
    accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '',
    categoryId: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: 'blue',
    accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : ''
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    color: 'blue'
  });

  // Filter states - preset with accountType if provided
  const [filters, setFilters] = useState({
    accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '',
    categoryId: ''
  });

  // Update states when props change
  useEffect(() => {
    setAccounts(initialAccounts);
  }, [initialAccounts]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setIncomes(initialIncomes);
  }, [initialIncomes]);

  // Helper functions
  const getAccountById = (id) => accounts.find(acc => acc.id === id);
  const getCategoryById = (id) => categories.find(cat => cat.id === id);

  const getFilteredIncomes = () => {
    return incomes.filter(income => {
      // Filter by account type if provided
      if (accountType) {
        const account = accounts.find(acc => acc.id === income.accountId);
        if (account?.name !== accountType) return false;
      }
      
      // Filter by account if selected
      if (filters.accountId && income.accountId !== parseInt(filters.accountId)) {
        return false;
      }
      
      // Filter by category if selected
      if (filters.categoryId && income.categoryId !== parseInt(filters.categoryId)) {
        return false;
      }
      
      return true;
    });
  };

  // CRUD operations
  const handleCreateIncome = () => {
    if (newIncome.name && newIncome.amount && newIncome.accountId && newIncome.categoryId) {
      const income = {
        id: Date.now(),
        name: newIncome.name,
        amount: parseFloat(newIncome.amount),
        totalSpend: 0,
        totalItems: 0,
        accountId: parseInt(newIncome.accountId),
        categoryId: parseInt(newIncome.categoryId),
        date: new Date().toISOString().split('T')[0]
      };
      
      setIncomes([...incomes, income]);
      setNewIncome({ 
        name: '', 
        amount: '', 
        accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '', 
        categoryId: '' 
      });
      setIsIncomeDialogOpen(false);
    }
  };

  const handleCreateCategory = () => {
    if (newCategory.name && newCategory.accountId) {
      const category = {
        id: Date.now(),
        name: newCategory.name,
        color: newCategory.color,
        accountId: parseInt(newCategory.accountId)
      };
      
      setCategories([...categories, category]);
      setNewCategory({ 
        name: '', 
        color: 'blue', 
        accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '' 
      });
      setIsCategoryDialogOpen(false);
    }
  };

  const handleCreateAccount = () => {
    if (newAccount.name) {
      const account = {
        id: Date.now(),
        name: newAccount.name,
        color: newAccount.color
      };
      
      setAccounts([...accounts, account]);
      setNewAccount({ name: '', color: 'blue' });
      setIsAccountDialogOpen(false);
    }
  };

  const handleDeleteAccount = (accountId) => {
    const categoriesUsingAccount = categories.filter(cat => cat.accountId === accountId);
    if (categoriesUsingAccount.length > 0) {
      alert(`Cannot delete account as it has ${categoriesUsingAccount.length} categories. Delete the categories first.`);
      return;
    }
    
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    setIncomes(incomes.filter(income => income.accountId !== accountId));
  };

  const handleDeleteCategory = (categoryId) => {
    const incomesUsingCategory = incomes.filter(income => income.categoryId === categoryId);
    if (incomesUsingCategory.length > 0) {
      alert(`Cannot delete category as it has ${incomesUsingCategory.length} incomes. Delete the incomes first.`);
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const calculateProgressPerc = (totalSpend, amount) => {
    const perc = (totalSpend / amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(1);
  };

  const getColorClass = (color, type = 'bg') => {
    const colorMap = {
      blue: type === 'bg' ? 'bg-blue-500' : 'text-blue-500',
      green: type === 'bg' ? 'bg-green-500' : 'text-green-500',
      purple: type === 'bg' ? 'bg-purple-500' : 'text-purple-500',
      indigo: type === 'bg' ? 'bg-indigo-500' : 'text-indigo-500',
      pink: type === 'bg' ? 'bg-pink-500' : 'text-pink-500',
      yellow: type === 'bg' ? 'bg-yellow-500' : 'text-yellow-500'
    };
    return colorMap[color] || colorMap.blue;
  };

  const clearFilters = () => {
    setFilters({
      accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '',
      categoryId: ''
    });
  };

  const IncomeItem = ({ income }) => {
    const account = getAccountById(income.accountId);
    const category = getCategoryById(income.categoryId);
    
    return (
      <div className="p-6 border-2 border-gray-200 rounded-xl hover:shadow-lg cursor-pointer sm:h-48 bg-white transition-all duration-300 hover:border-blue-300">
        <div className="flex flex-col sm:flex-row gap-3 items-center sm:justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">{income.name}</h3>
            <p className="text-sm text-gray-500">added by-{income.user || "Josheph"} </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${getColorClass(account?.color)}`}></span>
              <span className="text-xs text-gray-500">{account?.name}</span>
            </div>
          </div>
          <div className="text-right flex gap-4 md:flex-col">
            <h3 className="font-bold text-green-600 text-lg">${income.amount.toLocaleString()}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${getColorClass(category?.color)} text-white text-center`}>
              {category?.name}
            </span>
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
  };

  const CreateIncomeCard = () => (
    <div 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl border-2 border-dashed border-blue-300 cursor-pointer hover:shadow-lg transition-all duration-300 h-48 flex flex-col items-center justify-center group"
      onClick={() => setIsIncomeDialogOpen(true)}
    >
      <div className="text-4xl text-blue-500 mb-2 group-hover:scale-110 transition-transform">
        <Plus size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 text-center">Create New Income</h3>
      <p className="text-sm text-gray-500 mt-1">Add income</p>
    </div>
  );

  const filteredIncomes = getFilteredIncomes();
  
  // Filter accounts and categories based on accountType if provided
  const filteredAccounts = accountType 
    ? accounts.filter(acc => acc.name === accountType)
    : accounts;
    
  const filteredCategories = accountType 
    ? categories.filter(cat => {
        const account = accounts.find(acc => acc.id === cat.accountId);
        return account?.name === accountType;
      })
    : categories;

  // Get categories for the filter dropdown based on selected account
  const getCategoriesForFilter = () => {
    if (!filters.accountId) return categories;
    return categories.filter(cat => cat.accountId === parseInt(filters.accountId));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {accountType ? `${accountType} Income Manager` : 'Income Manager'}
            </h1>
            <p className="text-gray-600">Manage accounts, categories, and income streams</p>
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            {!accountType && (
              <button
                onClick={() => setIsAccountDialogOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <CreditCard size={16} />
                New Account
              </button>
            )}
            <button
              onClick={() => setIsCategoryDialogOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Tag size={16} />
              New Category
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${filteredIncomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Active Incomes</p>
                <p className="text-2xl font-bold text-gray-900">{filteredIncomes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <CreditCard className="text-purple-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{filteredAccounts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Filter className="text-gray-500" size={20} />
            <div className="flex gap-4 flex-1 flex-col md:flex-row">
              {!accountType && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Account</label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.accountId}
                    onChange={(e) => setFilters({ ...filters, accountId: e.target.value, categoryId: '' })}
                  >
                    <option value="">All Accounts</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                  disabled={!filters.accountId && !accountType}
                >
                  <option value="">All Categories</option>
                  {getCategoriesForFilter().map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold mt-6 flex items-center gap-2"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Active filters display */}
          {(filters.accountId || filters.categoryId) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.accountId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Account: {getAccountById(parseInt(filters.accountId))?.name}
                  <button 
                    onClick={() => setFilters({ ...filters, accountId: '', categoryId: '' })}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {filters.categoryId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {getCategoryById(parseInt(filters.categoryId))?.name}
                  <button 
                    onClick={() => setFilters({ ...filters, categoryId: '' })}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Accounts Management - Only show if not filtered by accountType */}
        {!accountType && (
          <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
            <h3 className="text-lg font-semibold mb-4">Your Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {accounts.map(account => {
                const categoriesCount = categories.filter(cat => cat.accountId === account.id).length;
                return (
                  <div key={account.id} className="p-4 border rounded-lg flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-3 h-3 rounded-full ${getColorClass(account.color)}`}></span>
                      <div>
                        <p className="font-medium text-sm md:text-lg">{account.name}</p>
                        <p className="text-sm text-gray-500">{categoriesCount} categories</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
          <h3 className="text-lg font-semibold mb-4">
            {accountType ? `${accountType} Categories` : 'Your Categories'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCategories.map(category => {
              const account = getAccountById(category.accountId);
              const incomesCount = incomes.filter(income => income.categoryId === category.id).length;
              return (
                <div key={category.id} className="p-4 border rounded-lg flex justify-between items-center gap-4 flex-col sm:flex-row">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block w-3 h-3 rounded-full ${getColorClass(category.color)}`}></span>
                    <div>
                      <p className="font-medium text-sm md:text-lg">{category.name}</p>
                      <p className="text-sm text-gray-500">{account?.name} • {incomesCount} incomes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Income Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateIncomeCard />
        {filteredIncomes.map((income) => (
          <IncomeItem key={income.id} income={income} />
        ))}
      </div>

      {/* Create Income Dialog */}
      {isIncomeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Income</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Monthly Salary, Project Payment"
                  value={newIncome.name}
                  onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. 5000"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                />
              </div>

              {!accountType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newIncome.accountId}
                    onChange={(e) => setNewIncome({ ...newIncome, accountId: e.target.value, categoryId: '' })}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newIncome.categoryId}
                  onChange={(e) => setNewIncome({ ...newIncome, categoryId: e.target.value })}
                  disabled={!newIncome.accountId && !accountType}
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter(cat => !newIncome.accountId || cat.accountId === parseInt(newIncome.accountId))
                    .map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setIsIncomeDialogOpen(false);
                  setNewIncome({ 
                    name: '', 
                    amount: '', 
                    accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '', 
                    categoryId: '' 
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newIncome.name || !newIncome.amount || !newIncome.accountId || !newIncome.categoryId}
                onClick={handleCreateIncome}
              >
                Create Income
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Dialog - Only show if not filtered by accountType */}
      {isAccountDialogOpen && !accountType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Personal, Business, Investment"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newAccount.color}
                  onChange={(e) => setNewAccount({ ...newAccount, color: e.target.value })}
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="indigo">Indigo</option>
                  <option value="pink">Pink</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setIsAccountDialogOpen(false);
                  setNewAccount({ name: '', color: 'blue' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newAccount.name}
                onClick={handleCreateAccount}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Dialog */}
      {isCategoryDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Category</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Salary, Freelance, Dividends"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              
              {!accountType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newCategory.accountId}
                    onChange={(e) => setNewCategory({ ...newCategory, accountId: e.target.value })}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="indigo">Indigo</option>
                  <option value="pink">Pink</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setIsCategoryDialogOpen(false);
                  setNewCategory({ 
                    name: '', 
                    color: 'blue', 
                    accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '' 
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newCategory.name || !newCategory.accountId}
                onClick={handleCreateCategory}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeManager;