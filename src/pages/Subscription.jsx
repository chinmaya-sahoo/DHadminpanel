// File: src/pages/Subscription.jsx
import React from "react";
import { Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "20$",
    period: "/month",
    features: ["10 users included", "2GB of storage", "Email support", "Help center access"],
    buttonStyle: "border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
  },
  {
    name: "Pro",
    price: "30$",
    period: "/month",
    features: [
      "20 users included",
      "5GB of storage",
      "Email support",
      "Help center access",
      "Phone support",
      "Community access",
    ],
    buttonStyle: "bg-indigo-600 text-white hover:bg-indigo-700",
  },
];

export default function Subscription() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="flex items-center gap-2 mb-10">
        <Crown className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900">Premium Plans</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-8 rounded-2xl shadow-md border ${
              plan.name === "Pro" ? "border-indigo-500" : "border-gray-200"
            } bg-white`}
          >
            <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
            <p className="mt-4 text-4xl font-bold text-gray-900">
              {plan.price}
              <span className="text-lg font-normal text-gray-500">{plan.period}</span>
            </p>

            <ul className="mt-6 space-y-3 text-gray-600">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> {feature}
                </li>
              ))}
            </ul>

            <button
              className={`mt-8 w-full py-3 rounded-xl font-medium transition ${plan.buttonStyle}`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
