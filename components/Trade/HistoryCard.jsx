"use client";

import { AmountWithCommas } from "@/lib/utils";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export default function HistoryCard({ order }) {
  // Helper function to render a single metric item
  const renderMetricItem = (label, value, icon, valueColorClass = "") => (
    <div
      key={label}
      className="bg-slate-700 py-1 px-4 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-center">
        {React.cloneElement(icon, { size: 16 })}
        <span className="ml-2 text-slate-300 font-medium text-xs">{label}</span>
      </div>
      <span className={`text-lg font-bold truncate ${valueColorClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="flex justify-center p-2 sm:p-4 max-h-screen max-w-2xl mx-auto">
      <div className="bg-slate-900 text-white rounded-xl shadow-lg p-4 w-full">
        {/* Main Value Display */}
        <div className="text-center my-8">
          <div
            className={`text-5xl font-extrabold ${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            {order?.profit}
          </div>
          <div
            className={`text-2xl font-bold ${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            USDT+
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {renderMetricItem(
            "HIGH",
            AmountWithCommas(order?.high),
            <TrendingUp className="text-green-500" />,
            "text-green-400" // Specific color for HIGH
          )}
          {renderMetricItem(
            "LOW",
            AmountWithCommas(order?.low),
            <TrendingDown className="text-red-500" />,
            "text-red-400" // Specific color for LOW
          )}
          {renderMetricItem(
            "VOLUME",
            AmountWithCommas(order?.volume),
            <BarChart2 className="text-cyan-400" />,
            "text-cyan-300" // Specific color for VOLUME
          )}
          {renderMetricItem(
            "CHANGE",
            AmountWithCommas(order?.change),
            <TrendingUp className="text-purple-500" />,
            "text-purple-300" // Specific color for CHANGE
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            AmountWithCommas(order?.amount),
            <DollarSign className="text-yellow-500" />,
            "text-yellow-300" // Specific color for PURCHASE VOLUME
          )}
          {renderMetricItem(
            "PROFIT",
            AmountWithCommas(order?.profit),
            <DollarSign className="text-emerald-500" />,
            `${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`
          )}
          {renderMetricItem(
            "STATUS",
            order?.result_display?.status,
            <Clock className="text-gray-400" />,
            `${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`
          )}
        </div>
      </div>
    </div>
  );
}
