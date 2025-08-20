"use client";

import BuySell from "@/components/Trade/BuySell";
import OrderBook from "@/components/Trade/OrderBook";
import { OrderHistory } from "@/components/Trade/OrderHistory";
import StockChart from "@/components/Trade/StockChart";
import { TradeConfirmationModal } from "@/components/Trade/TradeConfirmationModal";
import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

  // Chart State
  const [hoverdCandleData, hoveredSetCandleData] = useState(null);
  const [currentCandleData, setCurrentCandleData] = useState(null);
  const stockChartLegendData = hoverdCandleData || currentCandleData;

  // Apis Call
  const { OpenOrdersRequest, OrderHistoryRequest, orderHistory, openOrders } = TradeStore();
  const { GetAccountBalanceRequest, AccountBalance } = UserStore();
  // console.log(openOrders,orderHistory)
  const wsRef = useRef(null);
  const tickerReconnectTimeoutRef = useRef(null);

  useEffect(() => {
    // WebSocket for 24hr Ticker Statistics (@ticker stream)
    const connectWebSocket = () => {
      if (wsRef.current) {
        if (tickerReconnectTimeoutRef.current) {
          clearTimeout(tickerReconnectTimeoutRef.current);
          tickerReconnectTimeoutRef.current = null;
        }
        wsRef.current.close();
      }

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
            connectWebSocket();
          }, 3000);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        if (tickerReconnectTimeoutRef.current) {
          clearTimeout(tickerReconnectTimeoutRef.current);
          tickerReconnectTimeoutRef.current = null;
        }
        wsRef.current.close();
      }
    };
  }, [coin]);

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

    setCurrentOrder(null);
  };

  useEffect(() => {
    OpenOrdersRequest();
    OrderHistoryRequest();
    GetAccountBalanceRequest();
  }, [OpenOrdersRequest, OrderHistoryRequest, GetAccountBalanceRequest]);

  return (
    <div className="container py-[40px] lg:py-[60px]">
      <div className="max-w-2xl mx-auto mb-5">
        <h3 className="uppercase dark:text-white font-semibold text-3xl">{coin}/USDT</h3>
        <h4 className="text-red-500 font-semibold">{priceChangePercentage}%</h4>
      </div>
      <OrderBook coin={coin} />
      {/* <RealTimePriceDisplay
        coin={coin}
        currentPrice={currentPrice}
        priceChangePercentage={priceChangePercentage}
        highPrice={highPrice}
        lowPrice={lowPrice}
        volume={volume}
      /> */}

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
        />
      </div>

      <OrderHistory
        high={highPrice}
        low={lowPrice}
        volume={volume}
        change={(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
      />

      <BuySell coin={coin} handleTrade={handleTrade} AccountBalance={AccountBalance} />

      {/* Trade Confirmation Modal */}
      <TradeConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // order={currentOrder}
        onConfirm={handleConfirmTrade}
        high={highPrice}
        low={lowPrice}
        volume={volume}
        change={(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
      />
    </div>
  );
}
