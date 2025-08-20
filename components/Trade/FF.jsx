"use client";

import TradeStore from "@/store/TradeStore";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export default function FF() {
  const { tradingData } = TradeStore();

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
    <div className="flex justify-center p-2 sm:p-4 max-h-screen">
      <div className="bg-slate-800 text-white rounded-xl shadow-lg p-4 w-full border border-slate-700">
        {/* Main Value Display */}
        <div className="text-center my-8">
          <div className="text-5xl font-extrabold text-green-500">{tradingData?.profit}</div>
          <div className="text-2xl font-bold text-green-500">USDT+</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {renderMetricItem(
            "HIGH",
            tradingData?.high,
            <TrendingUp className="text-green-500" />,
            "text-green-400" // Specific color for HIGH
          )}
          {renderMetricItem(
            "LOW",
            tradingData?.low,
            <TrendingDown className="text-red-500" />,
            "text-red-400" // Specific color for LOW
          )}
          {renderMetricItem(
            "VOLUME",
            tradingData?.volume,
            <BarChart2 className="text-cyan-400" />,
            "text-cyan-300" // Specific color for VOLUME
          )}
          {renderMetricItem(
            "CHANGE",
            tradingData?.change,
            <TrendingUp className="text-purple-500" />,
            "text-purple-300" // Specific color for CHANGE
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            tradingData?.amount,
            <DollarSign className="text-yellow-500" />,
            "text-yellow-300" // Specific color for PURCHASE VOLUME
          )}
          {renderMetricItem(
            "PROFIT",
            tradingData?.profit,
            <DollarSign className="text-emerald-500" />,
            `${
              tradingData?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`
          )}
          {renderMetricItem(
            "STATUS",
            tradingData?.result_display?.status,
            <Clock className="text-gray-400" />,
            `${
              tradingData?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`
          )}
        </div>
      </div>
    </div>
  );
}
