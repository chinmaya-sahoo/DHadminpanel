// File: admin/src/pages/Udhari.jsx
import React, { useState } from "react";
import {
  PlusCircle,
  User,
  Calendar,
  IndianRupee,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
} from "lucide-react";

const Udhari = () => {
  const [udhariList, setUdhariList] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    type: "receivable",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.amount || !formData.dueDate) return;
    setUdhariList([...udhariList, { ...formData, id: Date.now() }]);
    setFormData({ customer: "", amount: "", type: "receivable", dueDate: "" });
  };

  const handleDelete = (id) => {
    setUdhariList(udhariList.filter((u) => u.id !== id));
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-blue-600" size={22} />
        <h2 className="text-xl font-semibold">Udhari Management</h2>
      </div>

      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-md border"
      >
        <div className="flex items-center border rounded-xl px-3 py-2">
          <User className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            name="customer"
            placeholder="Customer Name"
            value={formData.customer}
            onChange={handleChange}
            className="flex-1 outline-none"
          />
        </div>

        <div className="flex items-center border rounded-xl px-3 py-2">
          <IndianRupee className="text-gray-500 mr-2" size={18} />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="flex-1 outline-none"
          />
        </div>

        <div className="flex items-center border rounded-xl px-3 py-2">
          <Calendar className="text-gray-500 mr-2" size={18} />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="flex-1 outline-none"
          />
        </div>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded-xl px-3 py-2"
        >
          <option value="receivable">Receivable</option>
          <option value="payable">Payable</option>
        </select>

        <button
          type="submit"
          className="col-span-1 md:col-span-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> Add Udhari
        </button>
      </form>

      {/* Udhari List */}
      <div className="mt-6 bg-white p-4 rounded-2xl shadow-md border">
        <h3 className="text-lg font-semibold mb-3">All Udhars</h3>
        {udhariList.length === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          <ul className="space-y-3">
            {udhariList.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center border p-3 rounded-xl"
              >
                {/* Left Side */}
                <div>
                  <p className="font-medium">{u.customer}</p>
                  <p className="text-sm text-gray-500">Due: {u.dueDate}</p>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  {u.type === "receivable" ? (
                    <ArrowDownCircle className="text-green-600" size={20} />
                  ) : (
                    <ArrowUpCircle className="text-red-600" size={20} />
                  )}
                  <span
                    className={`font-semibold ${
                      u.type === "receivable" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{u.amount} ({u.type})
                  </span>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Udhari;
