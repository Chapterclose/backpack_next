"use client";
import MarketTable from "@/components/common/MarketTable";
import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import { useContext, useEffect } from "react";

// Combine watchedPairs and cryptoIcons into a single array of objects


export default function BinanceMarkets() {
  const {markets, setMarkets} = useContext(contextProvider)
  useEffect(() => {
        // Extract only the symbols for the WebSocket connection
        const watchedSymbols = marketData.map((data) => data.symbol);
    
        const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");
    
        ws.onmessage = (event) => {
          const updates = JSON.parse(event.data);
    
          const filtered = updates.filter((ticker) =>
            watchedSymbols.includes(ticker.s)
          );
    
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
        };
    
        return () => ws.close();
      }, [setMarkets]);

  return (
    <div className="container py-[40px] lg:py-[80px]">
      <h2 className="text-4xl lg:text-6xl font-semibold mb-8 text-black dark:text-white">Crypto Currencies</h2>

      <MarketTable ss={0} se={25}/>
    </div>
  );
}