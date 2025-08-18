"use client";

import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

// Main component for the trading UI
export default function FF() {
  // Hardcoded data for demonstration. In a real app, this would come from an API.
  const metrics = [
    { label: "HIGH", value: "178,484", icon: <TrendingUp className="text-green-500" /> },
    { label: "LOW", value: "47,474", icon: <TrendingDown className="text-red-500" /> },
    { label: "VOLUME", value: "584,848", icon: <BarChart2 className="text-cyan-400" /> },
    { label: "CHANGE", value: "47,474", icon: <TrendingUp className="text-purple-500" /> },
    {
      label: "PURCHASE VOLUME",
      value: "100 USDT",
      icon: <DollarSign className="text-yellow-500" />,
    },
    { label: "PROFIT", value: "10 USDT", icon: <DollarSign className="text-emerald-500" /> },
    { label: "STATUS", value: "Win / loss", icon: <Clock className="text-gray-400" /> },
  ];

  return (
    <div className="flex justify-center p-2 sm:p-4 max-h-screen">
      <div className="bg-slate-800 text-white rounded-xl shadow-lg p-4 w-full border border-slate-700">
        {/* Main Value Display */}
        <div className="text-center my-8">
          <div className="text-5xl font-extrabold text-green-500">10.00</div>
          <div className="text-2xl font-bold text-green-500">USDT+</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-slate-700 py-1 px-4 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center">
                {React.cloneElement(metric.icon, { size: 16 })}
                <span className="ml-2 text-slate-300 font-medium text-xs">{metric.label}</span>
              </div>
              <span className="text-lg font-bold truncate">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
