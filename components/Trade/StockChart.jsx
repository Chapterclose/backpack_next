"use client";

import { generateData } from "@/constant/stockChartRealTimeData";
import { createChart } from "lightweight-charts";
import moment from "moment/moment";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

function StockChart({highPrice, lowPrice, volume}) {
  const { __, resolvedTheme } = useTheme();

  const chartRef = useRef(null);
  const [hoverdCandleData, hoveredSetCandleData] = useState(null);
  const [currentCandleData, setCurrentCandleData] = useState(null);

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

    // Setting the border color for the vertical axis
    chart.priceScale("right").applyOptions({
      borderColor: stockChartColors.borderColor,
      ticksVisible: true,
    });

    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
      borderColor: stockChartColors.borderColor,
      ticksVisible: true,
    });

    chart.timeScale().fitContent();
    chart.timeScale().scrollToPosition(5);

    // Generate sample data to use within a candlestick series
    const candleStickData = generateData(2500, 20, 1000);

    // Create the Main Series (Candlesticks)
    const mainSeries = chart.addCandlestickSeries();
    // Set the data for the Main Series
    mainSeries.setData(candleStickData.initialData);

    // simulate real-time data
    function* getNextRealtimeUpdate(realtimeData) {
      for (const dataPoint of realtimeData) {
        yield dataPoint;
      }
      return null;
    }

    const streamingDataProvider = getNextRealtimeUpdate(
      candleStickData.realtimeUpdates
    );

    const intervalID = setInterval(() => {
      const update = streamingDataProvider.next();
      if (update.done) {
        clearInterval(intervalID);
        return;
      }
      setCurrentCandleData(update.value);
      mainSeries.update(update.value);
    }, 1000);

    // Changing the Candlestick colors
    mainSeries.applyOptions({
      wickUpColor: "#2EBD85",
      upColor: "#2EBD85",
      wickDownColor: "#e13255", //red color
      downColor: "#e13255",
      borderVisible: true,
    });

    const updateLegend = (param) => {
      const validCrosshairPoint = !(
        param === undefined || param.time === undefined
      );

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

    // Cleanup
    return () => {
      // resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalID);
      chart.remove();
    };
  }, [resolvedTheme]);

  const stockChartLegendData = hoverdCandleData || currentCandleData;
  const candleColor =
    stockChartLegendData?.open > stockChartLegendData?.close
      ? "#e13255"
      : "#2EBD85";
  return (
    <div
      ref={chartRef}
      style={{ width: "100%" }}
      className="relative dark:text-white h-[440px] border-gray-100   box-content mb-1"
    >
      <div className="absolute top-2 left-5 z-20 flex flex-col lg:flex-row w-full flex-wrap gap-x-2">
        <p className="text-secondary text-xs">
          {/* {moment(stockChartLegendData?.time).format("YYYY/MM/DD HH:mm")} */}
        </p>
        <p className="text-secondary text-xs">
          Vol:{" "}
          <span
            style={{
              color: candleColor,
            }}
          >
            {/* {stockChartLegendData?.open?.toFixed(2)} */}
            {volume}
          </span>
        </p>
        <p className="text-secondary text-xs">
          High:{" "}
          <span
            style={{
              color: candleColor,
            }}
          >
            {/* {stockChartLegendData?.high?.toFixed(2)} */}
            {highPrice}
          </span>
        </p>
        <p className="text-secondary text-xs">
          Low:{" "}
          <span
            style={{
              color: candleColor,
            }}
          >
            {/* {stockChartLegendData?.low?.toFixed(2)} */}
            {lowPrice}
          </span>
        </p>
        <p className="text-secondary text-xs">
          Close:{" "}
          <span
            style={{
              color: candleColor,
            }}
          >
            {stockChartLegendData?.close?.toFixed(2)}
          </span>
        </p>
        <p className="text-secondary text-xs">
          Change:{" "}
          <span
            style={{
              color: candleColor,
            }}
          >
            {(stockChartLegendData?.close - stockChartLegendData?.open).toFixed(
              2
            )}
          </span>
        </p>
        <p className="text-secondary text-xs">
          AMPLITUDE:{" "}
          <span
            style={{
              color: candleColor,
            }}
          >
            {(
              ((stockChartLegendData?.high - stockChartLegendData?.low) /
                stockChartLegendData?.low) *
              stockChartLegendData?.low
            ).toFixed(2)}{" "}
            %
          </span>
        </p>
      </div>
    </div>
  );
}

export default React.memo(StockChart);
