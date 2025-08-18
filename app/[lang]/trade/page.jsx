"use client";

import BuySell from "@/components/Trade/BuySell";
import OrderBook from "@/components/Trade/OrderBook";
import { OrderHistory } from "@/components/Trade/OrderHistory";
import StockChart from "@/components/Trade/StockChart";
import { TradeConfirmationModal } from "@/components/Trade/TradeConfirmationModal";
import TradeStore from "@/store/TradeStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const mockOpenOrders = [
  {
    id: "1",
    type: "buy",
    symbol: "BTC/USDT",
    amount: 0.0125,
    price: 48500,
    total: 606.25,
    status: "pending",
    timestamp: new Date(),
    timeframe: "60s",
    pnl: 125.5,
  },
  {
    id: "2",
    type: "sell",
    symbol: "BTC/USDT",
    amount: 0.025,
    price: 47800,
    total: 1195,
    status: "pending",
    timestamp: new Date(Date.now() - 300000),
    timeframe: "1d",
    pnl: -45.3,
  },
];

export default function TradePage() {
  const searchParams = useSearchParams();
  const coin = searchParams.get("symbol");
  const [currentPrice, setCurrentPrice] = useState("0.00");
  const [priceChangePercentage, setPriceChangePercentage] = useState("0.00");
  const [highPrice, setHighPrice] = useState("0.00");
  const [lowPrice, setLowPrice] = useState("0.00");
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [openOrders, setOpenOrders] = useState(mockOpenOrders);

  // Apis Call
  const { OpenOrdersRequest, OrderHistoryRequest } = TradeStore();

  const wsRef = useRef(null);
  const tickerReconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) {
      if (tickerReconnectTimeoutRef.current) {
        clearTimeout(tickerReconnectTimeoutRef.current);
        tickerReconnectTimeoutRef.current = null;
      }
      wsRef.current.close();
    } // WebSocket for 24hr Ticker Statistics (@ticker stream)

    wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${coin}usdt@ticker`);
    wsRef.current.onopen = () => {
      console.log("Binance Ticker WebSocket Connected");
      setError(null);
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
      console.error("Binance Ticker WebSocket Error:", event);
      setError(
        "Real-time data connection error for ticker data. Please check console for details."
      );
    };
    wsRef.current.onclose = (event) => {
      console.log("Binance Ticker WebSocket Disconnected:", event.code, event.reason);
      if (event.code !== 1000 && event.code !== 1001 && !tickerReconnectTimeoutRef.current) {
        setError("Real-time ticker data disconnected. Attempting to reconnect...");
        tickerReconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect Ticker WebSocket...");
          wsRef.current.close();
        }, 3000);
      }
    };

    return () => {
      if (wsRef.current) {
        if (tickerReconnectTimeoutRef.current) {
          clearTimeout(tickerReconnectTimeoutRef.current);
          tickerReconnectTimeoutRef.current = null;
        }
        wsRef.current.close();
      }
    };
  }, []);

  const handleTrade = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleConfirmTrade = () => {
    if (!currentOrder) return;

    const newOrder = {
      id: Date.now().toString(),
      type: currentOrder.type,
      symbol: "BTC/USDT",
      amount: currentOrder.amount,
      price: currentOrder.price,
      total: currentOrder.amount * currentOrder.price,
      status: "pending",
      timestamp: new Date(),
      timeframe: currentOrder.timeframe,
      pnl: Math.random() > 0.5 ? Math.random() * 200 - 100 : undefined,
    };

    setOpenOrders((prev) => [newOrder, ...prev]);

    // toast({
    //   title: "Trade Executed",
    //   description: `${currentOrder.type.toUpperCase()} position opened for ${
    //     currentOrder.amount
    //   } BTC (${currentOrder.timeframe}).`,
    // });

    setCurrentOrder(null);
  };

  useEffect(() => {
    OpenOrdersRequest();
    OrderHistoryRequest();
  }, []);

  return (
    <div className="container py-[40px] lg:py-[60px]">
      <div className="max-w-2xl mx-auto mb-5">
        <h3 className="uppercase dark:text-white font-semibold text-3xl">{coin}/USDT</h3>
        <h4 className="text-red-500 font-semibold">{priceChangePercentage}%</h4>
      </div>
      <OrderBook />
      {/* <RealTimePriceDisplay
        coin={coin}
        currentPrice={currentPrice}
        priceChangePercentage={priceChangePercentage}
        highPrice={highPrice}
        lowPrice={lowPrice}
        volume={volume}
      /> */}

      <div className="mt-10">
        <StockChart highPrice={highPrice} lowPrice={lowPrice} volume={volume} />
      </div>

      <OrderHistory />

      <BuySell coin={coin} handleTrade={handleTrade} />

      {/* Trade Confirmation Modal */}
      <TradeConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={currentOrder}
        onConfirm={handleConfirmTrade}
      />
    </div>
  );
}
