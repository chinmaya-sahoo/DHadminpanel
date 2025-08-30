// File: admin/src/pages/Transaction.jsx
import React, { useEffect, useState } from "react";
import { Search, Grid, List, Loader2, AlertCircle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import apiService from "../services/api";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTransactions(); // <-- Make sure this API exists
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter by search
  const filteredTransactions = transactions.filter(
    (t) =>
      t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TransactionCard = ({ transaction }) => {
    const isIncome = transaction.type === "income";

    return (
      <div
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isIncome ? (
              <ArrowUpCircle className="text-green-600 w-6 h-6" />
            ) : (
              <ArrowDownCircle className="text-red-600 w-6 h-6" />
            )}
            <h3 className="font-semibold text-gray-900 text-sm">
              {transaction.category || "General"}
            </h3>
          </div>
          <span
            className={`font-bold ${
              isIncome ? "text-green-600" : "text-red-600"
            }`}
          >
            {isIncome ? "+" : "-"}₹{transaction.amount?.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          {transaction.date
            ? new Date(transaction.date).toLocaleDateString()
            : "Unknown date"}
        </p>
        {transaction.note && (
          <p className="text-sm text-gray-700">{transaction.note}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center p-4 mb-6 text-red-800 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Transactions Grid/List */}
      {!loading && (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredTransactions.map((t) => (
            <TransactionCard key={t._id} transaction={t} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Start by adding some transactions."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Transaction;
