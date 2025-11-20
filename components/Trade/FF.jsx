"use client";

import { AmountWithCommas } from "@/lib/utils";
import TradeStore from "@/store/TradeStore";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function FF({ data }) {
  const { openOrders } = TradeStore();
  const order = data || openOrders[0];
  const isNegative = Number(order?.change) < 0;

  // Helper function to render a single metric item
  const renderMetricItem = (label, value, icon, valueColorClass = "", labelColor = "") => (
    <div
      key={label}
      className="bg-slate-700 py-1 px-4 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-center">
        {React.cloneElement(icon, { size: 16 })}
        <span className={twMerge("ml-2 text-slate-300 font-medium text-xs", labelColor)}>
          {label}
        </span>
      </div>
      <span className={`text-lg font-bold truncate ${valueColorClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="flex justify-center p-2 sm:p-4 max-h-screen">
      <div className="bg-slate-900 text-white rounded-xl shadow-lg p-4 w-full">
        {/* Main Value Display */}
        <div className="text-center my-8">
          <div
            className={`text-5xl font-extrabold ${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            {AmountWithCommas(
              order?.result_display?.status === "win"
                ? order?.profit
                : order?.amount
            )}
          </div>
          <div
            className={`text-2xl font-bold ${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            USDT{order?.result_display?.status === "win" ? "+" : "-"}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {renderMetricItem(
            "Action",
            order?.title,
            <DollarSign className="text-blue-500" />,
            order?.trade_type === "buy" ? "text-green-500" : "text-red-500"
          )}
          {renderMetricItem(
            "HIGH",
            AmountWithCommas(order?.high),
            <TrendingUp className={isNegative ? "text-red-500" : "text-green-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "LOW",
            AmountWithCommas(order?.low),
            <TrendingDown className={isNegative ? "text-red-500" : "text-green-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "VOLUME",
            AmountWithCommas(order?.volume),
            <BarChart2 className={isNegative ? "text-red-500" : "text-cyan-400"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "CHANGE",
            AmountWithCommas(order?.change),
            <TrendingUp className={isNegative ? "text-red-500" : "text-purple-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            AmountWithCommas(order?.amount),
            <DollarSign className="text-yellow-500" />,
            "text-yellow-300"
          )}
          {renderMetricItem(
            `${order?.result_display?.status === "win" ? "PROFIT" : "LOSS"}`,
            AmountWithCommas(
              order?.result_display?.status === "win"
                ? order?.profit
                : order?.amount
            ),
            <DollarSign className="text-emerald-500" />,
            `${
              order?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`, // The color for the label
            `${order?.result_display?.status === "win" ? "" : "text-red-500 font-semibold"}`
          )}
          {renderMetricItem(
            "STATUS",
            order?.result,
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
