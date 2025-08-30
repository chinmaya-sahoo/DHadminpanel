import React, { useState, useEffect } from 'react';
import { Package, Users, Tag, DollarSign, TrendingUp, ShoppingCart, Star, Eye } from 'lucide-react';
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    revenue: 0,
    sellers: 0,
    featured: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes, featuredRes, sellersRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getOrders(),
        apiService.getCategories(),
        apiService.getFeaturedProducts(),
        apiService.getSellers()
      ]);

      // Extract data from responses, handling both array and object formats
      const products = Array.isArray(productsRes.data) ? productsRes.data : 
                      productsRes.data.products || [];
      const orders = ordersRes.data.orders || [];
      const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : 
                        categoriesRes.data.categories || [];
      const featured = Array.isArray(featuredRes.data) ? featuredRes.data :
                      featuredRes.data.products || [];
      const sellers = sellersRes.data.sellers || [];

      // Calculate totals
      const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

      setStats({
        products: products.length,
        orders: orders.length,
        categories: categories.length,
        revenue: totalRevenue,
        sellers: sellers.length,
        featured: featured.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        products: 0,
        orders: 0,
        categories: 0,
        revenue: 0,
        sellers: 0,
        featured: 0
      });
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: <Tag className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Featured Products',
      value: stats.featured,
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Total Sellers',
      value: stats.sellers,
      icon: <Users className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
               
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
          </div>
        ))}
      </div>

    

     
    </div>
  );
};

export default Dashboard; 