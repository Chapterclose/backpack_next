"use client";

import AccountSummary from "@/components/assets/AccountSummary";
import AssetDetails from "@/components/assets/AssetDetails";
import Button from "@/components/Form/Button";
import { contextProvider } from "@/contexts/Context";
import { subscribeMarketStreams } from "@/lib/marketStream";
import UserStore from "@/store/UserStore";
import { useContext, useEffect, useState } from "react";
import { BiWallet } from "react-icons/bi";

// Skeleton component for the loading state
const AssetsPageSkeleton = () => (
  <div className="container py-12 md:py-16 lg:py-20">
    <div className="animate-pulse space-y-8">
      {/* Account Summary Skeleton */}
      <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-2xl p-6 md:p-8"></div>
      {/* Asset Details Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

function AssetsPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [prices, setPrices] = useState({ USDT: 1, BTC: null, ETH: null });
  const { walletAddress, connectWallet, totalAvailableBalance, setTotalAvailableBalance } =
    useContext(contextProvider);
  const { GetAccountBalanceRequest, AccountBalance, isLoading } = UserStore();
  
  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  // Fetch account balance immediately
  useEffect(() => {
    GetAccountBalanceRequest();
  }, [GetAccountBalanceRequest]);

  // Fetch initial BTC/ETH prices via REST API immediately (much faster than waiting for the live stream)
  useEffect(() => {
    
    const fetchInitialPrices = async () => {
      try {
        // Fetch both prices in parallel for faster loading
        const [btcResponse, ethResponse] = await Promise.all([
          fetch(`/api/v3/ticker/price?symbol=BTCUSDT`),
          fetch(`/api/v3/ticker/price?symbol=ETHUSDT`)
        ]);

        const btcData = await btcResponse.json();
        const ethData = await ethResponse.json();

        setPrices({
          USDT: 1,
          BTC: parseFloat(btcData.price),
          ETH: parseFloat(ethData.price)
        });
      } catch (error) {
        console.error("Error fetching initial prices:", error);
        // Continue with the live stream as a fallback
      }
    };

    fetchInitialPrices();

    // Then subscribe to the live stream for real-time updates
    let lastUpdate = 0;
    return subscribeMarketStreams(["btcusdt@trade", "ethusdt@trade"], (trade) => {
      const now = Date.now();
      if (now - lastUpdate < 500) return; // Throttle to 500ms
      lastUpdate = now;

      const symbol = trade?.s;
      const price = parseFloat(trade?.p);

      if (symbol === "BTCUSDT") {
        setPrices((prev) => ({ ...prev, BTC: price }));
      } else if (symbol === "ETHUSDT") {
        setPrices((prev) => ({ ...prev, ETH: price }));
      }
    });
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

  if (walletAddress !== "" && isLoading) {
    return <AssetsPageSkeleton />;
  }

  return (
    <div className="container py-5 md:py-12 lg:py-16">
      {walletAddress !== "" ? (
        <>
          <AccountSummary
            totalAvailableBalance={totalAvailableBalance}
            showBalance={showBalance}
            toggleBalanceVisibility={toggleBalanceVisibility}
          />
          <AssetDetails showBalance={showBalance} />
        </>
      ) : (
        <div className="relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col items-center justify-center py-20 md:py-32 px-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-primary rounded-full flex items-center justify-center mb-6 shadow-xl">
              <BiWallet className="text-5xl text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Start Your Crypto Journey
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              Connect your wallet to view and manage your crypto assets
            </p>
            <Button 
              text="Connect Wallet" 
              handleFunc={connectWallet}
              className="px-8 py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetsPage;
