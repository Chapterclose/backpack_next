"use client";

import MarketTable from "@/components/common/MarketTable";
import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import { useContext, useEffect, useState } from "react";

// ✅ Skeleton Loader
function MarketSkeleton() {
  return (
    <div className="container py-[40px] lg:py-[80px]">
      <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}

export default function BinanceMarkets() {
  const { markets, setMarkets } = useContext(contextProvider);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const watchedSymbols = marketData.map((data) => data.symbol);

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const updates = JSON.parse(event.data);

      const filtered = updates.filter((ticker) => watchedSymbols.includes(ticker.s));

      setMarkets((prev) => {
        const updated = { ...prev };
        filtered.forEach((ticker) => {
          updated[ticker.s] = {
            price: parseFloat(ticker.c).toFixed(2),
            change: parseFloat(ticker.P).toFixed(2),
          };
        });
        return updated;
      });

      // ✅ Once we get first data, stop loading
      if (loading) setLoading(false);
    };

    return () => ws.close();
  }, [setMarkets, loading]);

  if (loading) {
    return <MarketSkeleton />; // ✅ show skeleton until data comes
  }

  return (
    <div className="container py-[40px] lg:py-[80px]">
      <h2 className="text-4xl lg:text-6xl font-semibold mb-8 text-black dark:text-white">
        Crypto Currencies
      </h2>
      <MarketTable ss={0} se={25} />
    </div>
  );
}
