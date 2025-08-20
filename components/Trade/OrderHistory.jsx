"use client";

import { Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import { CheckCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import FF from "./FF";
import First from "./First";
import HistoryCard from "./HistoryCard";

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

export const OrderHistory = ({ high, low, volume, change, candleColor }) => {
  const { openOrders, orderHistory } = TradeStore();
  const { countdown } = useContext(contextProvider);
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
          <OrderTable
            orders={openOrders}
            high={high}
            low={low}
            volume={volume}
            isOpen={true}
            change={change}
            countdown={countdown}
            candleColor={candleColor}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-3 sm:mt-4">
          <OrderTable orders={orderHistory} isOpen={false} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const OrderTable = ({ orders, isOpen, high, low, volume, countdown, change, candleColor }) => {
  if (orders?.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground">
        <p className="text-sm sm:text-base">No orders found</p>
      </div>
    );
  }

  return (
    <>
      {isOpen ? (
        <First
          tradingDetails={orders[0]}
          high={high}
          low={low}
          volume={volume}
          change={change}
          candleColor={candleColor}
        />
      ) : (
        orders?.map((order, i) => <HistoryCard key={i} order={order} />)
      )}
    </>
    // <div className="bg-slate-800 text-white rounded-xl shadow-lg w-full border border-slate-700">
    //   <div className="overflow-x-auto rounded-lg">
    //     <table className="min-w-full divide-y divide-slate-700">
    //       <thead className="bg-slate-700 sticky top-0">
    //         <tr>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             High
    //           </th>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             Low
    //           </th>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             Volume
    //           </th>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             Change
    //           </th>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             Purchase Volume
    //           </th>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             Profit
    //           </th>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
    //           >
    //             {isOpen ? "Time" : "Status"}
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody className="bg-slate-800 divide-y divide-slate-700">
    //         {orders?.map((item, index) => (
    //           <tr key={index} className="hover:bg-slate-700 transition-colors duration-200">
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               <div className="flex items-center">
    //                 <TrendingUp size={16} className="text-green-500 mr-2" />
    //                 {isOpen ? high : item.high}
    //               </div>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               <div className="flex items-center">
    //                 <TrendingDown size={16} className="text-red-500 mr-2" />
    //                 {isOpen ? low : item.low}
    //               </div>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               <div className="flex items-center">
    //                 <BarChart2 size={16} className="text-cyan-400 mr-2" />
    //                 {isOpen ? volume : item.volume}
    //               </div>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               <div className="flex items-center">
    //                 <TrendingUp size={16} className="text-purple-500 mr-2" />
    //                 {isOpen ? `${change}` : item.change}
    //               </div>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               <div className="flex items-center">
    //                 <DollarSign size={16} className="text-yellow-500 mr-2" />
    //                 {item.amount}
    //               </div>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               <div className="flex items-center">
    //                 <DollarSign size={16} className="text-emerald-500 mr-2" />
    //                 {item.profit}
    //               </div>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
    //               {isOpen ? (
    //                 <div className="flex items-center">
    //                   <Clock size={16} className="text-gray-400 mr-2" />
    //                   <span className="text-xl font-bold text-blue-400">
    //                     {countdown > 0 ? countdown : "0"}s
    //                   </span>
    //                 </div>
    //               ) : (
    //                 <span
    //                   className={`capitalize font-semibold ${
    //                     item?.result_display?.status === "win" ? "text-green-500" : "text-red-500"
    //                   }`}
    //                 >
    //                   {item?.result_display?.status}
    //                 </span>
    //               )}
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
};
