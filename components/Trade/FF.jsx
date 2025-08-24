"use client";

import { AmountWithCommas } from "@/lib/utils";
import TradeStore from "@/store/TradeStore";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function FF() {
  const { tradingData } = TradeStore();

  const isNegative = Number(tradingData?.change) < 0;

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
              tradingData?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            {AmountWithCommas(
              tradingData?.result_display?.status === "win"
                ? tradingData?.profit
                : tradingData?.amount
            )}
          </div>
          <div
            className={`text-2xl font-bold ${
              tradingData?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            }`}
          >
            USDT{tradingData?.result_display?.status === "win" ? "+" : "-"}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {renderMetricItem(
            "Action",
            tradingData?.title,
            <DollarSign className="text-blue-500" />,
            tradingData?.trade_type === "buy" ? "text-green-500" : "text-red-500"
          )}
          {renderMetricItem(
            "HIGH",
            AmountWithCommas(tradingData?.high),
            <TrendingUp className={isNegative ? "text-red-500" : "text-green-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "LOW",
            AmountWithCommas(tradingData?.low),
            <TrendingDown className={isNegative ? "text-red-500" : "text-green-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "VOLUME",
            AmountWithCommas(tradingData?.volume),
            <BarChart2 className={isNegative ? "text-red-500" : "text-cyan-400"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "CHANGE",
            AmountWithCommas(tradingData?.change),
            <TrendingUp className={isNegative ? "text-red-500" : "text-purple-500"} />,
            isNegative ? "text-red-400" : "text-green-400"
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            AmountWithCommas(tradingData?.amount),
            <DollarSign className="text-yellow-500" />,
            "text-yellow-300"
          )}
          {renderMetricItem(
            `${tradingData?.result_display?.status === "win" ? "PROFIT" : "LOSS"}`,
            AmountWithCommas(
              tradingData?.result_display?.status === "win"
                ? tradingData?.profit
                : tradingData?.amount
            ),
            <DollarSign className="text-emerald-500" />,
            `${
              tradingData?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
            } capitalize`, // The color for the label
            `${tradingData?.result_display?.status === "win" ? "" : "text-red-500 font-semibold"}`
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
