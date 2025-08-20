"use client";

import { useEffect, useState } from "react";

export default function OrderBook({ coin }) {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin}usdt@depth20@100ms`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAsks(data?.asks?.slice(0, 10)); // Asks (sell orders)
      setBids(data?.bids?.slice(0, 10)); // Bids (buy orders)
    };

    return () => ws.close();
  }, []);

  const HeadingRow = ({ color }) => (
    <li className="flex justify-between text-black dark:text-gray-400 text-sm border-b border-gray-700 pb-1 mb-1">
      <span className="text-left">Price (USDT)</span>
      <span className="text-right uppercase">Amount (${coin})</span>
    </li>
  );

  return (
    <div className="grid grid-cols-2 gap-6 p-4 dark:bg-[#0d1117] text-white rounded-lg max-w-2xl mx-auto">
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
