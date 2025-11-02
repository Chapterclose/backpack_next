"use client";

import MarketTable from "@/components/common/MarketTable";
import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import { useContext, useEffect, useRef } from "react";

export default function BinanceMarkets() {
  const { markets, setMarkets } = useContext(contextProvider);
  const wsRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const watchedSymbols = marketData.map((data) => data.symbol);
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_URL;

    // Create AbortController for cleanup
    abortControllerRef.current = new AbortController();

    // Fetch only needed symbols using batch endpoint (much faster than fetching all tickers)
    const fetchInitialData = async () => {
      try {
        // Use batch endpoint to fetch only needed symbols - much faster than all tickers
        const symbolsParam = watchedSymbols.map(s => `"${s}"`).join(',');
        const response = await fetch(
          `${binanceUrl}/api/v3/ticker/24hr?symbols=[${symbolsParam}]`,
          { signal: abortControllerRef.current.signal }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const tickers = await response.json();
        
        // Build markets object from results
        const initialMarkets = {};
        tickers.forEach((ticker) => {
          initialMarkets[ticker.symbol] = {
            price: parseFloat(ticker.lastPrice || ticker.c || 0).toFixed(2),
            change: parseFloat(ticker.priceChangePercent || ticker.P || 0).toFixed(2),
          };
        });

        // Update markets immediately with available data
        if (Object.keys(initialMarkets).length > 0) {
          setMarkets((prev) => ({ ...prev, ...initialMarkets }));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching initial market data:", error);
        }
      }
    };

    // Start fetching immediately
    fetchInitialData();

    // Connect WebSocket immediately for real-time updates (don't wait for REST API)
    const wsUrl = process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL;
    if (wsUrl) {
      wsRef.current = new WebSocket(`${wsUrl}/ws/!ticker@arr`);

      let lastUpdate = 0;
      wsRef.current.onmessage = (event) => {
        const now = Date.now();
        if (now - lastUpdate < 500) return; // Throttle to 500ms
        lastUpdate = now;

        try {
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
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error("Markets WebSocket Error:", event);
      };
    }

    // Cleanup function
    return () => {
      // Abort fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Close WebSocket
      if (wsRef.current) {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
      }
    };
  }, [setMarkets]); // Removed 'loading' from dependencies

  return (
    <div className="container py-[40px] lg:py-[80px]">
      <h2 className="text-4xl lg:text-6xl font-semibold mb-8 text-black dark:text-white">
        Crypto Currencies
      </h2>
      <MarketTable ss={0} se={25} />
    </div>
  );
}
