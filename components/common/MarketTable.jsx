"use client"

import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

function MarketTable({ss,se}) {
    const {markets} = useContext(contextProvider)
    return ( 
        <div className="overflow-x-auto bg-white dark:bg-dark">
                <table className="min-w-full">
                    <thead className="">
                    <tr>
                        <th className="px-1 md:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                        </th>
                        <th className="px-1 md:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                        </th>
                        <th className="px-1 md:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        24h Change
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark">
                    {marketData.slice(ss, se).map((item) => {
                        const symbol = item.symbol;
                        const data = markets[symbol];

                        // Determine if the change is positive
                        const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
                        return (
                            <tr key={symbol} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-1 md:px-2 lg:px-6 py-4 whitespace-nowrap">
                                <Link href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`} className="flex items-center">
                                    <Image src={item?.icon} alt="icon" width={30} height={30} className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]" />
                                    <div className="ml-4">
                                        <div className="text-base lg:text-lg font-medium text-black dark:text-white">{item.symbol}</div>
                                    </div>
                                </Link>
                            </td>
                            <td className="px-1 md:px-2 lg:px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white font-semibold">
                                {data?.price ? `$${data.price}` : "Loading..."}
                            </td>
                            <td
                               className={`px-1 md:px-2 lg:px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                    isPositiveChange
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}  
                            >
                                {isPositiveChange && <span>+</span>} 
                                    {data?.change ? `${data.change}%` : "--"}
                            </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
        </div>
     );
}

export default React.memo(MarketTable);