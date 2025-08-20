"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import { useContext, useEffect, useState } from "react";
import FF from "./FF";
import First from "./First";

export const TradeConfirmationModal = ({ isOpen, onClose, onConfirm, high, low, volume, change, candleColor }) => {
  const { countdown, setCountdown } = useContext(contextProvider);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [forceOpen, setForceOpen] = useState(false); //reopen after time
  const {
    tradingDetails,
    tradingData,
    TradeUpdateRequest,
    openOrders,
    OpenOrdersRequest,
    OrderHistoryRequest,
  } = TradeStore();
  useEffect(() => {
    if (isOpen && openOrders?.length > 0) {
      setIsConfirmed(false);
      setCountdown(openOrders[0]?.countdown_seconds);
    }
  }, [isOpen, openOrders]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsConfirmed(true);
          setForceOpen(true); // 👈 reopen with confirmed view

          // call async function outside of state updater
          const updateTrade = async () => {
            try {
              await TradeUpdateRequest(tradingDetails?.id, {
                current_price: "10000",
                high,
                low,
                volume,
                change: change,
                profit: tradingDetails?.profit,
              });
            } catch (err) {
              console.error("Trade update failed:", err);
            }
          };

          updateTrade();
          OpenOrdersRequest();
          OrderHistoryRequest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (!tradingDetails) return null;

  return (
    <Dialog
      open={isOpen || forceOpen}
      onOpenChange={(open) => {
        if (!open) {
          setForceOpen(false); // allow manual closing
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md mx-auto">
        {!isConfirmed ? (
          <div className="space-y-4 sm:space-y-6">
            <First tradingDetails={tradingDetails} high={high} low={low} volume={volume} change={change} candleColor={candleColor} />
          </div>
        ) : (
          <FF />
        )}
      </DialogContent>
    </Dialog>
  );
};
