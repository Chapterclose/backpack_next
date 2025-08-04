"use client"

import { useCallback, useEffect, useRef, useState } from 'react';

// Main App component for the Next.js page
export default function TradePage() {
  const chartContainerRef = useRef(); // Ref to the container div for the TradingView widget

  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [error, setError] = useState(null); // State to manage error messages

  // Real-time data states for the header display
  const [currentPrice, setCurrentPrice] = useState('0.00');
  const [priceChangePercentage, setPriceChangePercentage] = useState('0.00');
  const [highPrice, setHighPrice] = useState('0.00');
  const [lowPrice, setLowPrice] = useState('0.00');
  const [volume, setVolume] = useState(0); // Initialized as a number

  // Timeframe state for TradingView widget (defaulted since buttons are removed)
  const [selectedInterval, setSelectedInterval] = useState('D'); // Default interval for TradingView: 'D' for Daily

  // Symbol state for TradingView widget
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT'); // Default crypto symbol for Binance

  // Indicator states for TradingView widget's studies (defaulted since buttons are removed)
  const [activeIndicators, setActiveIndicators] = useState([]); // No indicators active by default on TradingView

  const wsRef = useRef(null); // Ref for WebSocket instance for ticker data
  const tickerReconnectTimeoutRef = useRef(null); // Ref for Ticker WebSocket reconnection timeout

  // Helper to format large numbers (e.g., volume)
  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return '0.00';
    }

    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // Function to initialize and update the TradingView widget
  const initializeTradingViewWidget = useCallback(() => {
    if (!chartContainerRef.current) return;

    // Clear any existing widget to prevent duplicates
    chartContainerRef.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Map activeIndicators to TradingView studies format
    const tvStudies = [];
    // Since buttons are removed, these will be based on initial state or user interaction within TradingView widget
    if (activeIndicators.includes('MACD')) tvStudies.push({ "id": "MACD", "inputs": {} });
    if (activeIndicators.includes('MA')) tvStudies.push({ "id": "MA", "inputs": { "length": 20 } }); // Example MA
    if (activeIndicators.includes('EMA')) tvStudies.push({ "id": "EMA", "inputs": { "length": 20 } }); // Example EMA
    if (activeIndicators.includes('BOLL')) tvStudies.push({ "id": "BB", "inputs": {} }); // Bollinger Bands
    if (activeIndicators.includes('RSI')) tvStudies.push({ "id": "RSI", "inputs": {} });
    if (activeIndicators.includes('WR')) tvStudies.push({ "id": "WPR", "inputs": {} }); // Williams %R

    script.innerHTML = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": false, // Keep side toolbar for more controls
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": !activeIndicators.includes('Volume'), // Hide volume if not active
      "hotlist": false,
      "interval": selectedInterval,
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": selectedSymbol,
      "theme": "dark",
      "timezone": "Etc/UTC",
      "backgroundColor": "#1a202c", // Match Tailwind bg-gray-900 or similar
      "gridColor": "rgba(242, 242, 242, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": tvStudies, // Dynamically add studies
      "autosize": false, // Set to false to use explicit width/height
      "width": "100%",   // Explicit width
      "height": 700,     // Explicit height in pixels
    });

    try {
      chartContainerRef.current.appendChild(script);
      setLoading(false);
      setError(null);
    } catch (e) {
      console.error("Error appending TradingView widget script:", e);
      setError("Failed to load trading chart. Please try again later.");
      setLoading(false);
    }
  }, [selectedInterval, selectedSymbol, activeIndicators]); // Dependencies for re-initializing widget

  // Effect hook to initialize and manage the TradingView widget and WebSocket connections
  useEffect(() => {
    initializeTradingViewWidget();

    // Close existing WebSocket before opening a new one
    if (wsRef.current) {
      // Clear any pending reconnection attempts
      if (tickerReconnectTimeoutRef.current) {
        clearTimeout(tickerReconnectTimeoutRef.current);
        tickerReconnectTimeoutRef.current = null;
      }
      wsRef.current.close();
    }

    // WebSocket for 24hr Ticker Statistics (@ticker stream)
    // This is still useful for the price/volume display above the chart
    wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    wsRef.current.onopen = () => {
      console.log('Binance Ticker WebSocket Connected');
      setError(null);
      // Clear any pending reconnection attempts on successful connection
      if (tickerReconnectTimeoutRef.current) {
        clearTimeout(tickerReconnectTimeoutRef.current);
        tickerReconnectTimeoutRef.current = null;
      }
    };
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setCurrentPrice(parseFloat(message.c).toFixed(2));
      setPriceChangePercentage(parseFloat(message.P).toFixed(2));
      setHighPrice(parseFloat(message.h).toFixed(2));
      setLowPrice(parseFloat(message.l).toFixed(2));
      setVolume(parseFloat(message.v));
    };
    wsRef.current.onerror = (event) => {
      console.error('Binance Ticker WebSocket Error:', event);
      setError('Real-time data connection error for ticker data. Please check console for details.');
    };
    wsRef.current.onclose = (event) => {
      console.log('Binance Ticker WebSocket Disconnected:', event.code, event.reason);
      // Attempt to reconnect if the closure was not intentional (e.g., not from component unmount/interval change)
      if (event.code !== 1000 && event.code !== 1001 && !tickerReconnectTimeoutRef.current) { // 1000: Normal Closure, 1001: Going Away
        setError('Real-time ticker data disconnected. Attempting to reconnect...');
        tickerReconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect Ticker WebSocket...');
          // Re-run setup to reconnect
          initializeTradingViewWidget(); // This also triggers the ticker WebSocket setup
        }, 3000); // Try to reconnect after 3 seconds
      }
    };

    // Cleanup function when component unmounts
    return () => {
      if (wsRef.current) {
        // Clear any pending reconnection attempts before closing
        if (tickerReconnectTimeoutRef.current) {
          clearTimeout(tickerReconnectTimeoutRef.current);
          tickerReconnectTimeoutRef.current = null;
        }
        wsRef.current.close();
      }
      // No need to remove TradingView widget script explicitly, as innerHTML = '' handles it.
    };
  }, [initializeTradingViewWidget]); // Re-run this effect when initializeTradingViewWidget changes

  const priceChangeColor = priceChangePercentage >= 0 ? 'text-green-500' : 'text-red-500';

  // Timeframes and indicators arrays and their handlers are removed as per request.
  // The TradingView widget has its own built-in timeframe and indicator selection.

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-[60px] font-inter">
      <h1 className="text-3xl font-bold mb-6">Overview of BTCUSDT</h1>

      {/* Real-time price information section */}
      <div className="w-full max-w-5xl rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
          <span className="text-5xl font-bold" style={{ color: priceChangePercentage >= 0 ? '#4CAF50' : '#EF5350' }}>
            {currentPrice}
          </span>
          <span className={`text-lg ${priceChangeColor}`}>
            {priceChangePercentage}%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center sm:text-left">
          <div>
            <span className="text-gray-400 text-sm">High</span>
            <p className="text-lg font-semibold">{highPrice}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Low</span>
            <p className="text-lg font-semibold">{lowPrice}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Volume (BTC)</span>
            <p className="text-lg font-semibold">{formatNumber(volume)}</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg">Loading chart data...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-lg mb-4 p-4 bg-red-900 rounded-lg">
          {error}
        </div>
      )}

      {/* TradingView Widget container */}
      <div
        className="tradingview-widget-container w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        ref={chartContainerRef}
        style={{ height: "700px", width: "100%" }}
      >
        {/* The inner widget div is where TradingView injects its content.
            By setting its height to 100%, it will fill the parent container's height. */}
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        <div className="tradingview-widget-copyright" style={{ color: '#cbd5e0', fontSize: '10px', textAlign: 'right', paddingRight: '10px' }}>
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style={{ color: '#cbd5e0' }}>
            <span className="blue-text">Chart by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}
