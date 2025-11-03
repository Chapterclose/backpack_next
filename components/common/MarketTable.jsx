"use client";

import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

function MarketTable({ ss, se }) {
  const { markets } = useContext(contextProvider);
  return (
    <div className="overflow-x-auto bg-white dark:bg-dark rounded-xl shadow-lg">
      <table className="min-w-full table-fixed">
        <thead className="lg:bg-gray-50 lg:dark:bg-gray-800/50 w-full">
          <tr>
            <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-1/3 md:w-auto">
              Name
            </th>
            <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[120px] lg:w-1/3">
              Price
            </th>
            <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[100px] lg:w-1/3">
              24h Change
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark">
          {marketData.slice(ss, se).map((item) => {
            const symbol = item.symbol;
            const data = markets[symbol];

            const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
            return (
              <tr
                key={symbol}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td className="px-4 md:px-6 py-4 whitespace-nowrap w-1/3 md:w-auto">
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
                      className="w-6 h-6 md:w-10 md:h-10 rounded-full mr-3 group-hover:scale-110 transition-transform duration-200"
                    />
                    <div>
                      <div className="text-sm md:text-base font-semibold text-black dark:text-white group-hover:text-primary transition-colors">
                        {item.symbol.replace("USDT", "")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.subname}</div>
                    </div>
                  </Link>
                </td>

                <td className="px-4 md:px-6 py-4 whitespace-nowrap w-[120px] lg:w-1/3">
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
                </td>

                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-left w-[100px] lg:w-1/3">
                  <button
                    className={`inline-block p-[5px_15px] rounded whitespace-nowrap text-sm md:text-base font-semibold w-full max-w-[100px] ${
                      isPositiveChange ? "text-green-500 bg-[#202d24]" : "text-red-500 bg-[#412a2d]"
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
