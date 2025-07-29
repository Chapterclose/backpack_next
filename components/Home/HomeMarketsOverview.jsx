"use client"

import { useEffect, useRef } from "react";

export default function Market() {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      title: "Cryptocurrencies",
      tabs: [
        {
          title: "Overview",
          symbols: [
            { s: "CRYPTOCAP:TOTAL" },
            { s: "BITSTAMP:BTCUSD" },
            { s: "BITSTAMP:ETHUSD" },
            { s: "COINBASE:SOLUSD" },
            { s: "BINANCE:AVAXUSD" },
            { s: "COINBASE:UNIUSD" },
          ],
        },
      ],
      width: "100%",
      height: "600",
      colorTheme: "dark",
      locale: "en",
      showChart: true,
    });

    widgetRef.current.innerHTML = ""; // Clear previous content
    widgetRef.current.appendChild(script);
  }, []);

  return (
    <div className="container">
        <h2 className="text-center text-4xl lg:text-6xl text-gray-700 font-semibold py-10 dark:text-white">Cryptocurrency</h2>
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget" ref={widgetRef} />
      </div>
    </div>
  );
}
