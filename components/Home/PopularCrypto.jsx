"use client";

import MarketTable from "../common/MarketTable";
import { contextProvider } from "@/contexts/Context";
import { useContext } from "react";
import { marketData } from "@/constant/marketArr";
import Image from "next/image";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";

const PopularCrypto = () => {
  const { markets } = useContext(contextProvider);

  return (
    <div className="container py-5 md:py-16 lg:py-20">
      <div className="flex items-center justify-between mb-4 md:mb-12">
        <div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-2">
            Popular Cryptocurrencies
          </h2>
        </div>
        <Link
          prefetch
          href="/markets"
          className="hidden md:inline-flex items-center gap-2 text-primary-200 dark:text-primary font-semibold hover:gap-3 transition-all duration-300 group"
        >
          View All <BiRightArrowAlt className="text-xl group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Mobile Card Grid */}
      <div className=" grid-cols-1 sm:grid-cols-2 hidden gap-4 mb-6">
        {marketData.slice(0, 6).map((item) => {
          const symbol = item.symbol;
          const data = markets[symbol];
          const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
          
          return (
            <Link
              key={item.symbol}
              prefetch
              href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={item?.icon}
                    alt={item.symbol}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-black dark:text-white text-sm">
                      {item.symbol.replace("USDT", "")}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.subname}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-lg text-black dark:text-white">
                  {data?.price ? `$${parseFloat(data.price).toLocaleString()}` : (
                    <span className="text-gray-400 animate-pulse text-sm">Loading...</span>
                  )}
                </div>
                <div
                  className={`text-sm font-medium ${
                    isPositiveChange ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositiveChange && <span>+</span>}
                  {data?.change ? `${data.change}%` : "--"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="">
        <MarketTable ss={0} se={12} />
      </div>

      {/* Mobile View All Link */}
      <div className="lg:hidden text-center mt-6">
        <Link
          prefetch
          href="/markets"
          className="inline-flex items-center gap-2 text-primary-200 dark:text-primary font-semibold hover:gap-3 transition-all duration-300 group"
        >
          View All Markets <BiRightArrowAlt className="text-xl group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default PopularCrypto;
