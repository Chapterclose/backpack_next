"use client";

import AccountSummary from "@/components/assets/AccountSummary";
import AssetDetails from "@/components/assets/AssetDetails";
import Button from "@/components/Form/Button";
import { contextProvider } from "@/contexts/Context";
import UserStore from "@/store/UserStore";
import { useContext, useEffect, useState } from "react";

// Skeleton component for the loading state
const AssetsPageSkeleton = () => (
  <div className="container py-[80px] dark:text-gray-200 animate-pulse">
    {/* Account Summary Skeleton */}
    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg p-6 mb-8 flex flex-col justify-between">
      <div>
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>

    {/* Asset Details Skeleton */}
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-8 w-1/6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 py-4 border-b border-gray-300 dark:border-gray-600 last:border-b-0"
        >
          <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function AssetsPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [prices, setPrices] = useState({ USDT: 1, BTC: null, ETH: null });
  const [isBalanceCalculated, setIsBalanceCalculated] = useState(false);
  const { walletAddress, connectWallet, totalAvailableBalance, setTotalAvailableBalance } =
    useContext(contextProvider);
  const { GetAccountBalanceRequest, AccountBalance, isLoading } = UserStore();
  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  useEffect(() => {
    GetAccountBalanceRequest();
  }, []);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade"
    );

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const symbol = msg?.data?.s;
      const price = parseFloat(msg?.data?.p);

      if (symbol === "BTCUSDT") {
        setPrices((prev) => ({ ...prev, BTC: price }));
      } else if (symbol === "ETHUSDT") {
        setPrices((prev) => ({ ...prev, ETH: price }));
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    if (!AccountBalance) return;

    const usdtAvailable = parseFloat(AccountBalance?.USDT?.available || "0");
    const btcAvailable = parseFloat(AccountBalance?.BTC?.available || "0");
    const ethAvailable = parseFloat(AccountBalance?.ETH?.available || "0");

    const usdtValue = usdtAvailable * prices.USDT;
    const btcValue = btcAvailable * (prices.BTC || 0);
    const ethValue = ethAvailable * (prices.ETH || 0);

    const total = usdtValue + btcValue + ethValue;
    setTotalAvailableBalance(total);

    // Set a timeout to delay the transition
    setTimeout(() => {
      setIsBalanceCalculated(true);
    }, 1500); // 1-second delay
  }, [AccountBalance, prices]);

  // Conditional rendering for skeleton loader
  if (walletAddress !== "" && (!isBalanceCalculated || isLoading)) {
    return <AssetsPageSkeleton />;
  }

  return (
    <>
      {walletAddress !== "" ? (
        <div className="container py-[80px] dark:text-white">
          <AccountSummary
            totalAvailableBalance={totalAvailableBalance}
            showBalance={showBalance}
            toggleBalanceVisibility={toggleBalanceVisibility}
          />
          <AssetDetails showBalance={showBalance} />
        </div>
      ) : (
        <div className="flex flex-col text-center items-center justify-center py-[60px] lg:py-[100px] px-5 lg:px-0">
          <h2 className="text-3xl lg:text-4xl font-semibold capitalize mb-5 dark:text-white">
            Let's start you crypto journey with us.
          </h2>
          <Button text={"Connect Now"} handleFunc={connectWallet} />
        </div>
      )}
    </>
  );
}

export default AssetsPage;
