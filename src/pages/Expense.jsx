import React, { useState } from 'react';
import { ArrowLeft, Plus, DollarSign, TrendingDown, Calendar, Filter, CreditCard, Trash } from 'lucide-react';

const ExpenseManager = () => {
  // Sample accounts data
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Personal', color: 'blue' },
    { id: 2, name: 'Business', color: 'green' },
    { id: 3, name: 'Investment', color: 'purple' },
    { id: 4, name: 'Savings', color: 'indigo' }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Weekly Groceries',
      amount: 85.50,
      accountId: 1,
      createdAt: '2025-08-20',
      category: 'Food'
    },
    {
      id: 2,
      name: 'Gas Fill Up',
      amount: 45.00,
      accountId: 1,
      createdAt: '2025-08-19',
      category: 'Transport'
    },
    {
      id: 3,
      name: 'Movie Tickets',
      amount: 25.00,
      accountId: 1,
      createdAt: '2025-08-18',
      category: 'Entertainment'
    },
    {
      id: 4,
      name: 'Coffee Shop',
      amount: 12.50,
      accountId: 1,
      createdAt: '2025-08-17',
      category: 'Food'
    },
    {
      id: 5,
      name: 'Office Equipment',
      amount: 89.99,
      accountId: 2,
      createdAt: '2025-08-16',
      category: 'Business'
    }
  ]);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    accountId: '',
    category: 'all'
  });
  
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    accountId: '',
    category: ''
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    color: 'blue'
  });

  // Helper functions
  const getAccountById = (id) => accounts.find(acc => acc.id === id);

  const getFilteredExpenses = () => {
    let filtered = expenses;
    
    if (filters.accountId) {
      filtered = filtered.filter(expense => expense.accountId === parseInt(filters.accountId));
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  // CRUD operations
  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.accountId && newExpense.category) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        accountId: parseInt(newExpense.accountId),
        createdAt: new Date().toISOString().split('T')[0],
        category: newExpense.category
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({ name: '', amount: '', accountId: '', category: '' });
      setIsAddExpenseOpen(false);
    }
  };

  const handleAddAccount = () => {
    if (newAccount.name) {
      const account = {
        id: Date.now(),
        name: newAccount.name,
        color: newAccount.color
      };
      
      setAccounts([...accounts, account]);
      setNewAccount({ name: '', color: 'blue' });
      setIsAddAccountOpen(false);
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category}
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
                      <Trash size={16} />
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

  const categories = ['Food', 'Transport', 'Entertainment', 'Business', 'Other'];
  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Manager</h1>
            <p className="text-gray-600">Manage accounts and expenses</p>
          </div>
          
          <div className="flex gap-2 flex-col md:flex-row">
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <CreditCard size={16} />
              New Account
            </button>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  ${filteredExpenses
                    .filter(exp => new Date(exp.createdAt).getMonth() === new Date().getMonth())
                    .reduce((sum, exp) => sum + exp.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Filter className="text-gray-500" size={20} />
            <div className="flex gap-4 flex-1 flex-wrap ">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Account</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.accountId}
                  onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
                >
                  <option value="">All Accounts</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setFilters({ accountId: '', category: 'all' })}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-6"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {accounts.map(account => {
              const expensesCount = expenses.filter(expense => expense.accountId === account.id).length;
              return (
                <div key={account.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block w-3 h-3 rounded-full ${getColorClass(account.color)}`}></span>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-gray-500">{expensesCount} expenses</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <ExpenseTable expenses={filteredExpenses} />

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Coffee, Gas, Groceries"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newExpense.accountId}
                  onChange={(e) => setNewExpense({ ...newExpense, accountId: e.target.value })}
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setIsAddExpenseOpen(false);
                  setNewExpense({ name: '', amount: '', accountId: '', category: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={!newExpense.name || !newExpense.amount || !newExpense.accountId || !newExpense.category}
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddAccountOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Personal, Business, Investment"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
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
                  setIsAddAccountOpen(false);
                  setNewAccount({ name: '', color: 'blue' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!newAccount.name}
                onClick={handleAddAccount}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;