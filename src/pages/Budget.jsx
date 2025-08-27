import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, ArrowLeft, Pen, Trash, Target, Calendar, PieChart, Filter } from 'lucide-react';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      name: 'Groceries',
      amount: 500,
      icon: '🛒',
      totalSpend: 320.50,
      totalItems: 8,
      createdAt: '2025-08-01',
      accountType: 'checking'
    },
    {
      id: 2,
      name: 'Transportation',
      amount: 300,
      icon: '🚗',
      totalSpend: 280.75,
      totalItems: 12,
      createdAt: '2025-08-01',
      accountType: 'checking'
    },
    {
      id: 3,
      name: 'Entertainment',
      amount: 200,
      icon: '🎬',
      totalSpend: 150.25,
      totalItems: 5,
      createdAt: '2025-08-01',
      accountType: 'savings'
    },
    {
      id: 4,
      name: 'Healthcare',
      amount: 400,
      icon: '🏥',
      totalSpend: 85.00,
      totalItems: 2,
      createdAt: '2025-08-01',
      accountType: 'credit'
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Weekly Groceries',
      amount: 85.50,
      budgetId: 1,
      createdAt: '2025-08-20',
      description: 'Walmart shopping'
    },
    {
      id: 2,
      name: 'Gas Fill Up',
      amount: 45.00,
      budgetId: 2,
      createdAt: '2025-08-19',
      description: 'Shell gas station'
    },
    {
      id: 3,
      name: 'Movie Tickets',
      amount: 25.00,
      budgetId: 3,
      createdAt: '2025-08-18',
      description: 'Avatar 3D tickets'
    },
    {
      id: 4,
      name: 'Coffee Shop',
      amount: 12.50,
      budgetId: 1,
      createdAt: '2025-08-17',
      description: 'Starbucks latte'
    },
    {
      id: 5,
      name: 'Uber Ride',
      amount: 18.75,
      budgetId: 2,
      createdAt: '2025-08-16',
      description: 'Airport pickup'
    },
    {
      id: 6,
      name: 'Doctor Visit',
      amount: 85.00,
      budgetId: 4,
      createdAt: '2025-08-15',
      description: 'Annual checkup'
    }
  ]);

  const [currentView, setCurrentView] = useState('overview'); // 'overview' or budgetId
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [accountFilter, setAccountFilter] = useState('all');
  
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: '',
    icon: '💰',
    accountType: 'checking'
  });

  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    description: ''
  });

  const accountTypes = [
    { value: 'checking', label: 'Checking Account', color: 'text-blue-600' },
    { value: 'savings', label: 'Savings Account', color: 'text-green-600' },
    { value: 'credit', label: 'Credit Card', color: 'text-purple-600' },
    { value: 'cash', label: 'Cash', color: 'text-yellow-600' }
  ];

  const emojis = [
    '💰', '🛒', '🚗', '🎬', '🏥', '🍔', '✈️', '🏠', '💡', '📱', 
    '🎯', '📚', '🎨', '🎵', '👕', '⚽', '🎮', '💊', '🔧', '📈'
  ];

  const calculateProgressPerc = (totalSpend, amount) => {
    const perc = (totalSpend / amount) * 100;
    return Math.min(100, perc);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBudgetExpenses = (budgetId) => {
    return expenses
      .filter(expense => expense.budgetId === budgetId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAccountTypeLabel = (type) => {
    const account = accountTypes.find(acc => acc.value === type);
    return account ? account.label : type;
  };

  const getAccountTypeColor = (type) => {
    const account = accountTypes.find(acc => acc.value === type);
    return account ? account.color : 'text-gray-600';
  };

  const filteredBudgets = accountFilter === 'all' 
    ? budgets 
    : budgets.filter(budget => budget.accountType === accountFilter);

  const handleCreateBudget = () => {
    if (newBudget.name && newBudget.amount) {
      const budget = {
        id: Date.now(),
        name: newBudget.name,
        amount: parseFloat(newBudget.amount),
        icon: newBudget.icon,
        totalSpend: 0,
        totalItems: 0,
        createdAt: new Date().toISOString().split('T')[0],
        accountType: newBudget.accountType
      };
      
      setBudgets([...budgets, budget]);
      setNewBudget({ name: '', amount: '', icon: '💰', accountType: 'checking' });
      setIsCreateBudgetOpen(false);
    }
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && selectedBudget) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        budgetId: selectedBudget.id,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      // Update expenses
      setExpenses([...expenses, expense]);
      
      // Update budget totals
      setBudgets(budgets.map(budget => 
        budget.id === selectedBudget.id 
          ? {
              ...budget,
              totalSpend: budget.totalSpend + expense.amount,
              totalItems: budget.totalItems + 1
            }
          : budget
      ));
      
      // Update selected budget for immediate UI update
      setSelectedBudget({
        ...selectedBudget,
        totalSpend: selectedBudget.totalSpend + expense.amount,
        totalItems: selectedBudget.totalItems + 1
      });
      
      setNewExpense({ name: '', amount: '', description: '' });
      setIsAddExpenseOpen(false);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (expense) {
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
      
      // Update budget totals
      setBudgets(budgets.map(budget => 
        budget.id === expense.budgetId 
          ? {
              ...budget,
              totalSpend: Math.max(0, budget.totalSpend - expense.amount),
              totalItems: Math.max(0, budget.totalItems - 1)
            }
          : budget
      ));
      
      // Update selected budget if viewing that budget
      if (selectedBudget && selectedBudget.id === expense.budgetId) {
        setSelectedBudget({
          ...selectedBudget,
          totalSpend: Math.max(0, selectedBudget.totalSpend - expense.amount),
          totalItems: Math.max(0, selectedBudget.totalItems - 1)
        });
      }
    }
  };

  const handleDeleteBudget = (budgetId) => {
    // Remove budget and all related expenses
    setBudgets(budgets.filter(budget => budget.id !== budgetId));
    setExpenses(expenses.filter(expense => expense.budgetId !== budgetId));
    
    // If currently viewing this budget, go back to overview
    if (selectedBudget && selectedBudget.id === budgetId) {
      setCurrentView('overview');
      setSelectedBudget(null);
    }
  };

  const viewBudgetDetails = (budget) => {
    setSelectedBudget(budget);
    setCurrentView(budget.id.toString());
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.totalSpend, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const CreateBudgetCard = () => (
    <div 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl border-2 border-dashed border-blue-300 cursor-pointer hover:shadow-lg transition-all duration-300 h-52 flex flex-col items-center justify-center group"
      onClick={() => setIsCreateBudgetOpen(true)}
    >
      <div className="text-4xl text-blue-500 mb-3 group-hover:scale-110 transition-transform">
        <Plus size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1 text-center">Create New Budget</h3>
      <p className="text-sm text-gray-500 text-center">Set limits for categories</p>
    </div>
  );

  const BudgetCard = ({ budget }) => {
    const percentage = calculateProgressPerc(budget.totalSpend, budget.amount);
    const remaining = budget.amount - budget.totalSpend;
    
    return (
      <div 
        className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-300 sm:h-52 hover:border-blue-300 group"
        onClick={() => viewBudgetDetails(budget)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
          <div className="flex sm:flex-row flex-col items-center gap-3 mx-auto sm:mx-0">
            <div className="text-2xl p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
              {budget.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 sm:text-lg text-sm">{budget.name}</h3>
              <p className="text-sm text-gray-500">{budget.totalItems} expenses</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBudget(budget.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
          >
            <Trash size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center sm:flex-row flex-col">
            <span className="text-2xl font-bold text-gray-800">${budget.amount}</span>
            <span className={`text-sm font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left' : 'over'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Spent: ${budget.totalSpend.toFixed(2)}</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2 sm:flex-row flex-col">
            <span className={`text-xs text-center font-medium px-2 py-1 rounded-full ${getAccountTypeColor(budget.accountType)} bg-opacity-20`}>
              {getAccountTypeLabel(budget.accountType)}
            </span>
            <p className="text-xs text-gray-500">
              {new Date(budget.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ExpenseItem = ({ expense }) => (
    <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{expense.name}</h4>
          <p className="text-sm text-gray-500">{expense.description}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-red-600">-${expense.amount.toFixed(2)}</span>
          <p className="text-xs text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => handleDeleteExpense(expense.id)}
          className="text-red-500 hover:text-red-700 p-1 transition-colors"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {currentView === 'overview' ? (
        // Budget Overview
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Budgets</h1>
            <p className="text-gray-600">Manage your spending categories and track expenses</p>
            
            {/* Account Filter */}
            <div className="flex items-start sm:items-center gap-3 mt-4 mb-6 flex-col sm:flex-row">
              <div className='flex gap-4'>
              <Filter size={20} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by account:</span>
              </div>
              <select 
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Accounts</option>
                {accountTypes.map(account => (
                  <option key={account.value} value={account.value}>
                    {account.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3">
                  <Target className="text-blue-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Total Budgeted</p>
                    <p className="text-2xl font-bold text-gray-900">${totalBudgeted.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-red-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3">
                  <TrendingUp className={totalRemaining >= 0 ? "text-green-500" : "text-red-500"} size={24} />
                  <div>
                    <p className="text-sm text-gray-500">
                      {totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
                    </p>
                    <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(totalRemaining).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3">
                  <PieChart className="text-purple-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Active Budgets</p>
                    <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateBudgetCard />
            {filteredBudgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>
        </>
      ) : (
        // Budget Detail View
        selectedBudget && (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('overview');
                      setSelectedBudget(null);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <span className="text-2xl">{selectedBudget.icon}</span>
                  {selectedBudget.name} Budget
                </h1>
                
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Expense
                </button>
              </div>

              {/* Budget Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Amount:</span>
                      <span className="font-bold text-xl">${selectedBudget.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-bold text-xl text-red-600">${selectedBudget.totalSpend.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className={`font-bold text-xl ${
                        selectedBudget.amount - selectedBudget.totalSpend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(selectedBudget.amount - selectedBudget.totalSpend).toFixed(2)}
                        {selectedBudget.amount - selectedBudget.totalSpend < 0 && ' over'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account:</span>
                      <span className={`font-medium ${getAccountTypeColor(selectedBudget.accountType)}`}>
                        {getAccountTypeLabel(selectedBudget.accountType)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${
                        calculateProgressPerc(selectedBudget.totalSpend, selectedBudget.amount) >= 90 
                          ? 'text-red-600' 
                          : calculateProgressPerc(selectedBudget.totalSpend, selectedBudget.amount) >= 70 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                      }`}>
                        {calculateProgressPerc(selectedBudget.totalSpend, selectedBudget.amount).toFixed(1)}%
                      </div>
                      <p className="text-gray-500">of budget used</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${
                          getProgressColor(calculateProgressPerc(selectedBudget.totalSpend, selectedBudget.amount))
                        }`}
                        style={{ width: `${calculateProgressPerc(selectedBudget.totalSpend, selectedBudget.amount)}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      {selectedBudget.totalItems} expenses recorded
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Recent Expenses</h3>
              </div>
              <div className="p-6">
                {getBudgetExpenses(selectedBudget.id).length > 0 ? (
                  <div className="grid gap-4">
                    {getBudgetExpenses(selectedBudget.id).map((expense) => (
                      <ExpenseItem key={expense.id} expense={expense} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">💸</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No expenses yet</h3>
                    <p className="text-gray-500 mb-4">Start tracking your spending by adding your first expense</p>
                    <button
                      onClick={() => setIsAddExpenseOpen(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add First Expense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      )}

      {/* Create Budget Modal */}
      {isCreateBudgetOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Budget</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="relative">
                  <button
                    className="text-2xl p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  >
                    {newBudget.icon}
                  </button>
                  
                  {isEmojiPickerOpen && (
                    <div className="absolute top-full left-0 mt-2 p-3 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-5 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => {
                              setNewBudget({ ...newBudget, icon: emoji });
                              setIsEmojiPickerOpen(false);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Groceries, Entertainment, Travel"
                  value={newBudget.name}
                  onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newBudget.accountType}
                  onChange={(e) => setNewBudget({ ...newBudget, accountType: e.target.value })}
                >
                  {accountTypes.map(account => (
                    <option key={account.value} value={account.value}>
                      {account.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsCreateBudgetOpen(false);
                  setIsEmojiPickerOpen(false);
                  setNewBudget({ name: '', amount: '', icon: '💰', accountType: 'checking' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!newBudget.name || !newBudget.amount}
                onClick={handleCreateBudget}
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Add Expense to {selectedBudget.icon} {selectedBudget.name}
            </h2>
            
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
                  placeholder="25.50"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional details about this expense"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsAddExpenseOpen(false);
                  setNewExpense({ name: '', amount: '', description: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!newExpense.name || !newExpense.amount}
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;