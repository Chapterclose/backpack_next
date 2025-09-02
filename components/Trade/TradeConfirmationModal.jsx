"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { useContext } from "react";
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
  } = TradeStore();
  const { GetAccountBalanceRequest } = UserStore();

  const isFinalPopup =
    openOrders[0]?.countdown_seconds === 0 && openOrders[0]?.is_popup_open === false;

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
      await GetAccountBalanceRequest();
    }
    onClose();
    // localStorage.removeItem("countdown")
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

        {shouldShowFirstPopup ? (
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
        ) : (
          <div className="text-center font-semibold pt-5 text-green-500 pb-14">Trade Loading...</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
