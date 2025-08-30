"use client";

import { contextProvider } from "@/contexts/Context";
import useAssetBalance from "@/hooks/useAssetBalance";
import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";

// ✅ Utility: truncate decimals without rounding
const truncateAmount = (value, coin = "USDT") => {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return "";

  let decimalPlaces = 2;
  if (coin?.toLowerCase() === "btc" || coin?.toLowerCase() === "eth") {
    decimalPlaces = 7;
  }

  const factor = Math.pow(10, decimalPlaces);
  const truncated = Math.trunc(num * factor) / factor;

  return truncated.toFixed(decimalPlaces);
};

// Local Button component to resolve import error
const Button = ({ text, className, handleFunc }) => {
  return (
    <button
      onClick={handleFunc}
      className={`bg-primary-200 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-primary-300 transition-colors duration-200 ${className}`}
    >
      {text}
    </button>
  );
};

// Local Heading component to resolve import error
const Heading = ({ text }) => {
  return (
    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">{text}</h1>
  );
};

const TransferPage = () => {
  const [fromAsset, setFromAsset] = useState("TOTAL_ASSET");
  const [toAsset, setToAsset] = useState("WEALTH_MANAGEMENT");
  const [transferAmount, setTransferAmount] = useState("");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const total = useAssetBalance();
  const [successMessage, setSuccessMessage] = useState("");
  const [rates, setRates] = useState({ USDT: 1, BTC: 0, ETH: 0 });
  const { totalAvailableBalance } = useContext(contextProvider);
  const { AccountBalance, ConvertBalanceRequest, GetAccountBalanceRequest } = UserStore();
  const { transferRequest } = TradeStore();

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
      }
    };

    fetchPrices();
  }, []);

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

  const assetTypes = ["TOTAL_ASSET", "WEALTH_MANAGEMENT", "CONTRACT_ASSET"];

  // ✅ availableBalances now use truncate logic
  const availableBalances = {
    TOTAL_ASSET: Number(truncateAmount(total, "USDT")),
    WEALTH_MANAGEMENT: Number(truncateAmount(AccountBalance?.WEALTH_MANAGEMENT?.available, "USDT")),
    CONTRACT_ASSET: Number(truncateAmount(AccountBalance?.CONTRACT?.available, "USDT")),
  };

  // ✅ Swap also recalculates amount for the new fromAsset
  const handleSwap = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);

    const balance = availableBalances[toAsset];
    setTransferAmount(balance ? String(balance) : "");
    setSuccessMessage("");
  };

  const handleSelectAsset = (asset, type) => {
    if (type === "from") {
      setFromAsset(asset);
      setIsFromDropdownOpen(false);

      const balance = availableBalances[asset];
      setTransferAmount(balance ? String(balance) : "");
    } else {
      setToAsset(asset);
      setIsToDropdownOpen(false);
    }
    setSuccessMessage("");
  };

  // ✅ Max button uses truncate
  const handleMaxClick = () => {
    const balance = availableBalances[fromAsset];
    setTransferAmount(balance ? String(balance) : "");
    setSuccessMessage("");
  };

  // ✅ Input restricts decimals (2 for USD, 7 for BTC/ETH)
  const handleInputChange = (e) => {
    let value = e.target.value;

    if (!/^\d*\.?\d*$/.test(value)) return;

    let decimalPlaces = 2;
    if (fromAsset === "BTC" || fromAsset === "ETH") {
      decimalPlaces = 7;
    }

    if (value.includes(".")) {
      const [intPart, decPart] = value.split(".");
      value = intPart + "." + decPart.slice(0, decimalPlaces);
    }

    setTransferAmount(value);
    setSuccessMessage("");
  };

  // ✅ Confirm transfer with validation
  const handleConfirmTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setSuccessMessage("Please enter a valid amount to transfer.");
      setTimeout(() => setSuccessMessage(""), 2000);
      return;
    }

    // ❌ Check if input exceeds available balance
    if (amount > availableBalances[fromAsset]) {
      setSuccessMessage(`Amount exceeds available balance of ${availableBalances[fromAsset]}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    // ✅ Call transfer API
    await transferRequest({
      from_asset: fromAsset,
      to_asset: toAsset,
      amount: amount,
    });

    await GetAccountBalanceRequest();

    setSuccessMessage("Transfer completed successfully!");
    setTransferAmount("");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 dark:bg-dark py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Heading text={"Transfer"} />

        {/* From / To with Swap */}
        <div className="relative flex items-center space-x-4 mb-6">
          <div className="flex-grow bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600">
            {/* From dropdown */}
            <div className="relative from-dropdown-container">
              <div
                className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-600 cursor-pointer"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-500">From</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs md:text-base text-gray-800 dark:text-white font-medium capitalize">
                    {fromAsset}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                      isFromDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
              {isFromDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
                  {assetTypes
                    .filter((asset) => asset !== toAsset)
                    .map((asset) => (
                      <div
                        key={asset}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleSelectAsset(asset, "from")}
                      >
                        <span className="font-medium text-gray-800 dark:text-white capitalize">
                          {asset}
                        </span>
                        {fromAsset === asset && <Check className="w-5 h-5 text-primary-200" />}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* To dropdown */}
            <div className="relative to-dropdown-container">
              <div
                className="flex items-center justify-between pt-2 cursor-pointer"
                onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-500">to</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs md:text-base text-gray-800 dark:text-white font-medium capitalize">
                    {toAsset}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                      isToDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
              {isToDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
                  {assetTypes
                    .filter((asset) => asset !== fromAsset)
                    .map((asset) => (
                      <div
                        key={asset}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleSelectAsset(asset, "to")}
                      >
                        <span className="font-medium text-gray-800 dark:text-white capitalize">
                          {asset}
                        </span>
                        {toAsset === asset && <Check className="w-5 h-5 text-primary-200" />}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap button */}
          <button
            onClick={handleSwap}
            className="flex-shrink-0 w-12 h-12 bg-primary-200 text-white rounded-full border border-gray-300 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
          >
            <ArrowUpDown className="w-6 h-6" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-6">
          <p className="text-sm font-medium dark:text-white text-gray-500 mb-2">Transfer amount</p>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-inner border border-gray-200 dark:border-gray-600">
            <input
              type="text"
              placeholder="0"
              className="bg-transparent text-xl font-bold w-full outline-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              value={transferAmount}
              onChange={handleInputChange}
            />
            <div className="flex items-center space-x-2">
              <button
                className="text-sm font-bold text-primary-200 uppercase"
                onClick={handleMaxClick}
              >
                Max
              </button>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">USDT</span>
            </div>
          </div>
        </div>

        {/* Available balance */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Available balance:{" "}
          <span className="font-bold text-gray-800 dark:text-white">
            {availableBalances[fromAsset]}
          </span>
        </div>

        {/* Message */}
        {successMessage && (
          <div
            className={`mt-4 p-3 text-center text-sm font-medium rounded-lg ${
              successMessage.includes("successfully")
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Confirm */}
        <div className="mt-8">
          <Button
            text={"Confirm Transfer"}
            className={"w-full !text-gray-800 cursor-pointer"}
            handleFunc={handleConfirmTransfer}
          />
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
