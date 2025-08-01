"use client"

import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import Image from "next/image";
import { useContext } from "react";

function MarketTable({ss,se}) {
    const {markets} = useContext(contextProvider)
    return ( 
        <div className="overflow-x-auto bg-white">
                <table className="min-w-full">
                    <thead className="">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        24h Change
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {marketData.slice(ss, se).map((item, index) => {
                        const symbol = item.symbol;
                        const iconSrc = item.icon;
                        const data = markets[symbol];

                        // Determine if the change is positive
                        const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
                        return (
                            <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Image src={item?.icon} width={30} height={30} alt="icon" />
                                    <div className="ml-4">
                                    <div className="text-lg font-medium text-black">{item.symbol}</div>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-semibold">
                                {data?.price ? `$${data.price}` : "Loading..."}
                            </td>
                            <td
                               className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
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

export default MarketTable;