// File: src/pages/IncomeBusiness.jsx
import React, { useState, useEffect } from 'react';
import IncomeManager from './Income';

const IncomeBusiness = () => {
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
        
        // Mock data for Business account
        const businessAccounts = [
          { id: 2, name: 'Business', color: 'green' },
          { id: 5, name: 'Business Savings', color: 'purple' }
        ];
        
        const businessCategories = [
          { id: 3, name: 'Business Revenue', color: 'indigo', accountId: 2 },
          { id: 4, name: 'Consulting', color: 'purple', accountId: 2 },
          { id: 9, name: 'Product Sales', color: 'green', accountId: 2 },
          { id: 10, name: 'Investment Returns', color: 'blue', accountId: 5 }
        ];
        
        const businessIncomes = [
          {
            id: 4,
            name: 'App Development',
            amount: 3500,
            totalSpend: 2100,
            totalItems: 15,
            accountId: 2,
            categoryId: 3,
            date: '2024-08-22',
            user: 'Joseph'
          },
          {
            id: 5,
            name: 'Strategy Consulting',
            amount: 1200,
            totalSpend: 800,
            totalItems: 5,
            accountId: 2,
            categoryId: 4,
            date: '2024-08-21',
            user: 'Joseph'
          },
          {
            id: 7,
            name: 'Product Sales - Q3',
            amount: 8500,
            totalSpend: 4200,
            totalItems: 25,
            accountId: 2,
            categoryId: 9,
            date: '2024-08-19',
            user: 'Joseph'
          }
        ];
        
        setAccounts(businessAccounts);
        setCategories(businessCategories);
        setIncomes(businessIncomes);
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
        <div className="text-lg">Loading business income data...</div>
      </div>
    );
  }

  return (
    <IncomeManager 
      accountType="Business"
      initialAccounts={accounts}
      initialCategories={categories}
      initialIncomes={incomes}
    />
  );
};

export default IncomeBusiness;