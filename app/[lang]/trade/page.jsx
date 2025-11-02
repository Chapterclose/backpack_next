"use client";

import BuySell from "@/components/Trade/BuySell";
import OrderBook from "@/components/Trade/OrderBook";
import { OrderHistory } from "@/components/Trade/OrderHistory";
import RealTimePriceDisplay from "@/components/Trade/RealTimePriceDisplay";
import StockChart from "@/components/Trade/StockChart";
import { TradeConfirmationModal } from "@/components/Trade/TradeConfirmationModal";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

// ✅ Enhanced Skeleton loader
function TradePageSkeleton() {
  return (
    <div className="container py-8 md:py-12 lg:py-16">
      <div className="space-y-6 md:space-y-8">
        {/* Price Display Skeleton */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-16 md:h-20 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="h-72 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}

export default function TradePage() {
  const searchParams = useSearchParams();
  const coin = searchParams.get("symbol");

  const [currentPrice, setCurrentPrice] = useState("0.00");
  const [priceChangePercentage, setPriceChangePercentage] = useState("0.00");
  const [highPrice, setHighPrice] = useState("0.00");
  const [lowPrice, setLowPrice] = useState("0.00");
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tickerLoading, setTickerLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // available balance
  const [prices, setPrices] = useState({ USDT: 1, BTC: null, ETH: null });
  const { totalAvailableBalance, setTotalAvailableBalance } = useContext(contextProvider);

  // Chart State
  const [hoverdCandleData, hoveredSetCandleData] = useState(null);
  const [currentCandleData, setCurrentCandleData] = useState(null);
  const stockChartLegendData = hoverdCandleData || currentCandleData;
  const candleColor =
    stockChartLegendData?.open > stockChartLegendData?.close ? "#e13255" : "#2EBD85";

  // Store functions
  const { OpenOrdersRequest, OrderHistoryRequest, orderHistory, openOrders } = TradeStore();
  const { GetAccountBalanceRequest, AccountBalance } = UserStore();

  const wsRef = useRef(null);
  const tickerReconnectTimeoutRef = useRef(null);

  // Set loading to false when account data is ready
  useEffect(() => {
    if (AccountBalance && orderHistory && openOrders) {
      setLoading(false);
    }
  }, [AccountBalance, orderHistory, openOrders]);

  // Fetch on mount
  useEffect(() => {
    OpenOrdersRequest();
    OrderHistoryRequest();
    GetAccountBalanceRequest();
  }, [OpenOrdersRequest, OrderHistoryRequest, GetAccountBalanceRequest]);

  // Fetch initial ticker data via REST API immediately, then connect WebSocket
  useEffect(() => {
    if (!coin) return;

    const symbol = `${coin}USDT`;
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_URL;

    // Fetch initial ticker data via REST API
    const fetchInitialTicker = async () => {
      try {
        const response = await fetch(`${binanceUrl}/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await response.json();
        
        setCurrentPrice(parseFloat(data.lastPrice || data.c || 0).toFixed(2));
        setPriceChangePercentage(parseFloat(data.priceChangePercent || data.P || 0).toFixed(2));
        setHighPrice(parseFloat(data.highPrice || data.h || 0).toFixed(2));
        setLowPrice(parseFloat(data.lowPrice || data.l || 0).toFixed(2));
        setVolume(parseFloat(data.volume || data.v || 0));
        setTickerLoading(false);
      } catch (error) {
        console.error("Error fetching initial ticker data:", error);
        setTickerLoading(false);
      }
    };

    fetchInitialTicker();

    // Then connect WebSocket for real-time updates
    const connectWebSocket = () => {
      if (wsRef.current) {
        if (tickerReconnectTimeoutRef.current) {
          clearTimeout(tickerReconnectTimeoutRef.current);
          tickerReconnectTimeoutRef.current = null;
        }
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/ws/${coin}usdt@ticker`
      );
      wsRef.current.onopen = () => {
        console.log("Binance Ticker WebSocket Connected");
        setError(null);
      };
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setCurrentPrice(parseFloat(message.c).toFixed(2));
        setPriceChangePercentage(parseFloat(message.P).toFixed(2));
        setHighPrice(parseFloat(message.h).toFixed(2));
        setLowPrice(parseFloat(message.l).toFixed(2));
        setVolume(parseFloat(message.v));
        setTickerLoading(false);
      };
      wsRef.current.onerror = (event) => {
        console.error("Binance Ticker WebSocket Error:", event);
        setError("Ticker connection error.");
      };
      wsRef.current.onclose = () => {
        console.log("Binance Ticker WebSocket Disconnected");
      };
    };

    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [coin]);

  // Update balances in USD
  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/stream?streams=btcusdt@trade/ethusdt@trade`
    );

    let lastPriceUpdate = 0;
    socket.onmessage = (event) => {
      const now = Date.now();
      if (now - lastPriceUpdate < 500) return; // Throttle to 500ms
      lastPriceUpdate = now;
      
      const msg = JSON.parse(event.data);
      const symbol = msg?.data?.s;
      const price = parseFloat(msg?.data?.p);

      if (symbol === "BTCUSDT") {
        setPrices((prev) => ({ ...prev, BTC: price }));
      } else if (symbol === "ETHUSDT") {
        setPrices((prev) => ({ ...prev, ETH: price }));
      }
    };

    return () => socket.close();
  }, []);
  
  useEffect(() => {
    if (!AccountBalance) return;

    const usdtAvailable = parseFloat(AccountBalance?.USDT?.available || "0");
    const btcAvailable = parseFloat(AccountBalance?.BTC?.available || "0");
    const ethAvailable = parseFloat(AccountBalance?.ETH?.available || "0");

    const usdtValue = usdtAvailable * prices.USDT;
    const btcValue = btcAvailable * (prices.BTC || 0);
    const ethValue = ethAvailable * (prices.ETH || 0);

    setTotalAvailableBalance(usdtValue + btcValue + ethValue);
  }, [AccountBalance, prices, setTotalAvailableBalance]);

  // Show skeleton only while account data is loading
  if (loading) {
    return <TradePageSkeleton />;
  }

  return (
    <div className="container py-8 md:py-12 lg:py-16">
      {/* Price Display */}
      <div className="mb-6 md:mb-8">
        <RealTimePriceDisplay
          currentPrice={currentPrice}
          priceChangePercentage={priceChangePercentage}
          highPrice={highPrice}
          lowPrice={lowPrice}
          volume={volume}
          coin={coin}
          currentCandleData={currentCandleData}
          stockChartLegendData={stockChartLegendData}
        />
      </div>

      {/* Chart */}
      <div className="mb-6 md:mb-8">
        <StockChart
          highPrice={highPrice}
          lowPrice={lowPrice}
          volume={volume}
          hoverdCandleData={hoverdCandleData}
          currentCandleData={currentCandleData}
          stockChartLegendData={stockChartLegendData}
          hoveredSetCandleData={hoveredSetCandleData}
          setCurrentCandleData={setCurrentCandleData}
          coin={coin}
        />
      </div>

      {/* Order Book */}
      <OrderBook coin={coin} />

      {/* Order History */}
      <div className="mt-8 md:mt-10">
        <OrderHistory
          high={highPrice}
          low={lowPrice}
          volume={volume}
          change={(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
          candleColor={candleColor}
          onOpen={() => setIsModalOpen(true)}
        />
      </div>

      {/* Buy/Sell Buttons */}
      <BuySell
        coin={coin}
        onOpen={() => setIsModalOpen(true)}
        AccountBalance={AccountBalance}
        currentPrice={currentPrice}
        high={highPrice}
        low={lowPrice}
        volume={volume}
        change={(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
      />

      {/* Confirmation Modal */}
      <TradeConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
        high={highPrice}
        low={lowPrice}
        volume={volume}
        change={(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
        candleColor={candleColor}
      />
    </div>
  );
}
