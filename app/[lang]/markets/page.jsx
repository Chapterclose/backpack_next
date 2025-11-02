"use client";

import MarketTable from "@/components/common/MarketTable";
import { contextProvider } from "@/contexts/Context";
import { useContext } from "react";

export default function BinanceMarkets() {
  // Use shared markets data from Context (WebSocket connection is managed globally)
  const { markets } = useContext(contextProvider);

  return (
    <div className="container py-[40px] lg:py-[80px]">
      <h2 className="text-4xl lg:text-6xl font-semibold mb-8 text-black dark:text-white">
        Crypto Currencies
      </h2>
      <MarketTable ss={0} se={25} />
    </div>
  );
}
