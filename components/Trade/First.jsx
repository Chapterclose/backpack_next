"use client";

import { contextProvider } from "@/contexts/Context";
import { AmountWithCommas } from "@/lib/utils";
import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

// Main component for the trading UI
export default function First({ tradingDetails, high, low, volume, change, candleColor }) {
  const { countdown } = useContext(contextProvider);
  const [count, setCountdown] = useState(countdown);
  const [isRunning, setIsRunning] = useState(true);

  // Use useEffect to handle the countdown logic
  useEffect(() => {
    let timer;
    if (isRunning && count > 0) {
      timer = setTimeout(() => {
        setCountdown(count - 1);
      }, 1000);
    } else if (count === 0) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [count, isRunning]);

  // Helper function to render a single metric item
  const renderMetricItem = (label, value, icon, valueColorClass = "", candle) => (
    <div
      key={label}
      className="bg-slate-700 py-1 px-4 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-center">
        {React.cloneElement(icon, { size: 16 })}
        <span className="ml-2 text-slate-300 font-medium text-xs">{label}</span>
      </div>
      <span style={{ color: candle }} className={`text-lg font-bold truncate ${valueColorClass}`}>
        {value}
      </span>
    </div>
  );

  // Calculate the progress for the circular countdown timer
  const progress = (countdown / 60) * 360;

  return (
    <div className="flex bg-slate-900 justify-center p-2 sm:p-4 max-h-screen overflow-y-auto max-w-xl mx-auto">
      <div className="text-white rounded-xl shadow-lg p-4 w-full">
        {/* Animated Countdown Timer */}
        <div className="relative flex justify-center items-center my-4">
          <div
            className="w-32 h-32 rounded-full flex justify-center items-center"
            style={{
              background: `conic-gradient(from 0deg, #60A5FA ${progress}deg, #1E293B ${progress}deg)`,
            }}
          >
            <div className="w-28 h-28 rounded-full bg-slate-900 flex flex-col items-center justify-center border-2 border-slate-700">
              <span className="text-2xl font-extrabold text-blue-400">{countdown}</span>
              <span className="text-sm text-slate-400 mt-1">SECONDS</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {renderMetricItem(
            "Action",
            tradingDetails?.title,
            <DollarSign className="text-blue-500" />,
            "text-blue-400"
          )}
          {renderMetricItem(
            "HIGH",
            AmountWithCommas(high),
            <TrendingUp className="text-green-500" />,
            "",
            candleColor
          )}
          {renderMetricItem("LOW", low, <TrendingDown className="text-red-500" />, "", candleColor)}
          {renderMetricItem(
            "VOLUME",
            AmountWithCommas(volume),
            <BarChart2 className="text-cyan-400" />,
            "",
            candleColor
          )}
          {renderMetricItem(
            "CHANGE",
            AmountWithCommas(change),
            <TrendingUp className="text-purple-500" />,
            "",
            candleColor
          )}
          {renderMetricItem(
            "PURCHASE VOLUME",
            `${AmountWithCommas(tradingDetails?.amount)} USDT`,
            <DollarSign className="text-yellow-500" />,
            "text-yellow-300"
          )}
          {renderMetricItem(
            "PROFIT",
            `${AmountWithCommas(tradingDetails?.profit)} USDT`,
            <DollarSign className="text-emerald-500" />,
            "text-emerald-300"
          )}
          {renderMetricItem(
            "STATUS",
            `${tradingDetails?.status}`,
            <Clock className="text-gray-400" />,
            "text-gray-300"
          )}
        </div>
      </div>
    </div>
  );
}
