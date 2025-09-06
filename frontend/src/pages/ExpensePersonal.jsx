// File: src/pages/ExpensePersonal.jsx
import React, { useState, useEffect } from 'react';
import ExpenseManager from './Expense';

const ExpensePersonal = () => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for Personal account
        const personalAccounts = [
          { id: 1, name: 'Personal', color: 'blue' },
          { id: 4, name: 'Savings', color: 'indigo' }
        ];
        
        const personalCategories = [
          { id: 1, name: 'Food', color: 'blue', accountId: 1 },
          { id: 2, name: 'Transport', color: 'green', accountId: 1 },
          { id: 3, name: 'Entertainment', color: 'purple', accountId: 1 },
          { id: 4, name: 'Utilities', color: 'pink', accountId: 1 },
          { id: 5, name: 'Savings', color: 'yellow', accountId: 4 }
        ];
        
        const personalExpenses = [
          {
            id: 1,
            name: 'Weekly Groceries',
            amount: 85.50,
            accountId: 1,
            categoryId: 1,
            createdAt: '2024-08-20'
          },
          {
            id: 2,
            name: 'Gas Fill Up',
            amount: 45.00,
            accountId: 1,
            categoryId: 2,
            createdAt: '2024-08-19'
          },
          {
            id: 3,
            name: 'Movie Tickets',
            amount: 25.00,
            accountId: 1,
            categoryId: 3,
            createdAt: '2024-08-18'
          },
          {
            id: 4,
            name: 'Coffee Shop',
            amount: 12.50,
            accountId: 1,
            categoryId: 1,
            createdAt: '2024-08-17'
          },
          {
            id: 5,
            name: 'Electricity Bill',
            amount: 89.99,
            accountId: 1,
            categoryId: 4,
            createdAt: '2024-08-16'
          }
        ];
        
        setAccounts(personalAccounts);
        setCategories(personalCategories);
        setExpenses(personalExpenses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading personal expense data...</div>
      </div>
    );
  }

  return (
    <ExpenseManager 
      accountType="Personal"
      initialAccounts={accounts}
      initialCategories={categories}
      initialExpenses={expenses}
    />
  );
};

export default ExpensePersonal;