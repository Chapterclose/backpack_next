"use client";

import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdImg from "@/assets/markets/usdt.png";
import Heading from "@/components/common/Heading";
import Button from "@/components/Form/Button";
import { AmountWithCommas } from "@/lib/utils";
import UserStore from "@/store/UserStore";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const ConvertPage = () => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("0.0000000");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("BTC");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rates, setRates] = useState({ USDT: 1, BTC: 0, ETH: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const { GetAccountBalanceRequest, AccountBalance, ConvertBalanceRequest } = UserStore();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (isFromDropdownOpen && !e.target.closest(".from-dropdown-container")) {
        setIsFromDropdownOpen(false);
      }
      if (isToDropdownOpen && !e.target.closest(".to-dropdown-container")) {
        setIsToDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isFromDropdownOpen, isToDropdownOpen]);

  // Fetch account balances
  useEffect(() => {
    GetAccountBalanceRequest();
  }, [GetAccountBalanceRequest]);

  const availableBalances = {
    USDT: AccountBalance?.USDT?.available || "0",
    ETH: AccountBalance?.ETH?.available || "0",
    BTC: AccountBalance?.BTC?.available || "0",
  };

  // Fetch BTC & ETH static prices from Binance REST once
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [btcRes, ethRes] = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"),
        ]);

        const btcData = await btcRes.json();
        const ethData = await ethRes.json();

        const btcPrice = parseFloat(btcData.price);
        const ethPrice = parseFloat(ethData.price);

        setRates({ USDT: 1, BTC: btcPrice, ETH: ethPrice });
      } catch (err) {
        console.error("Error fetching Binance prices:", err);
        toast.error("Failed to fetch market prices. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const calculateConversion = useCallback(() => {
    const val = parseFloat(fromValue);
    if (!isNaN(val) && rates[fromCurrency] > 0 && rates[toCurrency] > 0) {
      const result = (val * rates[fromCurrency]) / rates[toCurrency];
      setToValue(result.toFixed(7));
    } else {
      setToValue("");
    }
  }, [fromValue, fromCurrency, toCurrency, rates]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const handleSwap = () => {
    if (!isFromDropdownOpen && !isToDropdownOpen) {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setFromValue(toValue);
      setToValue(fromValue);
    }
  };

  const handleSelectCurrency = (currency, type) => {
    type === "from" ? setFromCurrency(currency) : setToCurrency(currency);
    type === "from" ? setIsFromDropdownOpen(false) : setIsToDropdownOpen(false);
    setSuccessMessage("");
  };

  const handleConfirm = async () => {
    const amount = parseFloat(fromValue);
    const avail = parseFloat(availableBalances[fromCurrency].replace(/,/g, ""));
    if (avail <= 0) {
      toast.error(`No available balance of ${fromCurrency}.`);
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setSuccessMessage("Please enter a valid amount.");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    if (amount > avail) {
      toast.error(`Amount exceeds available ${fromCurrency} balance.`);
      return;
    }

    const rate = (1 * rates[fromCurrency]) / rates[toCurrency];
    const body = {
      from_asset: fromCurrency,
      to_asset: toCurrency,
      from_amount: amount,
      to_amount: (amount * rate).toFixed(8),
    };
    const res = await ConvertBalanceRequest(body);
    if (res.status === 200) {
      await GetAccountBalanceRequest();
      toast.success(res.data?.message);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark text-gray-700 dark:text-gray-300">
        <p>Loading prices...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark font-inter">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Heading text="Convert" />

        <div className="text-center mb-6">
          <p className="text-5xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {AmountWithCommas(availableBalances[fromCurrency],fromCurrency)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available balance ({fromCurrency})
          </p>
        </div>

        {/* From Input */}
        <div className="relative mb-5 from-dropdown-container">
          <div
            className={twMerge(
              "flex items-center justify-between px-4 py-3 border rounded-lg",
              "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <input
              type="number"
              placeholder="Please enter"
              value={fromValue}
              onChange={(e) => {
                setFromValue(e.target.value);
                setSuccessMessage("");
              }}
              className="bg-transparent text-xl font-medium w-full outline-none placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />
            <div className="flex items-center space-x-2">
              <button
                className="text-xs text-green-500 font-semibold hover:text-green-600"
                onClick={() => setFromValue(availableBalances[fromCurrency].replace(/,/g, ""))}
              >
                Max
              </button>
              <div
                className="flex items-center cursor-pointer gap-x-1"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="font-bold text-gray-900 dark:text-gray-100 text-right">
                  {fromCurrency}
                </span>
                <Image
                  src={currencies.find((c) => c.name === fromCurrency)?.symbol}
                  alt={fromCurrency}
                  className="w-[20px] h-[20px]"
                />
              </div>
            </div>
          </div>
          {isFromDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
              {currencies
                .filter((c) => c.name !== toCurrency)
                .map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => handleSelectCurrency(c.name, "from")}
                  >
                    <Image src={c.symbol} alt={c.name} className="w-[20px] h-[20px]" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwap}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border shadow-md flex items-center justify-center"
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

        {/* To Input */}
        <div className="relative to-dropdown-container mb-6">
          <div
            className={twMerge(
              "flex items-center justify-between px-4 py-3 border rounded-lg",
              "bg-gray-100 dark:bg-gray-700"
            )}
          >
            <input
              type="text"
              readOnly
              value={AmountWithCommas(toValue,toCurrency)}
              className="bg-transparent text-xl font-medium w-full outline-none text-gray-900 dark:text-gray-100"
            />
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
            >
              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-[75px] text-right">
                {toCurrency}
              </span>
              <Image
                src={currencies.find((c) => c.name === toCurrency)?.symbol}
                alt={toCurrency}
                className="w-[20px] h-[20px]"
              />
            </div>
          </div>
          {isToDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
              {currencies
                .filter((c) => c.name !== fromCurrency)
                .map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => handleSelectCurrency(c.name, "to")}
                  >
                    <Image src={c.symbol} alt={c.name} className="w-[20px] h-[20px]" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Exchange Rate Display */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          Today's exchange rate: 1 {fromCurrency} ={" "}
          {rates[fromCurrency] && rates[toCurrency]
            ? ((1 * rates[fromCurrency]) / rates[toCurrency]).toFixed(7)
            : "N/A"}{" "}
          {toCurrency}
        </div>

        {successMessage && (
          <div className="mb-4 p-3 text-center text-sm font-medium rounded-lg bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
            {successMessage}
          </div>
        )}

        <Button text="Confirm" className="w-full" handleFunc={handleConfirm} />
      </div>
    </div>
  );
};

export default ConvertPage;
