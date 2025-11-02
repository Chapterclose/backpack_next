"use client";

import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

function MarketTable({ ss, se }) {
  const { markets } = useContext(contextProvider);
  return (
    <div className="overflow-x-auto bg-white dark:bg-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              24h Change
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark divide-y divide-gray-200 dark:divide-gray-700">
          {marketData.slice(ss, se).map((item) => {
            const symbol = item.symbol;
            const data = markets[symbol];

            // Determine if the change is positive
            const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
            return (
              <tr 
                key={symbol} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <Link
                    prefetch
                    href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`}
                    className="flex items-center group"
                  >
                    <Image
                      src={item?.icon}
                      alt="icon"
                      width={40}
                      height={40}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 group-hover:scale-110 transition-transform duration-200"
                    />
                    <div>
                      <div className="text-sm md:text-base font-semibold text-black dark:text-white group-hover:text-primary transition-colors">
                        {item.symbol.replace("USDT", "")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.subname}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm md:text-base font-semibold text-black dark:text-white">
                    {data?.price ? `$${parseFloat(data.price).toLocaleString()}` : (
                      <span className="text-gray-400 animate-pulse">Loading...</span>
                    )}
                  </div>
                </td>
                <td
                  className={`px-4 md:px-6 py-4 whitespace-nowrap text-sm md:text-base font-semibold ${
                    isPositiveChange ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositiveChange && <span>+</span>}
                  {data?.change ? `${data.change}%` : "--"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(MarketTable);
