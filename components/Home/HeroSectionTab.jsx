"use client";
import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
const homePageTabs = [{ title: "Popular" }, { title: "New Listing" }];

const HeroSectionTab = () => {
  const { markets, setMarkets } = useContext(contextProvider);

  useEffect(() => {
    // Extract only the symbols for the WebSocket connection
    const watchedSymbols = marketData.map((data) => data.symbol);

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/ws/!ticker@arr`);

    ws.onmessage = (event) => {
      const updates = JSON.parse(event.data);

      const filtered = updates.filter((ticker) => watchedSymbols.includes(ticker.s));

      setMarkets((prev) => {
        const updated = { ...prev };
        filtered.forEach((ticker) => {
          updated[ticker.s] = {
            price: parseFloat(ticker.c).toFixed(2),
            change: parseFloat(ticker.P).toFixed(2),
          };
        });
        return updated;
      });
    };

    return () => ws.close();
  }, [setMarkets]);
  return (
    <TabGroup manual defaultIndex={0} className={"shadow-2xl p-3 lg:py-3 lg:px-5 rounded-lg"}>
      <TabList className="mb-5">
        {homePageTabs?.map((item) => (
          <Tab
            key={item.title}
            className="data-[selected]:text-black dark:data-[selected]:text-primary relative dark:text-white text-gray-500 font-semibold mr-5 focus:outline-none data-[selected]:before:absolute data-[selected]:before:bottom-[-5px] data-[selected]:before:left-1/2 data-[selected]:before:-translate-x-1/2 data-[selected]:before:bg-primary data-[selected]:before:w-6 data-[selected]:before:h-[3px] text-[16px] lg:text-xl cursor-pointer"
          >
            {item.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <table>
            <tbody>
              {marketData?.slice(0, 4).map((item) => {
                const symbol = item.symbol;
                const iconSrc = item.icon;
                const data = markets[symbol];

                // Determine if the change is positive
                const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
                return (
                  <tr key={item.symbol}>
                    <td className="pr-10">
                      <Link
                        href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`}
                        className="flex items-center gap-x-3 mb-2"
                      >
                        <Image
                          src={item?.icon}
                          alt="icon"
                          className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]"
                        />
                        <span className="text-black dark:text-white font-semibold text-[14px] lg:text-[16px]">
                          {item.symbol}
                        </span>
                      </Link>
                    </td>
                    <td className="px-7 text-black dark:text-white font-semibold">
                      {data?.price ? `$${data.price}` : "Loading..."}
                    </td>
                    <td
                      className={`font-semibold ${
                        isPositiveChange ? "text-green-600" : "text-red-500"
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
        </TabPanel>
        <TabPanel>
          <table>
            <tbody>
              {marketData?.slice(4, 8).map((item) => {
                const symbol = item.symbol;
                const iconSrc = item.icon;
                const data = markets[symbol];

                // Determine if the change is positive
                const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
                return (
                  <tr key={item.symbol}>
                    <td className="pr-10">
                      <Link
                        href={`/en/trade?symbol=${item.name.toLocaleLowerCase()}`}
                        className="flex items-center gap-x-3 mb-2"
                      >
                        <Image
                          src={item?.icon}
                          alt="icon"
                          className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]"
                        />
                        <span className="text-black dark:text-white font-semibold text-[14px] lg:text-[16px]">
                          {item.symbol}
                        </span>
                      </Link>
                    </td>
                    <td className="px-7 text-black dark:text-white font-semibold">
                      {data?.price ? `$${data.price}` : "Loading..."}
                    </td>
                    <td
                      className={`font-semibold ${
                        isPositiveChange ? "text-green-600" : "text-red-500"
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
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default HeroSectionTab;
