"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import { useContext, useEffect, useState } from "react";
import FF from "./FF";
import First from "./First";
import LoadingSpinner from "./LoadingSpinner"; // Make sure to create or import a loading spinner component
import UserStore from "@/store/UserStore";

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
  const [isLoading, setIsLoading] = useState(false);

  const {
    tradingDetails,
    TradeUpdateRequest,
    openOrders,
    OpenOrdersRequest,
    OrderHistoryRequest,
    tradePopupRequest,
  } = TradeStore();
  const {GetAccountBalanceRequest} = UserStore()

  const isFinalPopup =
    openOrders[0]?.countdown_seconds === 0 && openOrders[0]?.is_popup_open === false;

  useEffect(() => {
    // Show loading spinner when the final popup condition is met, but countdown is not yet 0
    // This handles the brief period before the state is updated
    if (isFinalPopup && openOrders[0]?.countdown_seconds > 0) {
      setIsLoading(true);
    }
  }, [openOrders]);

  useEffect(() => {
    // Once the countdown is 0 and the final popup condition is met, show the FF component
    if (isFinalPopup && countdown === 0) {
      setIsLoading(false); // Hide spinner
    }
  }, [isFinalPopup, countdown]);

  const handleClose = async () => {
    if (isFinalPopup) {
      await tradePopupRequest(openOrders[0]?.id);
      await TradeUpdateRequest(openOrders[0]?.id, {
        high,
        low,
        volume,
        change,
      });
      await OpenOrdersRequest();
      await OrderHistoryRequest();
      await GetAccountBalanceRequest()
    }
    onClose();
  };

  if (!openOrders[0]) {
    return null;
  }

  const shouldShowFinalPopup = isFinalPopup && countdown === 0;
  const shouldShowFirstPopup = openOrders[0]?.status === "pending" && countdown !== 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">{``}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <LoadingSpinner />
        ) : shouldShowFirstPopup ? (
          <First
            tradingDetails={tradingDetails}
            high={high}
            low={low}
            volume={volume}
            change={change}
            candleColor={candleColor}
          />
        ) : shouldShowFinalPopup ? (
          <FF />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
