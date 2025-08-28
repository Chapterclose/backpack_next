"use client";

import { AmountWithCommas } from "@/lib/utils";
import TradeStore from "@/store/TradeStore";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function FF() {
  const {  openOrders } = TradeStore();
  console.log(openOrders);
  const isNegative = Number(openOrders[0]?.change) < 0;

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
              openOrders[0]?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            {AmountWithCommas(
              openOrders[0]?.result_display?.status === "win"
                ? openOrders[0]?.profit
                : openOrders[0]?.amount
            )}
          </div>
          <div
            className={`text-2xl font-bold ${
              openOrders[0]?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            USDT{openOrders[0]?.result_display?.status === "win" ? "+" : "-"}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {renderMetricItem(
            "Action",
            openOrders[0]?.title,
            <DollarSign className="text-blue-500" />,
            openOrders[0]?.trade_type === "buy" ? "text-green-500" : "text-red-500"
          )}
          {renderMetricItem(
            "HIGH",
            AmountWithCommas(openOrders[0]?.high),
            <TrendingUp className={isNegative ? "text-red-500" : "text-green-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "LOW",
            AmountWithCommas(openOrders[0]?.low),
            <TrendingDown className={isNegative ? "text-red-500" : "text-green-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "VOLUME",
            AmountWithCommas(openOrders[0]?.volume),
            <BarChart2 className={isNegative ? "text-red-500" : "text-cyan-400"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "CHANGE",
            AmountWithCommas(openOrders[0]?.change),
            <TrendingUp className={isNegative ? "text-red-500" : "text-purple-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            AmountWithCommas(openOrders[0]?.amount),
            <DollarSign className="text-yellow-500" />,
            "text-yellow-300"
          )}
          {renderMetricItem(
            `${openOrders[0]?.result_display?.status === "win" ? "PROFIT" : "LOSS"}`,
            AmountWithCommas(
              openOrders[0]?.result_display?.status === "win"
                ? openOrders[0]?.profit
                : openOrders[0]?.amount
            ),
            <DollarSign className="text-emerald-500" />,
            `${
              openOrders[0]?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`, // The color for the label
            `${openOrders[0]?.result_display?.status === "win" ? "" : "text-red-500 font-semibold"}`
          )}
          {renderMetricItem(
            "STATUS",
            openOrders[0]?.result,
            <Clock className="text-gray-400" />,
            `${
              openOrders[0]?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`
          )}
        </div>
      </div>
    </div>
  );
}
