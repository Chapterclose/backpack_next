const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) {
    return "0.00";
  }

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toFixed(2);
};

function RealTimePriceDisplay({
  currentPrice,
  priceChangePercentage,
  highPrice,
  lowPrice,
  volume,
  coin,
  currentCandleData,
  stockChartLegendData,
}) {
  const priceChangeColor = priceChangePercentage >= 0 ? "text-green-500" : "text-red-500";
  const priceColor = currentCandleData?.close >= stockChartLegendData?.open ? "#2EBD85" : "#e13255";

  // Use dummy data if real data not available yet
  const displayPrice = currentPrice === "0.00" ? (stockChartLegendData?.close || 50000).toFixed(2) : currentPrice;
  const displayChange = priceChangePercentage === "0.00" ? (stockChartLegendData ? ((stockChartLegendData.close - stockChartLegendData.open) / stockChartLegendData.open * 100).toFixed(2) : "0.00") : priceChangePercentage;
  const displayHigh = highPrice === "0.00" ? (stockChartLegendData?.high || 51000).toFixed(2) : highPrice;
  const displayLow = lowPrice === "0.00" ? (stockChartLegendData?.low || 49000).toFixed(2) : lowPrice;
  const displayVolume = volume === 0 ? (stockChartLegendData ? formatNumber(stockChartLegendData.close * 1000) : "0") : formatNumber(volume);

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
      
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-black dark:text-white uppercase tracking-wide">
              {coin}/USDT
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm md:text-base font-semibold ${displayChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {displayChange >= 0 ? "+" : ""}{displayChange}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">24h</span>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-6">
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2" style={{ color: priceColor }}>
            ${parseFloat(displayPrice).toLocaleString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center md:text-left">
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">24h High</div>
            <div className="text-base md:text-lg font-semibold text-black dark:text-white">
              ${parseFloat(displayHigh).toLocaleString()}
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">24h Low</div>
            <div className="text-base md:text-lg font-semibold text-black dark:text-white">
              ${parseFloat(displayLow).toLocaleString()}
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">24h Volume</div>
            <div className="text-base md:text-lg font-semibold text-black dark:text-white">
              {displayVolume}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealTimePriceDisplay;
