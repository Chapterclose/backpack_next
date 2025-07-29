"use client"

import { useEffect, useRef } from 'react';

function TradingViewWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content to avoid duplicates
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin"
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum"
        },
        {
          proName: "BINANCE:SOLUSDT",
          title: "Solana"
        }
      ],
      colorTheme: "dark",
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="container">
      <div className="tradingview-widget-container" ref={containerRef}>
        {/* Empty placeholder is still needed by TradingView */}
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export default TradingViewWidget;
