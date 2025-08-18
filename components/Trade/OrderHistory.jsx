"use client";

import { BarChart2, Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeStore from "@/store/TradeStore";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

// const openOrders = [
//   {
//     id: "1",
//     type: "buy",
//     symbol: "BTC/USDT",
//     amount: 0.0125,
//     price: 48500,
//     total: 606.25,
//     status: "pending",
//     timestamp: new Date(),
//     timeframe: "60s",
//     pnl: 125.5,
//   },
//   {
//     id: "2",
//     type: "sell",
//     symbol: "BTC/USDT",
//     amount: 0.025,
//     price: 47800,
//     total: 1195,
//     status: "pending",
//     timestamp: new Date(Date.now() - 300000),
//     timeframe: "1d",
//     pnl: -45.3,
//   },
// ];

// const orderHistory = [
//   {
//     id: "3",
//     type: "buy",
//     symbol: "BTC/USDT",
//     amount: 0.01,
//     price: 46500,
//     total: 465,
//     status: "completed",
//     timestamp: new Date(Date.now() - 3600000),
//     timeframe: "12h",
//   },
//   {
//     id: "4",
//     type: "sell",
//     symbol: "BTC/USDT",
//     amount: 0.02,
//     price: 48000,
//     total: 960,
//     status: "completed",
//     timestamp: new Date(Date.now() - 7200000),
//     timeframe: "7d",
//   },
//   {
//     id: "5",
//     type: "buy",
//     symbol: "BTC/USDT",
//     amount: 0.015,
//     price: 45000,
//     total: 675,
//     status: "cancelled",
//     timestamp: new Date(Date.now() - 86400000),
//     timeframe: "15d",
//   },
// ];

// Data for the table

const TimerCell = ({ initialTimeInSeconds }) => {
  const [countdown, setCountdown] = useState(initialTimeInSeconds);

  useEffect(() => {
    // If the countdown is already at zero, do nothing.
    if (countdown <= 0) {
      return;
    }

    // Set up a timer to decrement the countdown every second.
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clean up the timer when the component unmounts or when the countdown finishes.
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="flex items-center justify-center">
      <span className="text-xl font-bold text-blue-400">{countdown > 0 ? countdown : "0"}s</span>
    </div>
  );
};
const data = [
  {
    high: "178,484",
    low: "47,474",
    volume: "584,848",
    change: "47,474",
    purchase: "100 USDT",
    profit: "10 USDT",
    status: "Win / loss",
  },
  {
    high: "215,678",
    low: "38,123",
    volume: "601,987",
    change: "65,432",
    purchase: "150 USDT",
    profit: "15 USDT",
    status: "Win",
  },
  {
    high: "190,000",
    low: "55,200",
    volume: "550,500",
    change: "40,100",
    purchase: "120 USDT",
    profit: "12 USDT",
    status: "Loss",
    timeInSeconds: 12220,
  },
  {
    high: "220,100",
    low: "49,500",
    volume: "720,300",
    change: "55,600",
    purchase: "200 USDT",
    profit: "25 USDT",
    status: "Win",
    timeInSeconds: 60,
  },
];

export const OrderHistory = () => {
  const { openOrders, orderHistory } = TradeStore();
  return (
    <Card className="p-3 sm:p-6 dark:text-white mt-15">
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
          <TabsTrigger value="open" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Open Orders</span>
            <span className="xs:hidden">Open</span>
            <span className="ml-1">({openOrders?.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Order History</span>
            <span className="xs:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-3 sm:mt-4">
          <OrderTable orders={openOrders} isOpen={true} />
        </TabsContent>

        <TabsContent value="history" className="mt-3 sm:mt-4">
          <OrderTable orders={orderHistory} isOpen={false} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const OrderTable = ({ orders, isOpen }) => {
  if (orders?.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground">
        <p className="text-sm sm:text-base">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 text-white rounded-xl shadow-lg w-full border border-slate-700">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                High
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Low
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Volume
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Change
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Purchase Volume
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Profit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                {isOpen ? "Time" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <TrendingUp size={16} className="text-green-500 mr-2" />
                    {item.high}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <TrendingDown size={16} className="text-red-500 mr-2" />
                    {item.low}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <BarChart2 size={16} className="text-cyan-400 mr-2" />
                    {item.volume}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <TrendingUp size={16} className="text-purple-500 mr-2" />
                    {item.change}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-yellow-500 mr-2" />
                    {item.purchase}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-emerald-500 mr-2" />
                    {item.profit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    {isOpen ? <TimerCell initialTimeInSeconds={120} /> : item.status} 
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
