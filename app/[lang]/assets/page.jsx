"use client";

import AccountSummary from "@/components/assets/AccountSummary";
import AssetDetails from "@/components/assets/AssetDetails";
import Button from "@/components/Form/Button";
import { contextProvider } from "@/contexts/Context";
import UserStore from "@/store/UserStore";
import { useContext, useEffect, useState } from "react";

function AssetsPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [prices, setPrices] = useState({ USDT: 1, BTC: null, ETH: null });
  const { walletAddress, connectWallet, totalAvailableBalance, setTotalAvailableBalance } =
    useContext(contextProvider);
  const { GetAccountBalanceRequest, AccountBalance } = UserStore();
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
  }, [AccountBalance, prices]);

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
