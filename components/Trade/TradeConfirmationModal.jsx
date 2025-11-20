"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { useContext, useEffect, useState } from "react";
import FF from "./FF";
import First from "./First";

export const TradeConfirmationModal = ({
  isOpen,
  onClose,
  onOpen,
  high,
  low,
  volume,
  change,
  candleColor,
}) => {
  const { countdown, setCountdown } = useContext(contextProvider);

  const {
    tradingDetails,
    TradeUpdateRequest,
    openOrders,
    OpenOrdersRequest,
    OrderHistoryRequest,
    tradePopupRequest,
    clearOpenOrders,
  } = TradeStore();
  const { GetAccountBalanceRequest } = UserStore();
  const [resultData, setResultData] = useState(null); // Latch for result data

  const isFinalPopup =
    openOrders?.[0]?.countdown_seconds === 0 && openOrders?.[0]?.is_popup_open === false;

  // Background sync and latch result data
  useEffect(() => {
    if (isFinalPopup) {
      // Latch the result data immediately so it doesn't disappear if openOrders changes
      if (openOrders?.[0]) {
        setResultData(openOrders[0]);
      }

      (async () => {
        try {
          await tradePopupRequest(openOrders[0]?.id);
          await TradeUpdateRequest(openOrders[0]?.id, {
            high,
            low,
            volume,
            change,
          });
          await OpenOrdersRequest();
          await OrderHistoryRequest();
          await GetAccountBalanceRequest();
        } catch (error) {
          console.error("Error updating trade data in background:", error);
        }
      })();
    }
  }, [isFinalPopup]); // Removed openOrders from dependency to avoid re-running if it changes mid-sync

  // Polling for result when countdown ends
  useEffect(() => {
    let interval;
    if (isOpen && countdown === 0 && !isFinalPopup && !resultData) {
      interval = setInterval(() => {
        OpenOrdersRequest();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, countdown, isFinalPopup, OpenOrdersRequest, resultData]);

  const handleClose = () => {
    if (isFinalPopup || resultData) {
      clearOpenOrders(); // Instantly clear open orders only if trade is finished
    }
    setResultData(null); // Reset latch
    onClose(); // Close modal
    // localStorage.removeItem("countdown")
  };

  // if (!openOrders[0]) {
  //   return null;
  // }

  const shouldShowFinalPopup = (isFinalPopup && countdown === 0) || !!resultData;
  const shouldShowFirstPopup = openOrders?.[0]?.status === "pending" && countdown !== 0 && !resultData;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto min-h-[500px] flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">{``}</DialogTitle>
        </DialogHeader>

        {openOrders?.[0] || resultData ? (
          shouldShowFirstPopup ? (
            <First
              tradingDetails={tradingDetails}
              high={high}
              low={low}
              volume={volume}
              change={change}
              candleColor={candleColor}
            />
          ) : shouldShowFinalPopup ? (
            <FF data={resultData} />
          ) : (
            <div className="text-center font-semibold pt-5 text-green-500 pb-14">
              Trade Loading...
            </div>
          )
        ) : (
          <div className="text-center font-semibold pt-5 text-green-500 pb-14">
            Trade Loading...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
