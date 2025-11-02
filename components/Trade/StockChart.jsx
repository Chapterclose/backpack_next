"use client";

import { createChart } from "lightweight-charts";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

const INTERVALS = [
  { value: "1m", label: "1m", limit: 200 },
  { value: "5m", label: "5m", limit: 200 },
  { value: "15m", label: "15m", limit: 200 },
  { value: "1h", label: "1h", limit: 200 },
  { value: "1d", label: "1d", limit: 100 },
];

function StockChart({
  currentCandleData,
  stockChartLegendData,
  hoveredSetCandleData,
  setCurrentCandleData,
  coin,
}) {
  const { resolvedTheme } = useTheme();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const wsRef = useRef(null);
  const tradeWsRef = useRef(null);
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [isConnected, setIsConnected] = useState(false);
  const currentCandleRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !coin) return;

    const bgColor = resolvedTheme === "dark" ? "#161A1E" : "#ffffff";
    const textColor = resolvedTheme === "dark" ? "#848e9c" : "#848e9c";
    const lineColor = resolvedTheme === "dark" ? "#2b3139" : "#e9ecf2";

    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: lineColor },
        horzLines: { color: lineColor },
      },
      width: chartRef.current.clientWidth,
      height: 400,
    });

    chartInstanceRef.current = chart;

    chart.priceScale("right").applyOptions({
      borderColor: lineColor,
    });

    chart.timeScale().applyOptions({
      borderColor: lineColor,
      timeVisible: true,
    });

    const mainSeries = chart.addCandlestickSeries({
      wickUpColor: "#2EBD85",
      upColor: "#2EBD85",
      wickDownColor: "#e13255",
      downColor: "#e13255",
    });

    mainSeriesRef.current = mainSeries;

    const updateLegend = (param) => {
      if (param && param.time && param.seriesData) {
        const data = param.seriesData.get(mainSeries);
        if (data) hoveredSetCandleData(data);
      } else {
        hoveredSetCandleData(null);
      }
    };

    chart.subscribeCrosshairMove(updateLegend);

    const handleResize = () => {
      if (chartRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.resize(
          chartRef.current.clientWidth,
          chartRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (wsRef.current) wsRef.current.close();
      if (tradeWsRef.current) tradeWsRef.current.close();
      chart.remove();
      chartInstanceRef.current = null;
      mainSeriesRef.current = null;
    };
  }, [resolvedTheme, coin, hoveredSetCandleData]);

  useEffect(() => {
    if (!chartInstanceRef.current || !mainSeriesRef.current || !coin) return;

    const interval = INTERVALS.find((i) => i.value === selectedInterval);
    if (!interval) return;

    const coinname = `${coin}usdt`;
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_URL;
    const wsUrl = process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL;

    if (!binanceUrl || !wsUrl) {
      console.error("Environment variables not set");
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (tradeWsRef.current) {
      tradeWsRef.current.close();
      tradeWsRef.current = null;
    }

    setIsConnected(false);
    currentCandleRef.current = null;

    fetch(
      `${binanceUrl}/api/v3/klines?symbol=${coinname.toUpperCase()}&interval=${selectedInterval}&limit=${
        interval.limit
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!mainSeriesRef.current || !Array.isArray(data) || data.length === 0) return;

        const historicalData = data.map((d) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        mainSeriesRef.current.setData(historicalData);
        chartInstanceRef.current.timeScale().fitContent();

        if (historicalData.length > 0) {
          const lastCandle = historicalData[historicalData.length - 1];
          currentCandleRef.current = lastCandle;
          setCurrentCandleData(lastCandle);
        }
      })
      .catch((err) => console.error("Fetch error:", err));

    const ws = new WebSocket(`${wsUrl}/ws/${coinname}@kline_${selectedInterval}`);

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.k && mainSeriesRef.current) {
          const candle = message.k;
          const newCandleData = {
            time: candle.t / 1000,
            open: parseFloat(candle.o),
            high: parseFloat(candle.h),
            low: parseFloat(candle.l),
            close: parseFloat(candle.c),
          };

          currentCandleRef.current = newCandleData;
          setCurrentCandleData(newCandleData);
          mainSeriesRef.current.update(newCandleData);

          chartInstanceRef.current.timeScale().scrollToRealTime();
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    if (selectedInterval === "1m") {
      const tradeWs = new WebSocket(`${wsUrl}/ws/${coinname}@trade`);
      tradeWsRef.current = tradeWs;

      let lastTradeUpdate = 0;
      tradeWs.onmessage = (event) => {
        const now = Date.now();
        if (now - lastTradeUpdate < 50) return; // Throttle to 50ms
        lastTradeUpdate = now;
        
        try {
          const message = JSON.parse(event.data);
          if (message.p && mainSeriesRef.current && currentCandleRef.current) {
            const tradePrice = parseFloat(message.p);
            const currentTime = Math.floor(Date.now() / 1000 / 60) * 60;

            if (currentCandleRef.current.time === currentTime) {
              const updatedCandle = {
                ...currentCandleRef.current,
                close: tradePrice,
                high: Math.max(currentCandleRef.current.high, tradePrice),
                low: Math.min(currentCandleRef.current.low, tradePrice),
              };

              currentCandleRef.current = updatedCandle;
              setCurrentCandleData(updatedCandle);
              mainSeriesRef.current.update(updatedCandle);
            }
          }
        } catch (err) {
          console.error("Trade WS error:", err);
        }
      };
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (tradeWsRef.current) tradeWsRef.current.close();
    };
  }, [selectedInterval, coin, setCurrentCandleData]);

  const candleColor =
    stockChartLegendData?.open > stockChartLegendData?.close ? "#e13255" : "#2EBD85";

  const changePercent = stockChartLegendData
    ? ((stockChartLegendData.close - stockChartLegendData.open) / stockChartLegendData.open) * 100
    : 0;

  return (
    <div className="relative dark:text-white bg-white dark:bg-[#161A1E] rounded-lg shadow-lg overflow-hidden">
      <div className="absolute top-2 left-2 z-30 flex gap-1 bg-black/50 dark:bg-white/10 backdrop-blur-sm rounded px-1 py-1">
        {INTERVALS.map((interval) => (
          <button
            key={interval.value}
            onClick={() => setSelectedInterval(interval.value)}
            className={`px-2 py-1 text-xs rounded ${
              selectedInterval === interval.value
                ? "bg-[#2EBD85] text-white font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {interval.label}
          </button>
        ))}
      </div>

      <div className="absolute top-2 right-2 z-30 flex items-center gap-2 text-xs">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        />
        <span className="text-gray-400">{isConnected ? "Live" : "Connecting..."}</span>
      </div>

      <div ref={chartRef} className="relative h-[400px] w-full" />

      {stockChartLegendData && (
        <div className="absolute bottom-2 left-2 z-20 flex flex-wrap gap-x-3 gap-y-1 text-xs bg-black/50 dark:bg-white/10 backdrop-blur-sm rounded px-2 py-1">
          <div className="flex flex-col">
            <span className="text-gray-400">Close</span>
            <span style={{ color: candleColor }} className="font-semibold">
              {stockChartLegendData.close?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">High</span>
            <span style={{ color: "#2EBD85" }} className="font-semibold">
              {stockChartLegendData.high?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Low</span>
            <span style={{ color: "#e13255" }} className="font-semibold">
              {stockChartLegendData.low?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Change</span>
            <span style={{ color: candleColor }} className="font-semibold">
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {currentCandleData?.close && (
        <div
          className="absolute top-10 right-2 z-20 font-bold text-lg transition-all"
          style={{
            color: currentCandleData.close >= stockChartLegendData?.open ? "#2EBD85" : "#e13255",
          }}
        >
          {currentCandleData.close.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default React.memo(StockChart);
