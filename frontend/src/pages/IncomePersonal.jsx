// File: src/pages/IncomePersonal.jsx
import React, { useState, useEffect } from 'react';
import IncomeManager from './Income';

const IncomePersonal = () => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // For now, we'll use mock data
        
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for Personal account
        const personalAccounts = [
          { id: 1, name: 'Personal', color: 'blue' },
          { id: 4, name: 'Savings', color: 'indigo' }
        ];
        
        const personalCategories = [
          { id: 1, name: 'Salary', color: 'blue', accountId: 1 },
          { id: 2, name: 'Freelance', color: 'green', accountId: 1 },
          { id: 7, name: 'Gifts', color: 'pink', accountId: 1 },
          { id: 8, name: 'Interest', color: 'yellow', accountId: 4 }
        ];
        
        const personalIncomes = [
          {
            id: 1,
            name: 'Monthly Salary',
            amount: 5000,
            totalSpend: 3200,
            totalItems: 12,
            accountId: 1,
            categoryId: 1,
            date: '2024-08-25',
            user: 'Joseph'
          },
          {
            id: 2,
            name: 'Website Project',
            amount: 2000,
            totalSpend: 1500,
            totalItems: 8,
            accountId: 1,
            categoryId: 2,
            date: '2024-08-24',
            user: 'Joseph'
          },
          {
            id: 6,
            name: 'Savings Interest',
            amount: 150,
            totalSpend: 0,
            totalItems: 0,
            accountId: 4,
            categoryId: 8,
            date: '2024-08-20',
            user: 'Joseph'
          }
        ];
        
        setAccounts(personalAccounts);
        setCategories(personalCategories);
        setIncomes(personalIncomes);
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
        <div className="text-lg">Loading personal income data...</div>
      </div>
    );
  }

  return (
    <IncomeManager 
      accountType="Personal"
      initialAccounts={accounts}
      initialCategories={categories}
      initialIncomes={incomes}
    />
  );
};

export default IncomePersonal;