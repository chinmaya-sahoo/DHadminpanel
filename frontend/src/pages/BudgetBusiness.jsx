// File: src/pages/BudgetBusiness.jsx
import React, { useState, useEffect } from 'react';
import BudgetManager from './Budget';

const BudgetBusiness = () => {
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
        
        // Mock data for Business budgets
        const businessBudgets = [
          {
            id: 5,
            name: 'Marketing',
            amount: 2000,
            icon: '📈',
            totalSpend: 1250.75,
            totalItems: 8,
            createdAt: '2024-08-01',
            accountType: 'Business'
          },
          {
            id: 6,
            name: 'Office Supplies',
            amount: 500,
            icon: '📎',
            totalSpend: 320.25,
            totalItems: 15,
            createdAt: '2024-08-01',
            accountType: 'Business'
          },
          {
            id: 7,
            name: 'Travel & Expenses',
            amount: 1500,
            icon: '✈️',
            totalSpend: 980.50,
            totalItems: 6,
            createdAt: '2024-08-01',
            accountType: 'Business'
          },
          {
            id: 8,
            name: 'Equipment',
            amount: 5000,
            icon: '💻',
            totalSpend: 3200.00,
            totalItems: 3,
            createdAt: '2024-08-01',
            accountType: 'Business'
          }
        ];
        
        const businessExpenses = [
          {
            id: 7,
            name: 'Google Ads',
            amount: 500.00,
            budgetId: 5,
            createdAt: '2024-08-20',
            description: 'Q3 marketing campaign'
          },
          {
            id: 8,
            name: 'Printer Paper',
            amount: 45.25,
            budgetId: 6,
            createdAt: '2024-08-19',
            description: 'Office supplies restock'
          },
          {
            id: 9,
            name: 'Business Trip',
            amount: 750.50,
            budgetId: 7,
            createdAt: '2024-08-18',
            description: 'Client meeting in NYC'
          },
          {
            id: 10,
            name: 'New Laptops',
            amount: 2400.00,
            budgetId: 8,
            createdAt: '2024-08-17',
            description: '3 x MacBook Pro for team'
          },
          {
            id: 11,
            name: 'Facebook Ads',
            amount: 350.75,
            budgetId: 5,
            createdAt: '2024-08-16',
            description: 'Social media campaign'
          },
          {
            id: 12,
            name: 'Conference Tickets',
            amount: 1200.00,
            budgetId: 7,
            createdAt: '2024-08-15',
            description: 'Tech conference registration'
          }
        ];
        
        setBudgets(businessBudgets);
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
        <div className="text-lg">Loading business budget data...</div>
      </div>
    );
  }

  return (
    <BudgetManager 
      accountType="Business"
      initialBudgets={budgets}
      initialExpenses={expenses}
    />
  );
};

export default BudgetBusiness;