// File: src/components/ExpenseManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingDown, Filter, Trash2, Tag, CreditCard, X, Calendar } from 'lucide-react';

const ExpenseManager = ({ 
  accountType = null, 
  initialAccounts = [], 
  initialCategories = [], 
  initialExpenses = [] 
}) => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [categories, setCategories] = useState(initialCategories);
  const [expenses, setExpenses] = useState(initialExpenses);

  // Dialog states
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  // Form states
  const [newExpense, setNewExpense] = useState({
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
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  // Helper functions
  const getAccountById = (id) => accounts.find(acc => acc.id === id);
  const getCategoryById = (id) => categories.find(cat => cat.id === id);

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      // Filter by account type if provided
      if (accountType) {
        const account = accounts.find(acc => acc.id === expense.accountId);
        if (account?.name !== accountType) return false;
      }
      
      // Filter by account if selected
      if (filters.accountId && expense.accountId !== parseInt(filters.accountId)) {
        return false;
      }
      
      // Filter by category if selected
      if (filters.categoryId && expense.categoryId !== parseInt(filters.categoryId)) {
        return false;
      }
      
      return true;
    });
  };

  // CRUD operations
  const handleCreateExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.accountId && newExpense.categoryId) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        accountId: parseInt(newExpense.accountId),
        categoryId: parseInt(newExpense.categoryId),
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({ 
        name: '', 
        amount: '', 
        accountId: accountType ? accounts.find(acc => acc.name === accountType)?.id || '' : '', 
        categoryId: '' 
      });
      setIsExpenseDialogOpen(false);
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

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const handleDeleteAccount = (accountId) => {
    const expensesUsingAccount = expenses.filter(expense => expense.accountId === accountId);
    if (expensesUsingAccount.length > 0) {
      alert(`Cannot delete account as it has ${expensesUsingAccount.length} expenses. Delete the expenses first.`);
      return;
    }
    
    setAccounts(accounts.filter(acc => acc.id !== accountId));
  };

  const handleDeleteCategory = (categoryId) => {
    const expensesUsingCategory = expenses.filter(expense => expense.categoryId === categoryId);
    if (expensesUsingCategory.length > 0) {
      alert(`Cannot delete category as it has ${expensesUsingCategory.length} expenses. Delete the expenses first.`);
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== categoryId));
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

  const ExpenseTable = ({ expenses }) => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Expense History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => {
              const account = getAccountById(expense.accountId);
              const category = getCategoryById(expense.categoryId);
              return (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{expense.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-red-600">
                      -${expense.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(category?.color, 'bg')} text-white`}>
                      {category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${getColorClass(account?.color)}`}></span>
                      <span className="text-sm text-gray-900">{account?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {expenses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No expenses found
          </div>
        )}
      </div>
    </div>
  );

  const filteredExpenses = getFilteredExpenses();
  
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

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = filteredExpenses
    .filter(exp => new Date(exp.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {accountType ? `${accountType} Expense Manager` : 'Expense Manager'}
            </h1>
            <p className="text-gray-600">Manage accounts, categories, and expenses</p>
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
            <button
              onClick={() => setIsExpenseDialogOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <DollarSign className="text-red-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-blue-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${thisMonthExpenses.toFixed(2)}
                </p>
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
                const expensesCount = expenses.filter(expense => expense.accountId === account.id).length;
                return (
                  <div key={account.id} className="p-4 border rounded-lg flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-3 h-3 rounded-full ${getColorClass(account.color)}`}></span>
                      <div>
                        <p className="font-medium text-sm md:text-lg">{account.name}</p>
                        <p className="text-sm text-gray-500">{expensesCount} expenses</p>
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
              const expensesCount = expenses.filter(expense => expense.categoryId === category.id).length;
              return (
                <div key={category.id} className="p-4 border rounded-lg flex justify-between items-center gap-4 flex-col sm:flex-row">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block w-3 h-3 rounded-full ${getColorClass(category.color)}`}></span>
                    <div>
                      <p className="font-medium text-sm md:text-lg">{category.name}</p>
                      <p className="text-sm text-gray-500">{account?.name} • {expensesCount} expenses</p>
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

      {/* Expense Table */}
      <ExpenseTable expenses={filteredExpenses} />

      {/* Add Expense Dialog */}
      {isExpenseDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expense Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Coffee, Gas, Groceries"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>

              {!accountType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newExpense.accountId}
                    onChange={(e) => setNewExpense({ ...newExpense, accountId: e.target.value, categoryId: '' })}
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
                  value={newExpense.categoryId}
                  onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                  disabled={!newExpense.accountId && !accountType}
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter(cat => !newExpense.accountId || cat.accountId === parseInt(newExpense.accountId))
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
                  setIsExpenseDialogOpen(false);
                  setNewExpense({ 
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newExpense.name || !newExpense.amount || !newExpense.accountId || !newExpense.categoryId}
                onClick={handleCreateExpense}
              >
                Add Expense
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
                  placeholder="e.g. Food, Transport, Entertainment"
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

export default ExpenseManager;