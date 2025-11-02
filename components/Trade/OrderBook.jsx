"use client";

import { useEffect, useState } from "react";
import React from "react";

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

function OrderBook({ coin }) {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coin) return;

    const symbol = `${coin}usdt`.toUpperCase();
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_URL;

    // Fetch initial order book snapshot from REST API (faster than waiting for WebSocket)
    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          `${binanceUrl}/api/v3/depth?symbol=${symbol}&limit=20`
        );
        const data = await response.json();
        
        if (data.asks && data.bids) {
          setAsks(data.asks.slice(0, 10));
          setBids(data.bids.slice(0, 10));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching order book:", error);
        // Continue to WebSocket even if API fails
      }
    };

    fetchInitialData();

    // Then connect WebSocket for real-time updates
    let lastUpdate = 0;
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/ws/${coin}usdt@depth20@100ms`
    );

    ws.onmessage = (event) => {
      const now = Date.now();
      if (now - lastUpdate < 200) return; // Throttle to 200ms
      lastUpdate = now;
      
      const data = JSON.parse(event.data);

      setAsks(data?.asks?.slice(0, 10) || []);
      setBids(data?.bids?.slice(0, 10) || []);

      if (loading) setLoading(false);
    };

    ws.onerror = (event) => {
      console.error("OrderBook WebSocket Error:", event);
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

export default React.memo(OrderBook);
