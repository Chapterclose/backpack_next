"use client";

import { marketData } from "@/constant/marketArr";
import { contextProvider } from "@/contexts/Context";
import { AmountWithCommas } from "@/lib/utils";
import UserStore from "@/store/UserStore";
import { motion } from "framer-motion";
import { LucideActivity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import { FaDollarSign, FaDownload, FaUpload, FaWallet } from "react-icons/fa";

function HeroSection() {
  const [prices, setPrices] = useState({ USDT: 1, BTC: null, ETH: null });
  const { walletAddress, connectWallet, markets, totalAvailableBalance, setTotalAvailableBalance } =
    useContext(contextProvider);
  const { GetAccountBalanceRequest, AccountBalance, isLoading } = UserStore();

  useEffect(() => {
    GetAccountBalanceRequest();
  }, [GetAccountBalanceRequest]);

  useEffect(() => {
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_URL;

    const fetchInitialPrices = async () => {
      try {
        // Fetch both prices in parallel for faster loading
        const [btcResponse, ethResponse] = await Promise.all([
          fetch(`${binanceUrl}/api/v3/ticker/price?symbol=BTCUSDT`),
          fetch(`${binanceUrl}/api/v3/ticker/price?symbol=ETHUSDT`),
        ]);

        const btcData = await btcResponse.json();
        const ethData = await ethResponse.json();

        setPrices({
          USDT: 1,
          BTC: parseFloat(btcData.price),
          ETH: parseFloat(ethData.price),
        });
      } catch (error) {
        console.error("Error fetching initial prices:", error);
        // Continue with WebSocket fallback
      }
    };

    fetchInitialPrices();

    // Then connect WebSocket for real-time updates
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/stream?streams=btcusdt@trade/ethusdt@trade`
    );

    let lastUpdate = 0;
    socket.onmessage = (event) => {
      const now = Date.now();
      if (now - lastUpdate < 500) return; // Throttle to 500ms
      lastUpdate = now;

      const msg = JSON.parse(event.data);
      const symbol = msg?.data?.s;
      const price = parseFloat(msg?.data?.p);

      if (symbol === "BTCUSDT") {
        setPrices((prev) => ({ ...prev, BTC: price }));
      } else if (symbol === "ETHUSDT") {
        setPrices((prev) => ({ ...prev, ETH: price }));
      }
    };

    socket.onerror = (error) => {
      console.error("Price WebSocket Error:", error);
    };

    return () => socket.close();
  }, []);

  // Calculate balance immediately when AccountBalance or prices change
  useEffect(() => {
    if (!AccountBalance) return;

    const usdtAvailable = parseFloat(AccountBalance?.USDT?.available || "0");
    const btcAvailable = parseFloat(AccountBalance?.BTC?.available || "0");
    const ethAvailable = parseFloat(AccountBalance?.ETH?.available || "0");

    const usdtValue = usdtAvailable * prices.USDT;
    // Use current prices, or 0 if not yet loaded (will update when prices arrive)
    const btcValue = btcAvailable * (prices.BTC || 0);
    const ethValue = ethAvailable * (prices.ETH || 0);

    const total = usdtValue + btcValue + ethValue;
    setTotalAvailableBalance(total);
  }, [AccountBalance, prices, setTotalAvailableBalance]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Action buttons for My Wallet section
  const walletActions = [
    { label: "Send", icon: FaUpload, href: "/withdraw" },
    { label: "Receive", icon: FaDownload, href: "/recharge-deposit" },
    { label: "Buy", icon: FaWallet, href: "/buy" },
    { label: "Convert", icon: FaDollarSign, href: "/convert" },
  ];

  const cardGradients = [
    "linear-gradient(146deg, rgb(135 122 0) 0%, rgb(51 51 6) 80%)",
    "linear-gradient(140deg, #8ba6ab 0%, #0d2727 80%)",
    "linear-gradient(140deg, #4d5259 0%, #000000 80%)",
  ];

  const chartColors = ["text-yellow-400", "text-green-500", "text-blue-500"];

  const primaryTextColors = ["text-yellow-400", "text-green-500", "text-blue-500"];

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-gray-800/5 to-transparent dark:from-gray-800/20 dark:via-gray-800/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div
        className="container relative z-10 py-2 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ************ My Wallet Section ************ */}
        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">My Assets</h2>
          <p className="text-4xl md:text-5xl font-bold mb-5">
            ${AmountWithCommas(totalAvailableBalance)}
          </p>

          {/* Wallet Action Buttons */}
          <div className="grid grid-cols-4 gap-4">
            {walletActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <Icon className="text-xl sm:text-2xl text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-300">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Separator */}
        <div className="border-b border-gray-700 my-1"></div>

        <motion.div variants={itemVariants} className="mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Market</h2>

          {/* Market Cards - Horizontal Scroll */}
          <div className="flex overflow-x-auto gap-4 py-2 no-scrollbar">
            {marketData?.slice(0, 3).map((item, index) => {
              const symbol = item.symbol;
              const data = markets[symbol];
              const isPositiveChange = data?.change && parseFloat(data.change) >= 0;
              const cardGradient = cardGradients[index % cardGradients.length];
              const chartColor = chartColors[index % chartColors.length];
              const primaryTextColor = primaryTextColors[index % primaryTextColors.length];

              const changeTextColor = isPositiveChange ? "text-green-500" : "text-red-500";

              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-[120px] md:w-[200px] p-4 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between"
                  style={{ background: cardGradient }}
                >
                  {/* Crypto Name & Icon */}
                  <div className="flex items-center mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2`}>
                      <Image
                        src={item?.icon}
                        alt={item.symbol}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs">{item.symbol.replace("USDT", "")}</h4>
                      <p className="text-xs text-gray-300">{item.subname}</p>
                    </div>
                  </div>

                  <div className="my-2 flex justify-center">
                    <LucideActivity className={`w-full h-5 ${chartColor}`} />
                  </div>

                  <div className="flex items-end justify-between">
                    <p className={`text-[10px] font-bold ${primaryTextColor}`}>
                      {`$${parseFloat(data?.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}`}
                    </p>
                    <div className={`text-[10px] font-medium ${changeTextColor}`}>
                      {isPositiveChange && <span>+</span>}
                      {data?.change ? `${data.change}%` : "--"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HeroSection;
