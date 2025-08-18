"use client"

import { BarChart2, Clock, DollarSign, RefreshCcw, TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

// Main component for the trading UI
export default function First() {
  const [countdown, setCountdown] = useState(1296000);
  const [isRunning, setIsRunning] = useState(true);

  // Use useEffect to handle the countdown logic
  useEffect(() => {
    let timer;
    if (isRunning && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isRunning]);

  // Handle the reset button click
  const handleReset = () => {
    setCountdown(60);
    setIsRunning(true);
  };

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
    { label: "STATUS", value: "PENDING", icon: <Clock className="text-gray-400" /> },
  ];

  // Calculate the progress for the circular countdown timer
  const progress = (countdown / 60) * 360;

  return (
    <div className="flex bg-slate-900 justify-center p-2 sm:p-4 max-h-screen overflow-y-auto">
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

        {/* Action Button */}
        {/* <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-500 transition-colors duration-300 flex items-center gap-1 text-sm"
          >
            <RefreshCcw size={16} />
            Reset Timer
          </button>
        </div> */}
      </div>
    </div>
  );
}
