// File: admin/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    bestSellers: 0,
    mostLoved: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all products
      const allProducts = await apiService.getProducts();
      const featured = await apiService.getProductsBySection('featured');
      const bestSellers = await apiService.getProductsBySection('bestsellers');
      const mostLoved = await apiService.getProductsBySection('mostloved');
      const orders = await apiService.getOrders();

      setStats({
        totalProducts: allProducts.data.length,
        featuredProducts: featured.data.length,
        bestSellers: bestSellers.data.length,
        mostLoved: mostLoved.data.length,
        totalOrders: orders.data.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, linkTo }) => (
    <Link 
      to={linkTo}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </Link>
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts}
          linkTo="/admin/products"
        />
        <StatCard 
          title="Featured Products" 
          value={stats.featuredProducts}
          linkTo="/admin/products?section=featured"
        />
        <StatCard 
          title="Best Sellers" 
          value={stats.bestSellers}
          linkTo="/admin/products?section=bestsellers"
        />
        <StatCard 
          title="Most Loved" 
          value={stats.mostLoved}
          linkTo="/admin/products?section=mostloved"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders}
          linkTo="/admin/orders"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/products/new" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Product
          </Link>
          <Link to="/admin/categories" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

