import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import Image from "next/image";
import React, { useContext } from "react";

function MarketSlide() {
  const { markets } = useContext(contextProvider);

  const renderMarketItem = (item, i) => {
    const symbol = item.symbol;
    const data = markets[symbol];
    const isPositiveChange = data?.change && parseFloat(data.change) >= 0;

    return (
      <div key={i} className="flex items-center gap-x-2 shrink-0 pr-10">
        {" "}
        <Image
          src={item?.icon}
          alt="icon"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full group-hover:scale-110 transition-transform duration-200"
        />
        <div className="text-sm md:text-base font-semibold text-black dark:text-white">
          {data?.price ? (
            `$${Number(data.price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}`
          ) : (
            <span className="text-gray-400 animate-pulse">Loading...</span>
          )}
        </div>
        <div>
          <button
            className={`inline-block rounded whitespace-nowrap text-sm md:text-base font-semibold ${
              isPositiveChange ? "text-green-500" : "text-red-500"
            } transition-colors duration-150`}
          >
            {data?.change ? (
              <>
                {isPositiveChange && <span>+</span>}
                {`${data.change}%`}
              </>
            ) : (
              <span className="opacity-0">--</span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="market-slider overflow-hidden relative mb-5">
      <div className="slide-track flex items-center">
        {marketData?.map((item, i) => renderMarketItem(item, `first-${i}`))}

        {marketData?.map((item, i) => renderMarketItem(item, `second-${i}`))}
      </div>
    </div>
  );
}

export default React.memo(MarketSlide);
