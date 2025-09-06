// File: src/pages/ExpenseBusiness.jsx
import React, { useState, useEffect } from 'react';
import ExpenseManager from './Expense';

const ExpenseBusiness = () => {
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
        
        // Mock data for Business account
        const businessAccounts = [
          { id: 2, name: 'Business', color: 'green' },
          { id: 5, name: 'Business Savings', color: 'purple' }
        ];
        
        const businessCategories = [
          { id: 6, name: 'Office Supplies', color: 'blue', accountId: 2 },
          { id: 7, name: 'Travel', color: 'green', accountId: 2 },
          { id: 8, name: 'Marketing', color: 'purple', accountId: 2 },
          { id: 9, name: 'Equipment', color: 'indigo', accountId: 2 },
          { id: 10, name: 'Investments', color: 'yellow', accountId: 5 }
        ];
        
        const businessExpenses = [
          {
            id: 6,
            name: 'Office Equipment',
            amount: 350.00,
            accountId: 2,
            categoryId: 6,
            createdAt: '2024-08-22'
          },
          {
            id: 7,
            name: 'Business Trip',
            amount: 1200.00,
            accountId: 2,
            categoryId: 7,
            createdAt: '2024-08-21'
          },
          {
            id: 8,
            name: 'Facebook Ads',
            amount: 250.00,
            accountId: 2,
            categoryId: 8,
            createdAt: '2024-08-20'
          },
          {
            id: 9,
            name: 'New Laptop',
            amount: 1200.00,
            accountId: 2,
            categoryId: 9,
            createdAt: '2024-08-19'
          },
          {
            id: 10,
            name: 'Stock Investment',
            amount: 5000.00,
            accountId: 5,
            categoryId: 10,
            createdAt: '2024-08-18'
          }
        ];
        
        setAccounts(businessAccounts);
        setCategories(businessCategories);
        setExpenses(businessExpenses);
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
        <div className="text-lg">Loading business expense data...</div>
      </div>
    );
  }

  return (
    <ExpenseManager 
      accountType="Business"
      initialAccounts={accounts}
      initialCategories={categories}
      initialExpenses={expenses}
    />
  );
};

export default ExpenseBusiness;