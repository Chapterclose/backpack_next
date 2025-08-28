"use client";

import { contextProvider } from "@/contexts/Context";
import useAssetBalance from "@/hooks/useAssetBalance";
import { AmountWithCommas } from "@/lib/utils";
import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";

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
  // New state for the success message
  const [successMessage, setSuccessMessage] = useState("");
  const [rates, setRates] = useState({ USDT: 1, BTC: 0, ETH: 0 });
  const { totalAvailableBalance } = useContext(contextProvider);
  const { AccountBalance, ConvertBalanceRequest, GetAccountBalanceRequest } = UserStore();
  const { transferRequest } = TradeStore();
  // {USDT: 1, BTC: 112367.13, ETH: 4468.23}
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

  const availableBalances = {
    TOTAL_ASSET: `${AmountWithCommas(total)} USDT`,
    WEALTH_MANAGEMENT: `${AmountWithCommas(AccountBalance?.WEALTH_MANAGEMENT?.available)} USDT`,
    CONTRACT_ASSET: `${AmountWithCommas(AccountBalance?.CONTRACT?.available)} USDT`,
  };

  // Function to handle the "Swap" button click
  const handleSwap = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setSuccessMessage("");
  };

  // Function to handle selecting an asset from the dropdown
  const handleSelectAsset = (asset, type) => {
    if (type === "from") {
      setFromAsset(asset);
      setIsFromDropdownOpen(false);
    } else {
      setToAsset(asset);
      setIsToDropdownOpen(false);
    }
    setSuccessMessage("");
  };

  // Function to set the transfer amount to the available balance
  const handleMaxClick = () => {
    const balanceString = availableBalances[fromAsset].split(" ")[0].replace(/,/g, "");
    setTransferAmount(balanceString);
    setSuccessMessage("");
  };

  // New function to handle the "Confirm Transfer" button click
  const handleConfirmTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setSuccessMessage("Please enter a valid amount to transfer.");
      setTimeout(() => setSuccessMessage(""), 2000);
      return;
    }

    const currentUSDT = AccountBalance?.USDT?.available || 0;
    const currentBTC = AccountBalance?.BTC?.available || 0;
    const currentETH = AccountBalance?.ETH?.available || 0;

    let neededBalance = amount - currentUSDT;

    if (neededBalance > 0) {
      let btcToConvert = 0;
      let ethToConvert = 0;

      // Check and convert BTC first
      if (neededBalance > 0 && currentBTC > 0 && rates.BTC > 0) {
        const btcInUsdt = currentBTC * rates.BTC;
        if (btcInUsdt >= neededBalance) {
          btcToConvert = neededBalance / rates.BTC;
          neededBalance = 0;
        } else {
          btcToConvert = currentBTC;
          neededBalance -= btcInUsdt;
        }
        if (btcToConvert > 0) {
          const btcConvertBody = {
            from_asset: "BTC",
            to_asset: "USDT",
            from_amount: btcToConvert,
            to_amount: (btcToConvert * rates.BTC).toFixed(8),
          };
          await ConvertBalanceRequest(btcConvertBody);
          await GetAccountBalanceRequest(); // Update balance after conversion
        }
      }

      // If still needed, check and convert ETH
      if (neededBalance > 0 && currentETH > 0 && rates.ETH > 0) {
        const ethInUsdt = currentETH * rates.ETH;
        if (ethInUsdt >= neededBalance) {
          ethToConvert = neededBalance / rates.ETH;
          neededBalance = 0;
        } else {
          ethToConvert = currentETH;
          neededBalance -= ethInUsdt;
        }
        if (ethToConvert > 0) {
          const ethConvertBody = {
            from_asset: "ETH",
            to_asset: "USDT",
            from_amount: ethToConvert,
            to_amount: (ethToConvert * rates.ETH).toFixed(8),
          };
          await ConvertBalanceRequest(ethConvertBody);
          await GetAccountBalanceRequest(); // Update balance after conversion
        }
      }

      // Final check for sufficient funds after conversions
      if (neededBalance > 0) {
        setSuccessMessage("Insufficient balance across all assets for this transfer.");
        setTimeout(() => setSuccessMessage(""), 2000);
        return;
      }
    }

    // After potential conversions, perform the main transfer
    await transferRequest({
      from_asset: fromAsset,
      to_asset: toAsset,
      amount: amount,
    });

    await GetAccountBalanceRequest(); // Update balance after main transfer

    setSuccessMessage("Transfer completed successfully!");
    setTransferAmount("");
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 dark:bg-dark py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Heading text={"Transfer"} />

        {/* From and To asset selection section with swap icon on the right */}
        <div className="relative flex items-center space-x-4 mb-6">
          {/* Container for From and To dropdowns */}
          <div className="flex-grow bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600">
            {/* From asset dropdown */}
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
              {/* From dropdown menu */}
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

            {/* To asset dropdown */}
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
              {/* To dropdown menu */}
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

          {/* Swap button on the right */}
          <button
            onClick={handleSwap}
            className="flex-shrink-0 w-12 h-12 bg-primary-200 text-white rounded-full border border-gray-300 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
          >
            <ArrowUpDown className="w-6 h-6" />
          </button>
        </div>

        {/* Transfer amount input section */}
        <div className="mb-6">
          <p className="text-sm font-medium dark:text-white text-gray-500 mb-2">Transfer amount</p>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-inner border border-gray-200 dark:border-gray-600">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent text-xl font-bold w-full outline-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              value={transferAmount}
              onChange={(e) => {
                setTransferAmount(e.target.value);
                setSuccessMessage(""); // Clear the message when user starts typing again
              }}
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

        {/* Available balance display */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Available balance:{" "}
          <span className="font-bold text-gray-800 dark:text-white">
            {availableBalances[fromAsset]}
          </span>
        </div>

        {/* Conditional Success/Error Message Display */}
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

        {/* Confirm button */}
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
