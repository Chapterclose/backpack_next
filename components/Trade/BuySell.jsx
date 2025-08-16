import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Button from "../Form/Button";

function BuySell({ coin }) {
  const [activePopup, setActivePopup] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("60s"); // Default to '60s'
  const [purchaseVolume, setPurchaseVolume] = useState("");
  const [minPurchaseVolume, setMinPurchaseVolume] = useState(1); // Default min volume
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const { walletAddress, connectWallet } = useContext(contextProvider);
  const { TradeBuySellRequest } = TradeStore();

  const periodButtonsContainerRef = useRef(null);
  const searchParams = useSearchParams();

  const closePopup = () => {
    setActivePopup(null);
    setSelectedPeriod("60s"); // Reset to default when closing
    setPurchaseVolume("");
    setMinPurchaseVolume(1); // Reset min volume
    setErrorMessage(""); // Clear error message
    // No need to manually reset transform here; useEffect will handle it based on selectedPeriod
  };

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

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setMinPurchaseVolume(periodMinimums[period] || 1); // Update min volume based on selection
    setPurchaseVolume(""); // Clear purchase volume when period changes
    setErrorMessage(""); // Clear any previous error message
  };

  const handleVolumeSelect = (volume) => {
    setErrorMessage(""); // Clear error message on volume select
    if (volume < minPurchaseVolume) {
      setErrorMessage(`Minimum input ${minPurchaseVolume} USDT`);
      setPurchaseVolume(""); // Optionally clear input if selected volume is too low
      return;
    }
    setPurchaseVolume(volume.toString());
  };

  const handleVolumeInputChange = (e) => {
    const value = e.target.value;
    setErrorMessage(""); // Clear error message on input change
    if (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0) {
      setPurchaseVolume(value);
    } else if (value === "") {
      // Allow clearing the input
      setPurchaseVolume("");
    }
  };

  const allPeriods = useMemo(
    () => [
      { value: "60s", text: "60s", percentage: "10%" },
      { value: "120s", text: "120s", percentage: "30%" },
      { value: "12h", text: "12h", percentage: "60%" },
      { value: "1d", text: "1d", percentage: "130%" },
      { value: "7d", text: "7d", percentage: "250%" },
      { value: "15d", text: "15d", percentage: "400%" },
    ],
    []
  );

  // Effect to handle period button scrolling for better UX
  useEffect(() => {
    setMinPurchaseVolume(periodMinimums[selectedPeriod] || 1);

    const container = periodButtonsContainerRef.current;
    if (!container) return;

    const selectedIndex = allPeriods.findIndex((p) => p.value === selectedPeriod);
    if (selectedIndex === -1) return;

    const selectedButton = container.children[selectedIndex];
    if (selectedButton) {
      // Use scrollIntoView with 'center' behavior for better UX
      selectedButton.scrollIntoView({
        behavior: "smooth",
        inline: "center", // This will try to center the element horizontally
        block: "nearest", // This keeps the vertical position if it's already visible
      });
    }
  }, [selectedPeriod, allPeriods, periodMinimums]);

  const handleConfirm = async (tradeType) => {
    setErrorMessage(""); // Clear any previous error messages before validation

    const currentCoin = searchParams.get("coin") || coin;
    const amount = parseFloat(purchaseVolume);

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

    const tradeData = {
      trade_type: tradeType,
      asset: currentCoin.toUpperCase(),
      period: selectedPeriod,
      amount: amount,
    };
    await TradeBuySellRequest(tradeData);
    closePopup();
  };

  // --- Tailwind CSS Classes ---
  const overlayClass =
    "fixed inset-0 bg-black/40 dark:bg-black/50 bg-opacity-50 flex items-end justify-center z-[9999]";
  const popupContentClass =
    "bg-[#1E1E1E] dark:bg-gray-900 w-full max-w-md p-4 lg:p-6 rounded-t-lg shadow-lg transform transition-transform duration-300 ease-out";
  const buttonGridClass = "grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4";
  const scrollableContainerClass = "overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar"; // Added no-scrollbar
  const periodButtonsWrapperClass = "inline-flex flex-nowrap gap-2 md:gap-4 mt-4 pb-2 px-2"; // Added horizontal padding
  const baseInputButtonClass =
    "text-white py-3 px-2 sm:px-4 rounded text-center cursor-pointer transition-colors text-xs sm:text-sm md:text-base flex-shrink-0 min-w-[80px]"; // Added min-w for consistent button size

  return (
    <div>
      <div className="mt-10 lg:mt-14">
        {walletAddress === "" ? (
          <div className="text-center">
            <Button handleFunc={connectWallet} text={"Connect"} />
          </div>
        ) : (
          <div className="flex justify-center gap-x-4 fixed bottom-[90px] lg:bottom-0 left-1/2 -translate-x-1/2 z-[99]">
            <button
              className="px-15 lg:px-20 py-3 cursor-pointer bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors"
              onClick={() => setActivePopup("buy")}
            >
              Buy
            </button>
            <button
              className="px-15 lg:px-20 py-3 cursor-pointer bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
              onClick={() => setActivePopup("sell")}
            >
              Sell
            </button>
          </div>
        )}
      </div>

      {/* Buy Pop-up */}
      {activePopup === "buy" && (
        <div
          className={`${overlayClass} ${
            activePopup ? "translate-y-0" : "translate-y-full z-[9999]"
          }`}
        >
          <div className={`${popupContentClass}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <h3 className="text-white text-xl font-bold uppercase">{coin}</h3>
                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  BUY
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
                        isSelected ? "bg-green-600" : "bg-[#333] hover:bg-[#444]"
                      }`}
                      onClick={() => handlePeriodSelect(period.value)}
                    >
                      {period.text}
                      <br />
                      {period.percentage}
                    </button>
                  );
                })}
              </div>
            </div>

            <h4 className="text-gray-300 text-lg mt-6 mb-3">Purchase volume</h4>
            <input
              type="number"
              placeholder={`Least ${minPurchaseVolume} USDT`}
              className="w-full p-3 bg-[#333] text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={purchaseVolume}
              onChange={handleVolumeInputChange}
            />
            {/* Error message display */}
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

            <div className={`${buttonGridClass} mt-4`}>
              {[50, 100, 500, 1000, 2000, 5000, 10000, 20000].map((volumeNum) => (
                <button
                  key={volumeNum}
                  className={`${baseInputButtonClass.replace("min-w-[80px]", "")} ${
                    // Removed min-w for volume buttons
                    purchaseVolume === volumeNum.toString()
                      ? "bg-green-600"
                      : "bg-[#333] hover:bg-[#444]"
                  }`}
                  onClick={() => handleVolumeSelect(volumeNum)}
                >
                  {volumeNum}
                </button>
              ))}
            </div>

            <p className="text-gray-400 mt-6 text-sm">
              Available balance: <span className="text-white font-bold">0 USDT</span>
            </p>

            <button
              className="w-full bg-green-600 text-white py-4 mt-6 rounded text-lg font-bold hover:bg-green-700 transition-colors"
              onClick={() => handleConfirm("buy")}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Sell Pop-up (identical structure to Buy) */}
      {activePopup === "sell" && (
        <div
          className={`${overlayClass} ${
            activePopup ? "translate-y-0" : "translate-y-full z-[9999]"
          }`}
        >
          <div className={`${popupContentClass}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <h3 className="text-white text-xl font-bold uppercase">{coin}</h3>
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  SELL
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
                        isSelected ? "bg-red-600" : "bg-[#333] hover:bg-[#444]"
                      }`}
                      onClick={() => handlePeriodSelect(period.value)}
                    >
                      {period.text}
                      <br />
                      {period.percentage}
                    </button>
                  );
                })}
              </div>
            </div>

            <h4 className="text-gray-300 text-lg mt-6 mb-3">Purchase volume</h4>
            <input
              type="number"
              placeholder={`Least ${minPurchaseVolume} USDT`}
              className="w-full p-3 bg-[#333] text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              value={purchaseVolume}
              onChange={handleVolumeInputChange}
            />
            {/* Error message display */}
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

            <div className={`${buttonGridClass} mt-4`}>
              {[50, 100, 500, 1000, 2000, 5000, 10000, 20000].map((volumeNum) => (
                <button
                  key={volumeNum}
                  className={`${baseInputButtonClass.replace("min-w-[80px]", "")} ${
                    // Removed min-w for volume buttons
                    purchaseVolume === volumeNum.toString()
                      ? "bg-red-600"
                      : "bg-[#333] hover:bg-[#444]"
                  }`}
                  onClick={() => handleVolumeSelect(volumeNum)}
                >
                  {volumeNum}
                </button>
              ))}
            </div>

            <p className="text-gray-400 mt-6 text-sm">
              Available balance: <span className="text-white font-bold">0 USDT</span>
            </p>

            <button
              className="w-full bg-red-600 text-white py-4 mt-6 rounded text-lg font-bold hover:bg-red-700 transition-colors"
              onClick={() => handleConfirm("sell")}
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
