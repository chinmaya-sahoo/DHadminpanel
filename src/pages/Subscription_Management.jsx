// File: src/pages/Subscription_Management.jsx
import React, { useState } from "react";
import { Pencil, Save, PlusCircle, Trash2 } from "lucide-react";

const allFeatures = [
  "Basic Access",
  "Storage Access",
  "Datbase Access",
  "Customer Activity Access",
  "Reports Access",
  "Download Data as CSV",
];

const initialPlans = [
  { id: 1, name: "Referral", cost: 0, validity: 0, features: ["Basic Access"] },
  { id: 2, name: "Freemium", cost: 0, validity: 7, features: ["Basic Access", "Storage Access"] },
  { id: 3, name: "Starter", cost: 199, validity: 30, features: ["Basic Access", "Storage Access", "Reports Access"] },
  { id: 4, name: "Premium", cost: 499, validity: 90, features: ["Basic Access", "Storage Access", "Datbase Access", "Customer Activity Access", "Reports Access"] },
];

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState(initialPlans);
  const [editPlan, setEditPlan] = useState(null);

  const handleSave = () => {
    setEditPlan(null);
  };

  const handleFeatureAdd = (planId, feature) => {
    setPlans(plans.map(p =>
      p.id === planId
        ? { ...p, features: [...new Set([...p.features, feature])] }
        : p
    ));
  };

  const handleFeatureRemove = (planId, feature) => {
    setPlans(plans.map(p =>
      p.id === planId
        ? { ...p, features: p.features.filter(f => f !== feature) }
        : p
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💳 Subscription Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded-lg shadow bg-white">
            {editPlan === plan.id ? (
              <>
                {/* Editable Fields */}
                <input
                  type="text"
                  value={plan.name}
                  disabled
                  className="w-full p-2 border rounded mb-2 font-bold text-lg bg-gray-100"
                />
                <input
                  type="number"
                  value={plan.cost}
                  onChange={e =>
                    setPlans(plans.map(p => (p.id === plan.id ? { ...p, cost: e.target.value } : p)))
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Cost"
                />
                <input
                  type="number"
                  value={plan.validity}
                  onChange={e =>
                    setPlans(plans.map(p => (p.id === plan.id ? { ...p, validity: e.target.value } : p)))
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Validity (days)"
                />

                {/* Features Section */}
                <div className="mb-2">
                  <h2 className="font-semibold mb-1">Features:</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {plan.features.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                      >
                        {f}
                        <button
                          onClick={() => handleFeatureRemove(plan.id, f)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Feature Dropdown */}
                  <select
                    onChange={e => handleFeatureAdd(plan.id, e.target.value)}
                    className="p-2 border rounded w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      ➕ Add Feature
                    </option>
                    {allFeatures
                      .filter(f => !plan.features.includes(f))
                      .map((f, idx) => (
                        <option key={idx} value={f}>
                          {f}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={handleSave}
                  className="mt-3 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  <Save size={16} /> Save
                </button>
              </>
            ) : (
              <>
                {/* Display Mode */}
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-600">💰 Cost: <span className="font-semibold">₹{plan.cost}</span></p>
                <p className="text-gray-600">📅 Validity: <span className="font-semibold">{plan.validity} days</span></p>

                <div className="mt-2">
                  <h3 className="font-semibold">Features:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setEditPlan(plan.id)}
                  className="mt-3 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <Pencil size={16} /> Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
