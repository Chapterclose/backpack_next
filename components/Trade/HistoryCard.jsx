"use client";

import { AmountWithCommas } from "@/lib/utils";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export default function HistoryCard({ order }) {
  const isNegative = Number(order?.change) < 0; // ✅ check if change is minus

  // Helper function to render a single metric item
  const renderMetricItem = (label, value, icon = null, valueColorClass = "") => (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center">
        {icon && React.cloneElement(icon, { size: 16 })} {/* Render icon if provided */}
        <span className={`text-gray-400 text-sm font-medium ${icon ? "ml-2" : ""}`}>{label}</span>
      </div>
      <span className={`text-right text-sm font-semibold ${valueColorClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="flex justify-center p-2 sm:p-4 max-h-screen max-w-2xl mx-auto">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 w-full">
        {/* Metrics Display */}
        <div className="space-y-1 mb-6">
          {renderMetricItem(
            "Action",
            order?.title,
            <DollarSign className="text-blue-500" />,
            "text-blue-400"
          )}
          {renderMetricItem(
            "HIGH",
            AmountWithCommas(order?.high),
            <TrendingUp className="text-green-500" />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "LOW",
            AmountWithCommas(order?.low),
            <TrendingDown className="text-red-500" />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "VOLUME",
            AmountWithCommas(order?.volume),
            <BarChart2 className="text-cyan-400" />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "CHANGE",
            AmountWithCommas(order?.change),
            <TrendingUp className="text-purple-400" />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            AmountWithCommas(order?.amount),
            <DollarSign className="text-yellow-400" />,
            "text-yellow-300"
          )}
          {renderMetricItem(
            `${order?.result_display?.status === "win" ? "WIN":"LOSS"}`,
            AmountWithCommas(order?.result_display?.status === "win" ? order?.profit : order?.amount),
            <DollarSign className="text-emerald-500" />,
            `${
              order?.result_display?.status === "win" ? "text-green-400" : "text-red-500"
            } capitalize`
          )}
          {renderMetricItem(
            "STATUS",
            order?.result_display?.status,
            <Clock className="text-gray-400" />,
            `${
              order?.result_display?.status === "win" ? "text-green-400" : "text-red-500"
            } capitalize`
          )}
        </div>
      </div>
    </div>
  );
}
