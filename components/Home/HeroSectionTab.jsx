"use client";
import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
const homePageTabs = [{ title: "Popular" }, { title: "New Listing" }];

const HeroSectionTab = () => {
  // Use shared markets data from Context (WebSocket connection is managed globally)
  const { markets } = useContext(contextProvider);
  
  return (
    <TabGroup manual defaultIndex={0}>
      <TabList className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {homePageTabs?.map((item) => (
          <Tab
            key={item.title}
            className="px-4 py-2 text-sm md:text-base font-semibold text-gray-500 dark:text-gray-400 data-[selected]:text-primary-200 dark:data-[selected]:text-primary data-[selected]:border-b-2 data-[selected]:border-primary transition-colors duration-200 focus:outline-none"
          >
            {item.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="space-y-3">
            {marketData?.slice(0, 4).map((item) => {
              const symbol = item.symbol;
              const data = markets[symbol];
              const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
              
              return (
                <Link
                  key={item.symbol}
                  prefetch
                  href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={item?.icon}
                        alt={item.symbol}
                        width={40}
                        height={40}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-black dark:text-white text-sm md:text-base">
                        {item.symbol.replace("USDT", "")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.subname}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-black dark:text-white text-sm md:text-base">
                      {data?.price ? `$${parseFloat(data.price).toLocaleString()}` : (
                        <span className="text-gray-400 animate-pulse">Loading...</span>
                      )}
                    </div>
                    <div
                      className={`text-xs md:text-sm font-medium ${
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
        </TabPanel>
        <TabPanel>
          <div className="space-y-3">
            {marketData?.slice(4, 8).map((item) => {
              const symbol = item.symbol;
              const data = markets[symbol];
              const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
              
              return (
                <Link
                  key={item.symbol}
                  prefetch
                  href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={item?.icon}
                        alt={item.symbol}
                        width={40}
                        height={40}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-black dark:text-white text-sm md:text-base">
                        {item.symbol.replace("USDT", "")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.subname}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-black dark:text-white text-sm md:text-base">
                      {data?.price ? `$${parseFloat(data.price).toLocaleString()}` : (
                        <span className="text-gray-400 animate-pulse">Loading...</span>
                      )}
                    </div>
                    <div
                      className={`text-xs md:text-sm font-medium ${
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
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default HeroSectionTab;
