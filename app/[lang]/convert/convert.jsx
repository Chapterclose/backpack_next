"use client";

import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdImg from "@/assets/markets/usdt.png";
import Heading from "@/components/common/Heading";
import Button from "@/components/Form/Button";
import UserStore from "@/store/UserStore";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const ConvertPage = () => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("BTC");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [exchangeRates, setExchangeRates] = useState({
    BTC: { USDT: 0, ETH: 0 },
    ETH: { USDT: 0, BTC: 0 },
    USDT: { BTC: 0, ETH: 0 },
  });

  const [isLoading, setIsLoading] = useState(true);
  const { GetAccountBalanceRequest, AccountBalance, ConvertBalanceRequest } = UserStore();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFromDropdownOpen && !event.target.closest(".from-dropdown-container")) {
        setIsFromDropdownOpen(false);
      }
      if (isToDropdownOpen && !event.target.closest(".to-dropdown-container")) {
        setIsToDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFromDropdownOpen, isToDropdownOpen]);

  // Call account balance API
  useEffect(() => {
    GetAccountBalanceRequest();
  }, [GetAccountBalanceRequest]);

  const availableBalances = {
    USDT: AccountBalance?.USDT?.available || "0",
    ETH: AccountBalance?.ETH?.available || "0",
    BTC: AccountBalance?.BTC?.available || "0",
  };

  // WebSocket live prices with reconnection logic
  // WebSocket live prices with reconnection logic
  useEffect(() => {
    let ws = null;
    const connectWebSocket = () => {
      ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/stream?streams=btcusdt@trade/ethusdt@trade/ethbtc@trade`
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (!msg.data || !msg.stream) return;

        const price = parseFloat(msg.data.p);

        setIsLoading(false);

        setExchangeRates((prev) => {
          const updated = { ...prev };

          switch (msg.stream) {
            case "btcusdt@trade":
              updated.BTC.USDT = price;
              updated.USDT.BTC = 1 / price;
              break;
            case "ethusdt@trade":
              updated.ETH.USDT = price;
              updated.USDT.ETH = 1 / price;
              break;
            case "ethbtc@trade":
              updated.ETH.BTC = price;
              updated.BTC.ETH = 1 / price;
              break;
          }

          return updated;
        });
      };

      ws.onclose = () => setTimeout(connectWebSocket, 3000);
      ws.onerror = (err) => ws.close();
    };

    connectWebSocket();
    return () => ws?.close();
  }, []);

  // Conversion calculation
  const calculateConversion = useCallback(() => {
    const fromVal = parseFloat(fromValue);
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 0;

    if (!isNaN(fromVal) && rate > 0) {
      setToValue((fromVal * rate).toFixed(8));
    } else {
      setToValue("");
    }
  }, [fromValue, fromCurrency, toCurrency, exchangeRates]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  // Swap function
  const handleSwap = () => {
    if (!isFromDropdownOpen && !isToDropdownOpen) {
      const tempCurrency = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(tempCurrency);

      const tempValue = fromValue;
      setFromValue(toValue);
      setToValue(tempValue);
    }
  };

  // Select currency
  const handleSelectCurrency = (currency, type) => {
    if (type === "from") {
      setFromCurrency(currency);
      setIsFromDropdownOpen(false);
    } else {
      setToCurrency(currency);
      setIsToDropdownOpen(false);
    }
    setSuccessMessage("");
  };

  // Confirm button
  const handleConfirm = async () => {
    const amount = parseFloat(fromValue);
    const availableBalance = parseFloat(
      availableBalances[fromCurrency].toString().replace(/,/g, "")
    );

    if (availableBalance <= 0) {
      toast.error(`You have no available balance of ${fromCurrency} to convert.`);
      return;
    }
    if (amount > availableBalance) {
      toast.error(`The amount entered exceeds your available ${fromCurrency} balance.`);
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setSuccessMessage("Please enter a valid amount to convert.");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    const currentRate = exchangeRates[fromCurrency]?.[toCurrency] || null;

    // Dynamically set current_market_prices
    let current_market_prices;
    if (fromCurrency === "BTC" || fromCurrency === "ETH") {
      current_market_prices = exchangeRates[fromCurrency]?.USDT || "N/A";
    } else if (toCurrency === "BTC" || toCurrency === "ETH") {
      current_market_prices = exchangeRates[toCurrency]?.USDT || "N/A";
    } else {
      current_market_prices = {
        BTC_USDT: exchangeRates.BTC?.USDT || "N/A",
        ETH_USDT: exchangeRates.ETH?.USDT || "N/A",
      };
    }
    const body = {
      from_asset: fromCurrency,
      to_asset: toCurrency,
      from_amount: amount,
      to_amount: currentRate,
    };
    const res = await ConvertBalanceRequest(body);
    if (res.status === 200) {
      await GetAccountBalanceRequest();
      toast.success(res?.data?.message);
      setSuccessMessage("Conversion successful!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setFromValue("");
      setToValue("");
    }
  };

  const currencies = [
    { name: "USDT", symbol: usdImg },
    { name: "BTC", symbol: btcImg },
    { name: "ETH", symbol: ethImg },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 dark:bg-dark min-h-screen py-10 px-5 font-inter text-gray-700 dark:text-gray-300">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-gray-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg">Loading Convert...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 dark:bg-dark min-h-screen py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Heading text={"Convert"} />

        {/* Available Balance Display */}
        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {parseFloat(availableBalances[fromCurrency]).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available balance ({fromCurrency})
          </p>
        </div>

        {/* From Currency Input */}
        <div className="relative mb-5 from-dropdown-container">
          <div
            className={twMerge(
              "flex items-center justify-between px-4 py-3",
              "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm",
              "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <input
              type="number"
              placeholder="Please enter"
              className={twMerge(
                "bg-transparent text-xl font-medium w-full outline-none",
                "placeholder-gray-400 text-gray-900 dark:text-gray-100"
              )}
              value={fromValue}
              onChange={(e) => {
                setFromValue(e.target.value);
                setSuccessMessage("");
              }}
            />
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                className="text-xs text-green-500 font-semibold uppercase hover:text-green-600"
                onClick={() => setFromValue(availableBalances[fromCurrency].replace(/,/g, ""))}
              >
                Max
              </button>
              <div
                className="flex items-center cursor-pointer space-x-1"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="text-md font-bold text-gray-900 dark:text-gray-100 min-w-[75px] text-right">
                  {fromCurrency}
                </span>
                <Image
                  src={currencies.find((c) => c.name === fromCurrency)?.symbol}
                  className="w-[20px] h-[20px]"
                  alt={fromCurrency}
                />
              </div>
            </div>
          </div>
          {isFromDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
              {currencies
                .filter((c) => c.name !== toCurrency)
                .map((currency) => (
                  <div
                    key={currency.name}
                    className="flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => handleSelectCurrency(currency.name, "from")}
                  >
                    <Image
                      src={currency.symbol}
                      className="w-[20px] h-[20px]"
                      alt={currency.name}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {currency.name}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Currency Output */}
        <div className="relative to-dropdown-container">
          <div
            className={twMerge(
              "flex items-center justify-between px-4 py-3",
              "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm",
              "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <input
              type="text"
              readOnly
              className="bg-transparent text-xl font-medium w-full outline-none text-gray-900 dark:text-gray-100"
              value={toValue}
            />
            <div
              className="flex items-center cursor-pointer space-x-1 flex-shrink-0"
              onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
            >
              <span className="text-md font-bold text-gray-900 dark:text-gray-100 min-w-[75px] text-right">
                {toCurrency}
              </span>
              <Image
                src={currencies.find((c) => c.name === toCurrency)?.symbol}
                className="w-[20px] h-[20px]"
                alt={toCurrency}
              />
            </div>
          </div>
          {isToDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
              {currencies
                .filter((c) => c.name !== fromCurrency)
                .map((currency) => (
                  <div
                    key={currency.name}
                    className="flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => handleSelectCurrency(currency.name, "to")}
                  >
                    <Image
                      src={currency.symbol}
                      className="w-[20px] h-[20px]"
                      alt={currency.name}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {currency.name}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Exchange Rate Display */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Today's exchange rate: 1 {fromCurrency} ={" "}
          {exchangeRates[fromCurrency]?.[toCurrency] > 0
            ? exchangeRates[fromCurrency][toCurrency].toFixed(8)
            : "N/A"}{" "}
          {toCurrency}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 p-3 text-center text-sm font-medium rounded-lg bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
            {successMessage}
          </div>
        )}

        <Button text={"Confirm"} className={"w-full mt-10"} handleFunc={handleConfirm} />
      </div>
    </div>
  );
};

export default ConvertPage;
