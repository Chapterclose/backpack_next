"use client";

import { useEffect, useState } from "react";

// ✅ Skeleton loader
function OrderBookSkeleton({ coin }) {
  const Row = () => (
    <li className="flex justify-between">
      <span className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
      <span className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
    </li>
  );

  return (
    <div className="grid grid-cols-2 gap-6 p-4 dark:bg-[#0d1117] text-white rounded-lg max-w-2xl mx-auto">
      {/* Asks */}
      <div>
        <li className="flex justify-between text-black dark:text-gray-400 text-sm border-b border-gray-700 pb-1 mb-1">
          <span className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
          <span className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
        </li>
        <ul className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Row key={i} />
          ))}
        </ul>
      </div>

      {/* Bids */}
      <div>
        <li className="flex justify-between text-black dark:text-gray-400 text-sm border-b border-gray-700 pb-1 mb-1">
          <span className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
          <span className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
        </li>
        <ul className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Row key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function OrderBook({ coin }) {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_BINANCE_URL}/ws/${coin}usdt@depth20@100ms`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAsks(data?.asks?.slice(0, 10)); // Asks (sell orders)
      setBids(data?.bids?.slice(0, 10)); // Bids (buy orders)

      if (loading) setLoading(false);
    };

    return () => ws.close();
  }, [coin, loading]);

  const HeadingRow = () => (
    <li className="flex justify-between text-black dark:text-gray-400 text-sm border-b border-gray-700 pb-1 mb-1">
      <span className="text-left">Price (USDT)</span>
      <span className="text-right uppercase">Amount ({coin})</span>
    </li>
  );

  if (loading) return <OrderBookSkeleton coin={coin} />; // ✅ Show skeleton

  return (
    <div className="grid grid-cols-2 gap-6 p-4 dark:bg-[#0d1117] text-white rounded-lg max-w-2xl mx-auto mt-8">
      {/* Asks - Sellers */}
      <div>
        <HeadingRow />
        <ul>
          {asks.map(([price, amount], i) => (
            <li key={i} className="flex justify-between text-red-500 dark:text-red-400">
              <span>{parseFloat(price).toLocaleString()}</span>
              <span>{parseFloat(amount).toFixed(5)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bids - Buyers */}
      <div>
        <HeadingRow />
        <ul>
          {bids.map(([price, amount], i) => (
            <li key={i} className="flex justify-between text-green-500 dark:text-green-400">
              <span>{parseFloat(price).toLocaleString()}</span>
              <span>{parseFloat(amount).toFixed(5)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
