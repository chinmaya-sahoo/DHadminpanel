import React, { useState } from 'react';
import { ArrowLeft, Pen, Trash, Plus, DollarSign, TrendingDown, Calendar, Filter } from 'lucide-react';

const ExpenseManager = () => {
  // Sample data
  const [budgets] = useState([
    {
      id: 1,
      name: 'Groceries',
      amount: 500,
      icon: '🛒',
      totalSpend: 320,
      totalItem: 8
    },
    {
      id: 2,
      name: 'Transportation',
      amount: 300,
      icon: '🚗',
      totalSpend: 280,
      totalItem: 12
    },
    {
      id: 3,
      name: 'Entertainment',
      amount: 200,
      icon: '🎬',
      totalSpend: 150,
      totalItem: 5
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Weekly Groceries',
      amount: 85.50,
      budgetId: 1,
      budgetName: 'Groceries',
      createdAt: '2025-08-20',
      category: 'Food'
    },
    {
      id: 2,
      name: 'Gas Fill Up',
      amount: 45.00,
      budgetId: 2,
      budgetName: 'Transportation',
      createdAt: '2025-08-19',
      category: 'Transport'
    },
    {
      id: 3,
      name: 'Movie Tickets',
      amount: 25.00,
      budgetId: 3,
      budgetName: 'Entertainment',
      createdAt: '2025-08-18',
      category: 'Entertainment'
    },
    {
      id: 4,
      name: 'Coffee Shop',
      amount: 12.50,
      budgetId: 1,
      budgetName: 'Groceries',
      createdAt: '2025-08-17',
      category: 'Food'
    },
    {
      id: 5,
      name: 'Uber Ride',
      amount: 18.75,
      budgetId: 2,
      budgetName: 'Transportation',
      createdAt: '2025-08-16',
      category: 'Transport'
    }
  ]);

  const [currentView, setCurrentView] = useState('all'); // 'all' or budgetId
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    budgetId: ''
  });

  const [editBudget, setEditBudget] = useState({
    name: '',
    amount: ''
  });

  // Get filtered expenses based on current view
  const getFilteredExpenses = () => {
    let filtered = expenses;
    
    if (currentView !== 'all') {
      filtered = filtered.filter(expense => expense.budgetId === parseInt(currentView));
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const calculateProgressPerc = (totalSpend, amount) => {
    const perc = (totalSpend / amount) * 100;
    return Math.min(100, perc);
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.budgetId) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        budgetId: parseInt(newExpense.budgetId),
        budgetName: budgets.find(b => b.id === parseInt(newExpense.budgetId))?.name || '',
        createdAt: new Date().toISOString().split('T')[0],
        category: budgets.find(b => b.id === parseInt(newExpense.budgetId))?.name || 'Other'
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({ name: '', amount: '', budgetId: '' });
      setIsAddExpenseOpen(false);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const handleEditBudget = () => {
    if (editBudget.name && editBudget.amount && selectedBudget) {
      // In a real app, this would update the budget
      setIsEditBudgetOpen(false);
      setEditBudget({ name: '', amount: '' });
    }
  };

  const handleDeleteBudget = () => {
    // In a real app, this would delete the budget and related expenses
    setIsDeleteDialogOpen(false);
    setCurrentView('all');
    setSelectedBudget(null);
  };

  const BudgetItem = ({ budget, isDetailed = false }) => (
    <div className="p-6 border-2 border-gray-200 rounded-xl bg-white hover:shadow-lg transition-all duration-300">
      <div className="flex gap-3 items-center justify-between mb-4">
        <div className="flex gap-3 items-center">
          <div className="text-2xl p-3 bg-gray-100 rounded-full">
            {budget.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{budget.name}</h3>
            <p className="text-sm text-gray-500">{budget.totalItem} expenses</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-blue-600 text-lg">${budget.amount}</h3>
          <p className="text-sm text-gray-500">Budget</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent: ${budget.totalSpend}</span>
          <span className="text-gray-600">
            Remaining: ${budget.amount - budget.totalSpend}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              calculateProgressPerc(budget.totalSpend, budget.amount) > 90 
                ? 'bg-red-500' 
                : calculateProgressPerc(budget.totalSpend, budget.amount) > 70 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${calculateProgressPerc(budget.totalSpend, budget.amount)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 text-center">
          {calculateProgressPerc(budget.totalSpend, budget.amount).toFixed(1)}% used
        </p>
      </div>
    </div>
  );

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
              {currentView === 'all' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{expense.name}</div>
                  <div className="text-sm text-gray-500">{expense.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-red-600">
                    -${expense.amount.toFixed(2)}
                  </span>
                </td>
                {currentView === 'all' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.budgetName}
                    </span>
                  </td>
                )}
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
            ))}
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

  const categories = ['all', 'Food', 'Transport', 'Entertainment', 'Other'];
  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {currentView !== 'all' && (
              <button
                onClick={() => {
                  setCurrentView('all');
                  setSelectedBudget(null);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            {currentView === 'all' ? 'All Expenses' : `${selectedBudget?.name} Expenses`}
          </h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Expense
            </button>
            
            {currentView !== 'all' && (
              <>
                <button
                  onClick={() => {
                    setEditBudget({
                      name: selectedBudget?.name || '',
                      amount: selectedBudget?.amount?.toString() || ''
                    });
                    setIsEditBudgetOpen(true);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <Pen size={16} />
                  Edit Budget
                </button>
                
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash size={16} />
                  Delete Budget
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Filter className="text-purple-500" size={24} />
              <div>
                <p className="text-sm text-gray-500 mb-2">Filter by Category</p>
                <select
                  className="text-sm border rounded px-2 py-1"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Navigation */}
        {currentView === 'all' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {budgets.map(budget => (
              <button
                key={budget.id}
                onClick={() => {
                  setCurrentView(budget.id.toString());
                  setSelectedBudget(budget);
                }}
                className="bg-white px-4 py-2 rounded-lg border hover:shadow-md transition-all flex items-center gap-2"
              >
                <span>{budget.icon}</span>
                <span>{budget.name}</span>
                <span className="text-sm text-gray-500">
                  (${budget.totalSpend}/${budget.amount})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Budget Item for detailed view */}
      {currentView !== 'all' && selectedBudget && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BudgetItem budget={selectedBudget} isDetailed={true} />
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Budget Amount:</span>
                <span className="font-semibold">${selectedBudget.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent:</span>
                <span className="font-semibold text-red-600">${selectedBudget.totalSpend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-semibold text-green-600">
                  ${selectedBudget.amount - selectedBudget.totalSpend}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Expenses:</span>
                <span className="font-semibold">{selectedBudget.totalItem}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  Budget Category
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newExpense.budgetId}
                  onChange={(e) => setNewExpense({ ...newExpense, budgetId: e.target.value })}
                >
                  <option value="">Select a budget</option>
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>
                      {budget.icon} {budget.name}
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
                  setNewExpense({ name: '', amount: '', budgetId: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!newExpense.name || !newExpense.amount || !newExpense.budgetId}
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {isEditBudgetOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Budget</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editBudget.name}
                  onChange={(e) => setEditBudget({ ...editBudget, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Amount
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editBudget.amount}
                  onChange={(e) => setEditBudget({ ...editBudget, amount: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setIsEditBudgetOpen(false);
                  setEditBudget({ name: '', amount: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleEditBudget}
              >
                Update Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2 text-red-600">Delete Budget</h2>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure? This action cannot be undone. This will permanently 
              delete your budget along with all expenses and remove the data from our servers.
            </p>
            
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDeleteBudget}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;