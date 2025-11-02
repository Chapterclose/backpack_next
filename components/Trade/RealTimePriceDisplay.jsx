import { useState, useEffect } from "react";

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
  // Generate random initial price in range around 109976.67 (90000-120000)
  const [displayPrice, setDisplayPrice] = useState(() => {
    const randomPrice = (Math.random() * 30000 + 90000).toFixed(2);
    return randomPrice;
  });
  const [hasRealData, setHasRealData] = useState(false);

  // Update display price when real API data arrives
  useEffect(() => {
    const priceValue = parseFloat(currentPrice);
    if (priceValue > 0 && currentPrice !== "0.00" && currentPrice !== "0") {
      setDisplayPrice(currentPrice);
      setHasRealData(true);
    }
  }, [currentPrice]);

  const priceChangeColor = priceChangePercentage >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="shadow-lg dark:shadow-2xl rounded py-3 px-5 lg:px-10 dark:text-white">
      <h3 className="text-lg lg:text-xl font-semibold mb-3 uppercase">{coin}/usdt</h3>
      <div className="flex justify-between">
        <div className="mb-5 lg:mb-0">
          <h3
            className="text-3xl lg:text-5xl font-bold"
            style={{
              color: currentCandleData?.close >= stockChartLegendData?.open ? "#2EBD85" : "#e13255",
            }}
          >
            {displayPrice}
          </h3>
          <h4
            style={{
              color: currentCandleData?.close >= stockChartLegendData?.open ? "#2EBD85" : "#e13255",
            }}
            className={`${priceChangeColor} font-bold`}
          >
            {priceChangePercentage}%
          </h4>
        </div>

        <table className="w-full max-w-[140px]">
          <tbody>
            <tr>
              <td className="text-left py-1 pr-2 text-black dark:text-white">
                <h4>High</h4>
              </td>
              <td className="text-right py-1 font-semibold">
                <h4>{highPrice}</h4>
              </td>
            </tr>
            <tr>
              <td className="text-left py-1 pr-2 text-black dark:text-white">
                <h4>Low</h4>
              </td>
              <td className="text-right py-1 font-semibold">
                <h4>{lowPrice}</h4>
              </td>
            </tr>
            <tr>
              <td className="text-left py-1 pr-2 text-black dark:text-white">
                <h4>Vol</h4>
              </td>
              <td className="text-right py-1 font-semibold">
                <h4>{volume}</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RealTimePriceDisplay;
