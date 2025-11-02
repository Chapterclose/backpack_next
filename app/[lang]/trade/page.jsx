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

// ✅ Skeleton loader
function TradePageSkeleton() {
  return (
    <div className="container py-[40px] lg:py-[60px]">
      <div className="max-w-2xl mx-auto mb-5 animate-pulse">
        <div className="h-8 w-32 bg-gray-300 rounded mb-3"></div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="h-72 bg-gray-200 rounded mb-10 animate-pulse"></div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
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

  const [loading, setLoading] = useState(true); // ✅ loading state

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

  // WebSocket for ticker
  useEffect(() => {
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
  }, [AccountBalance, prices]);

  if (loading) {
    return <TradePageSkeleton />;
  }

  return (
    <div className="container py-[40px] lg:py-[60px]">
      {/* <div className="max-w-2xl mx-auto mb-5">
        <h3 className="uppercase dark:text-white font-semibold text-3xl">{coin}/USDT</h3>
        <h4
          className={`font-semibold ${
            priceChangePercentage >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {priceChangePercentage}%
        </h4>
      </div> */}
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
      <div className="mt-10">
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
      <OrderBook coin={coin} />

      <OrderHistory
        high={highPrice}
        low={lowPrice}
        volume={volume}
        change={(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
        candleColor={candleColor}
        onOpen={() => setIsModalOpen(true)}
      />

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
