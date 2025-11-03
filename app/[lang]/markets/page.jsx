"use client";

import MarketTable from "@/components/common/MarketTable";
import MarketSlide from "@/components/Market/MarketSlide";
import { contextProvider } from "@/contexts/Context";
import { useContext } from "react";

export default function BinanceMarkets() {
  const { markets } = useContext(contextProvider);

  return (
    <div className="container py-[20px] lg:pt-[40px] lg:pb-[80px]">
      <MarketSlide />
      <h2 className="text-4xl lg:text-6xl font-semibold mb-8 text-black dark:text-white">
        Crypto Currencies
      </h2>
      <MarketTable ss={0} se={25} />
    </div>
  );
}
