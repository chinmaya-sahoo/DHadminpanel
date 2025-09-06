// File: src/pages/BudgetPersonal.jsx
import React, { useState, useEffect } from 'react';
import BudgetManager from './Budget';

const BudgetPersonal = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for Personal budgets
        const personalBudgets = [
          {
            id: 1,
            name: 'Groceries',
            amount: 500,
            icon: '🛒',
            totalSpend: 320.50,
            totalItems: 8,
            createdAt: '2024-08-01',
            accountType: 'Personal'
          },
          {
            id: 2,
            name: 'Transportation',
            amount: 300,
            icon: '🚗',
            totalSpend: 280.75,
            totalItems: 12,
            createdAt: '2024-08-01',
            accountType: 'Personal'
          },
          {
            id: 3,
            name: 'Entertainment',
            amount: 200,
            icon: '🎬',
            totalSpend: 150.25,
            totalItems: 5,
            createdAt: '2024-08-01',
            accountType: 'Personal'
          },
          {
            id: 4,
            name: 'Healthcare',
            amount: 400,
            icon: '🏥',
            totalSpend: 85.00,
            totalItems: 2,
            createdAt: '2024-08-01',
            accountType: 'Personal'
          }
        ];
        
        const personalExpenses = [
          {
            id: 1,
            name: 'Weekly Groceries',
            amount: 85.50,
            budgetId: 1,
            createdAt: '2024-08-20',
            description: 'Walmart shopping'
          },
          {
            id: 2,
            name: 'Gas Fill Up',
            amount: 45.00,
            budgetId: 2,
            createdAt: '2024-08-19',
            description: 'Shell gas station'
          },
          {
            id: 3,
            name: 'Movie Tickets',
            amount: 25.00,
            budgetId: 3,
            createdAt: '2024-08-18',
            description: 'Avatar 3D tickets'
          },
          {
            id: 4,
            name: 'Coffee Shop',
            amount: 12.50,
            budgetId: 1,
            createdAt: '2024-08-17',
            description: 'Starbucks latte'
          },
          {
            id: 5,
            name: 'Uber Ride',
            amount: 18.75,
            budgetId: 2,
            createdAt: '2024-08-16',
            description: 'Airport pickup'
          },
          {
            id: 6,
            name: 'Doctor Visit',
            amount: 85.00,
            budgetId: 4,
            createdAt: '2024-08-15',
            description: 'Annual checkup'
          }
        ];
        
        setBudgets(personalBudgets);
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
        <div className="text-lg">Loading personal budget data...</div>
      </div>
    );
  }

  return (
    <BudgetManager 
      accountType="Personal"
      initialBudgets={budgets}
      initialExpenses={expenses}
    />
  );
};

export default BudgetPersonal;