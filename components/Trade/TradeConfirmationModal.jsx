"use client";

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { contextProvider } from "@/contexts/Context";
import { CheckCircle, Clock } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import First from "./First";
import FF from "./FF";

export const TradeConfirmationModal = ({ isOpen, onClose, order, onConfirm }) => {
  const { countdown, setCountdown } = useContext(contextProvider);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [forceOpen, setForceOpen] = useState(false); // 👈 to reopen after time ends

  useEffect(() => {
    if (!isOpen || !order) return;

    setIsConfirmed(false);

    const timeframes = {
      "60s": 10,
      "120s": 120,
      "12h": 43200,
      "1d": 86400,
      "7d": 604800,
      "15d": 1296000,
    };

    setCountdown(timeframes[order.timeframe] || 60);
  }, [isOpen, order]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsConfirmed(true);
          setForceOpen(true); // 👈 reopen with confirmed view
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onConfirm();
      setForceOpen(false);
      onClose();
    }, 2000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!order) return null;

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
        {/* <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">
            {isConfirmed ? "Trade Confirmed!" : "Confirm Trade"}
          </DialogTitle>
        </DialogHeader> */}

        {!isConfirmed ? (
          <div className="space-y-4 sm:space-y-6">
            <First/>
            {/* Timer  */}
            {/* <div className="text-center bg-green-500 w-[100px] h-[100px] rounded-full flex items-center justify-center mx-auto">
              <div className="text-xl">
                <Clock className="w-3 mx-auto h-3 sm:w-6 sm:h-6" />
                {formatTime(countdown)}
              </div>
            </div>

            <Card className="p-3 sm:p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Action:</span>
                  <span
                    className={`font-semibold ${
                      order.type === "buy" ? "text-trading-buy" : "text-trading-sell"
                    }`}
                  >
                    {order.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-mono">{order.amount} BTC</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-mono">${order.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-mono font-semibold">
                    ${(order.amount * order.price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{order.timeframe}</span>
                </div>
              </div>
            </Card> */}
          </div>
        ) : (
          <FF/>
        )}
      </DialogContent>
    </Dialog>
  );
};
