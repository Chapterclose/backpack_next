"use client";

import { contextProvider } from "@/contexts/Context";
import { subscribeMarketStreams } from "@/lib/marketStream";
import UserStore from "@/store/UserStore";
import { useContext, useEffect, useState } from "react";

export default function useAssetBalance() {
  // State to store real-time prices for BTC, ETH, and USDT.
  const [prices, setPrices] = useState({ USDT: 1, BTC: null, ETH: null });

  // Access the totalAvailableBalance and its setter from the global context.
  const { totalAvailableBalance, setTotalAvailableBalance } = useContext(contextProvider);

  // Destructure the required functions and state from the UserStore hook.
  const { GetAccountBalanceRequest, AccountBalance } = UserStore();

  // Effect to fetch the user's account balance on component mount.
  useEffect(() => {
    GetAccountBalanceRequest();
  }, [GetAccountBalanceRequest]); // Depend on GetAccountBalanceRequest to avoid lint warnings.

  // Effect to subscribe to the live BTC and ETH trade streams for real-time prices.
  useEffect(() => {
    // Returns the unsubscribe function, which runs when the component unmounts.
    return subscribeMarketStreams(["btcusdt@trade", "ethusdt@trade"], (trade) => {
      const symbol = trade?.s;
      const price = parseFloat(trade?.p);

      if (symbol === "BTCUSDT") {
        setPrices((prev) => ({ ...prev, BTC: price }));
      } else if (symbol === "ETHUSDT") {
        setPrices((prev) => ({ ...prev, ETH: price }));
      }
    });
  }, []);

  // Effect to calculate the total balance whenever the account balance or prices change.
  useEffect(() => {
    // Exit if the account balance data is not yet available.
    if (!AccountBalance) {
      return;
    }

    // Safely parse the available balances, defaulting to 0 if they don't exist.
    const usdtAvailable = parseFloat(AccountBalance?.USDT?.available || "0");
    const btcAvailable = parseFloat(AccountBalance?.BTC?.available || "0");
    const ethAvailable = parseFloat(AccountBalance?.ETH?.available || "0");

    // Calculate the value of each asset.
    const usdtValue = usdtAvailable * prices.USDT;
    // Use optional chaining and default to 0 to prevent issues with null prices.
    const btcValue = btcAvailable * (prices.BTC || 0);
    const ethValue = ethAvailable * (prices.ETH || 0);

    // Sum the values to get the total available balance.
    const total = usdtValue + btcValue + ethValue;
    // Update the state in the global context.
    setTotalAvailableBalance(total);
  }, [AccountBalance, prices, setTotalAvailableBalance]); // Recalculate whenever AccountBalance or prices change.

  // The hook does not return a value as it sets the value in the context.
  return totalAvailableBalance;
}
