"use client";

import { createChart } from "lightweight-charts";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

function StockChart({
  highPrice,
  lowPrice,
  volume,
  hoverdCandleData,
  currentCandleData,
  stockChartLegendData,
  hoveredSetCandleData,
  setCurrentCandleData,
  coin,
}) {
  const { __, resolvedTheme } = useTheme();

  const chartRef = useRef(null);

  const stockChartColors =
    resolvedTheme === "dark"
      ? {
          background: "#161A1E",
          textColor: "#848e9c",
          linesColor: "#2b3139",
          borderColor: "#2b3139",
        }
      : {
          background: "#ffffff",
          textColor: "#848e9c",
          linesColor: "#e9ecf2",
          borderColor: "#e9ecf2",
        };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: stockChartColors.background },
        textColor: stockChartColors.textColor,
      },
      grid: {
        vertLines: { color: stockChartColors.linesColor },
        horzLines: { color: stockChartColors.linesColor },
      },
    });

    chart.priceScale("right").applyOptions({
      borderColor: stockChartColors.borderColor,
      ticksVisible: true,
    });

    chart.timeScale().applyOptions({
      borderColor: stockChartColors.borderColor,
      ticksVisible: true,
    });

    const mainSeries = chart.addCandlestickSeries();

    mainSeries.applyOptions({
      wickUpColor: "#2EBD85",
      upColor: "#2EBD85",
      wickDownColor: "#e13255",
      downColor: "#e13255",
      borderVisible: true,
    });

    const coinname = `${coin}usdt`;
    const dailyInterval = "1d";
    const realtimeInterval = "1m";

    // 1. Fetch historical daily data first
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${coinname.toUpperCase()}&interval=${dailyInterval}&limit=30`
    )
      .then((response) => response.json())
      .then((data) => {
        const historicalData = data.map((d) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        mainSeries.setData(historicalData);
        // Remove left-side space by calling fitContent after data is loaded
        chart.timeScale().fitContent();
      })
      .catch((error) => console.error("Error fetching historical data:", error));

    // 2. Connect to the WebSocket for real-time 1-minute data
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coinname}@kline_${realtimeInterval}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.k) {
        const candle = message.k;
        const newCandleData = {
          time: candle.t / 1000,
          open: parseFloat(candle.o),
          high: parseFloat(candle.h),
          low: parseFloat(candle.l),
          close: parseFloat(candle.c),
        };
        setCurrentCandleData(newCandleData);
        mainSeries.update(newCandleData);
      }
    };

    const updateLegend = (param) => {
      const validCrosshairPoint = !(param === undefined || param.time === undefined);

      if (validCrosshairPoint) {
        const data = param.seriesData.get(mainSeries);
        hoveredSetCandleData(data);
      } else {
        hoveredSetCandleData(null);
      }
    };

    chart.subscribeCrosshairMove(updateLegend);

    const handleResize = () => {
      chart.resize(chartRef.current.clientWidth, chartRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ws.close();
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [resolvedTheme, coin]);

  const candleColor =
    stockChartLegendData?.open > stockChartLegendData?.close ? "#e13255" : "#2EBD85";

  // The JSX for the price indicator remains the same
  return (
    <div
      ref={chartRef}
      style={{ width: "100%" }}
      className="relative dark:text-white h-[440px] border-gray-100   box-content mb-1"
    >
      <div className="absolute top-2 left-5 z-20 flex flex-col lg:flex-row w-full flex-wrap gap-x-2">
        <p className="text-secondary text-xs"> </p>
        <p className="text-secondary text-xs">
          Vol: <span style={{ color: candleColor }}>{volume}</span>
        </p>
        <p className="text-secondary text-xs">
          High: <span style={{ color: candleColor }}>{highPrice}</span>
        </p>
        <p className="text-secondary text-xs">
          Low: <span style={{ color: candleColor }}>{lowPrice}</span>
        </p>
        <p className="text-secondary text-xs">
          Close:{" "}
          <span style={{ color: candleColor }}>{stockChartLegendData?.close?.toFixed(2)}</span>
        </p>
        <p className="text-secondary text-xs">
          Change:{" "}
          <span style={{ color: candleColor }}>
            {(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(2)}
          </span>
        </p>
        <p className="text-secondary text-xs">
          AMPLITUDE:{" "}
          <span style={{ color: candleColor }}>
            {(
              ((stockChartLegendData?.high - stockChartLegendData?.low) /
                stockChartLegendData?.low) *
              stockChartLegendData?.low
            ).toFixed(2)}{" "}
            %{" "}
          </span>
        </p>
      </div>
      {/* Real-time price indicator */}
      {currentCandleData?.close && (
        <div
          className="absolute top-8 right-2 lg:right-5 z-20 font-bold"
          style={{
            color: currentCandleData.close >= stockChartLegendData?.open ? "#2EBD85" : "#e13255",
          }}
        >
          <span>{currentCandleData.close?.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

export default React.memo(StockChart);
