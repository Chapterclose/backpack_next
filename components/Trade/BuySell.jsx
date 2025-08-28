"use client";

import { contextProvider } from "@/contexts/Context";
import { AmountWithCommas } from "@/lib/utils";
import TradeStore from "@/store/TradeStore";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast"; // Import react-hot-toast
import Button from "../Form/Button";

function BuySell({ coin, onOpen, AccountBalance, currentPrice, high, low, volume, change }) {
  // State for managing the pop-up, selected period, and purchase volume
  const [activePopup, setActivePopup] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("60s");
  const [purchaseVolume, setPurchaseVolume] = useState("");
  const [minPurchaseVolume, setMinPurchaseVolume] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTradeRunning, setIsTradeRunning] = useState(false); // New state for trade running status

  // Context and store hooks
  const { walletAddress, connectWallet, totalAvailableBalance } = useContext(contextProvider);
  const { TradeBuySellRequest, tradingData, TradeDetailsRequest, OpenOrdersRequest, openOrders } =
    TradeStore();
  // Refs and hooks for component logic
  const periodButtonsContainerRef = useRef(null);
  const searchParams = useSearchParams();

  // Effect to check for running trades and update button state
  useEffect(() => {
    // Fetch open orders when the component mounts or openOrders change (to keep it fresh)
    OpenOrdersRequest();
  }, []); // Run once on mount to get initial orders

  useEffect(() => {
    if (openOrders && openOrders.length > 0) {
      setIsTradeRunning(true);
    } else {
      setIsTradeRunning(false);
    }
  }, [openOrders]); // Re-run when openOrders array changes

  // Function to close the active pop-up
  const closePopup = () => {
    setActivePopup(null);
    setSelectedPeriod("60s");
    setPurchaseVolume("");
    setMinPurchaseVolume(periodMinimums["60s"] || 1); // Reset to default 60s minimum
    setErrorMessage("");
  };

  // Memoized object for period-specific minimum volumes
  const periodMinimums = useMemo(
    () => ({
      "60s": 1,
      "120s": 2000,
      "12h": 12000,
      "1d": 50000,
      "7d": 60000,
      "15d": 65000,
    }),
    []
  );

  // Handlers for user interactions
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setMinPurchaseVolume(periodMinimums[period] || 1);
    setPurchaseVolume("");
    setErrorMessage("");
  };

  const handleVolumeSelect = (volume) => {
    setErrorMessage("");
    if (volume < minPurchaseVolume) {
      setErrorMessage(`Minimum input ${minPurchaseVolume} USDT`);
      setPurchaseVolume("");
      return;
    }
    setPurchaseVolume(volume.toString());
  };

  const handleVolumeInputChange = (e) => {
    const value = e.target.value;
    setErrorMessage("");
    if (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0) {
      setPurchaseVolume(value);
    } else if (value === "") {
      setPurchaseVolume("");
    }
  };

  // Memoized array of all available periods and percentages
  const allPeriods = useMemo(
    () => [
      { value: "60s", text: "60s", percentage: "10" },
      { value: "120s", text: "120s", percentage: "30" },
      { value: "12h", text: "12h", percentage: "60" },
      { value: "1d", text: "1d", percentage: "130" },
      { value: "7d", text: "7d", percentage: "250" },
      { value: "15d", text: "15d", percentage: "400" },
    ],
    []
  );

  // Effect to scroll the period buttons into view for better UX
  useEffect(() => {
    // Make sure to set the initial minPurchaseVolume based on the default selectedPeriod
    setMinPurchaseVolume(periodMinimums[selectedPeriod] || 1);

    const container = periodButtonsContainerRef.current;
    if (!container) return;

    const selectedIndex = allPeriods.findIndex((p) => p.value === selectedPeriod);
    if (selectedIndex === -1) return;

    const selectedButton = container.children[selectedIndex];
    if (selectedButton) {
      selectedButton.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedPeriod, allPeriods, periodMinimums]);

  // Main confirmation handler for trades
  const handleConfirm = async () => {
    setErrorMessage("");

    // Prevent trade if another trade is running
    if (isTradeRunning) {
      toast.error("Trade is running, you can trade after the running trade is completed.");
      return;
    }

    const currentCoin = searchParams.get("coin") || coin;
    const amount = parseFloat(purchaseVolume);
    const tradeType = activePopup; // Dynamically get trade type from activePopup state

    if (!selectedPeriod) {
      setErrorMessage("Please select a period.");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Please enter a valid purchase volume (greater than 0).");
      return;
    }

    if (amount < minPurchaseVolume) {
      setErrorMessage(`Minimum input ${minPurchaseVolume} USDT`);
      return;
    }

    // Check if AccountBalance is sufficient
    const availableBalance = totalAvailableBalance || 0;
    if (amount > availableBalance) {
      setErrorMessage("You don't have enough balance to trade.");
      toast.error("You don't have enough balance to trade.");
      return;
    }

    // Find the selected period to get the dynamic percentage
    const foundPeriod = allPeriods.find((p) => p.value === selectedPeriod);
    const dynamicPercentage = foundPeriod ? foundPeriod.percentage : "10";

    const tradeData = {
      trade_type: tradeType,
      asset: currentCoin.toUpperCase(),
      period: selectedPeriod,
      percentage: dynamicPercentage,
      amount: amount,
      current_price: currentPrice,
      high,
      low,
      volume,
      change,
    };
    try {
      const res = await TradeBuySellRequest(tradeData);
      if (res.status === 201) {
        closePopup();
        onOpen();
        toast.success(`Trade ${tradeType.toUpperCase()} successful!`); // Success toast
        await TradeDetailsRequest(res?.data?.trade?.id);
        await OpenOrdersRequest(); // Re-fetch open orders after a successful trade
      }
    } catch (error) {
      console.error("Trade request failed:", error);
      // Check if error.response exists and has a message
      const errorMsg = error.response?.data?.message || "Trade request failed. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg); // Show error with react-hot-toast
    }
  };

  // Dynamic values for the pop-up based on activePopup state
  const isBuy = activePopup === "buy";
  // Tailwind doesn't parse dynamic class strings, so we map to explicit classes
  const popupAccentClasses = useMemo(() => {
    if (isBuy) {
      return {
        bg: "bg-green-500",
        bgHover: "hover:bg-green-600",
        bgConfirm: "bg-green-600",
        bgConfirmHover: "hover:bg-green-700",
        focusRing: "focus:ring-green-500",
      };
    } else {
      return {
        bg: "bg-red-500",
        bgHover: "hover:bg-red-600",
        bgConfirm: "bg-red-600",
        bgConfirmHover: "hover:bg-red-700",
        focusRing: "focus:ring-red-500",
      };
    }
  }, [isBuy]);

  // Tailwind CSS Classes for styling - now using the mapped classes
  const overlayClass =
    "fixed inset-0 bg-black/40 dark:bg-black/50 bg-opacity-50 flex items-end justify-center z-[9999]";
  const popupContentClass =
    "bg-[#1E1E1E] dark:bg-gray-900 w-full max-w-md p-4 lg:p-6 rounded-t-lg shadow-lg transform transition-transform duration-300 ease-out";
  const buttonGridClass = "grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4";
  const scrollableContainerClass = "overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar";
  const periodButtonsWrapperClass = "inline-flex flex-nowrap gap-2 md:gap-4 mt-4 pb-2 px-2";
  const baseInputButtonClass =
    "text-white py-3 px-2 sm:px-4 rounded text-center cursor-pointer transition-colors text-xs sm:text-sm md:text-base flex-shrink-0 min-w-[80px]";

  return (
    <div>
      <div className="mt-10 lg:mt-14">
        {walletAddress === "" ? (
          <div className="text-center">
            <Button handleFunc={connectWallet} text={"Log In"} />
          </div>
        ) : (
          <div className="flex justify-center gap-x-4 fixed bottom-[90px] lg:bottom-5 left-1/2 -translate-x-1/2 z-[99]">
            <button
              className={`px-15 lg:px-20 py-3 cursor-pointer bg-green-500 text-white font-bold rounded transition-colors ${
                isTradeRunning ? "opacity-80 !cursor-not-allowed" : "hover:bg-green-600"
              }`}
              onClick={() => {
                if (isTradeRunning) {
                  toast.error(
                    "Trade is running, you can trade after the running trade is completed."
                  );
                } else {
                  setActivePopup("buy");
                }
              }}
              disabled={isTradeRunning} // Disable the button
            >
              Buy
            </button>
            <button
              className={`px-15 lg:px-20 py-3 cursor-pointer bg-red-500 text-white font-bold rounded transition-colors ${
                isTradeRunning ? "opacity-80 !cursor-not-allowed" : "hover:bg-red-600"
              }`}
              onClick={() => {
                if (isTradeRunning) {
                  toast.error(
                    "Trade is running, you can trade after the running trade is completed."
                  );
                } else {
                  setActivePopup("sell");
                }
              }}
              disabled={isTradeRunning} // Disable the button
            >
              Sell
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Pop-up for both Buy and Sell */}
      {activePopup && (
        <div className={`${overlayClass} translate-y-0`}>
          <div className={`${popupContentClass}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <h3 className="text-white text-xl font-bold uppercase">{coin}</h3>
                <span
                  className={`${popupAccentClasses.bg} text-white text-xs font-semibold px-2 py-1 rounded`}
                >
                  {isBuy ? "BUY" : "SELL"} {/* Use hardcoded text for popupTitle */}
                </span>
              </div>
              <button onClick={closePopup} className="text-gray-400 hover:text-white text-2xl">
                &times;
              </button>
            </div>

            <h4 className="text-gray-300 text-lg mb-3">Select Period</h4>
            <div className={scrollableContainerClass}>
              <div ref={periodButtonsContainerRef} className={periodButtonsWrapperClass}>
                {allPeriods.map((period) => {
                  const isSelected = selectedPeriod === period.value;
                  return (
                    <button
                      key={period.value}
                      className={`${baseInputButtonClass} ${
                        isSelected ? popupAccentClasses.bgConfirm : "bg-[#333] hover:bg-[#444]"
                      }`}
                      onClick={() => handlePeriodSelect(period.value)}
                    >
                      {period.text}
                      <br />
                      {period.percentage}%
                    </button>
                  );
                })}
              </div>
            </div>

            <h4 className="text-gray-300 text-lg mt-6 mb-3">Purchase volume</h4>
            <input
              type="number"
              placeholder={`Least ${minPurchaseVolume} USDT`}
              className={`w-full p-3 bg-[#333] text-gray-300 rounded focus:outline-none focus:ring-2 ${popupAccentClasses.focusRing}`}
              value={purchaseVolume}
              onChange={handleVolumeInputChange}
            />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

            <div className={`${buttonGridClass} mt-4`}>
              {[50, 100, 500, 1000, 2000, 5000, 10000, 20000].map((volumeNum) => (
                <button
                  key={volumeNum}
                  className={`${baseInputButtonClass.replace("min-w-[80px]", "")} ${
                    purchaseVolume === volumeNum.toString()
                      ? popupAccentClasses.bgConfirm
                      : "bg-[#333] hover:bg-[#444]"
                  }`}
                  onClick={() => handleVolumeSelect(volumeNum)}
                >
                  {volumeNum}
                </button>
              ))}
            </div>

            <p className="text-gray-400 mt-6 text-sm">
              Available balance:{" "}
              <span className="text-white font-bold">
                {AmountWithCommas(totalAvailableBalance)} USDT
              </span>
            </p>

            <button
              className={`w-full ${popupAccentClasses.bgConfirm} text-white py-4 mt-6 rounded text-lg font-bold ${popupAccentClasses.bgConfirmHover} transition-colors`}
              onClick={() => handleConfirm()}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuySell;
