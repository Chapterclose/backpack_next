"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const TradeConfirmationModal = ({ isOpen, onClose, order, onConfirm }) => {
  const [countdown, setCountdown] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen || !order) return;

    // Reset state when modal opens
    setIsConfirmed(false);

    // Set countdown based on timeframe
    const timeframes = {
      "30s": 30,
      "1m": 60,
      "3m": 180,
      "5m": 300,
      "15m": 900,
      "1h": 3600,
    };

    setCountdown(timeframes[order.timeframe] || 60);
  }, [isOpen, order]);

  useEffect(() => {
    if (countdown <= 0 || !isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsConfirmed(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isOpen]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onConfirm();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">
            {isConfirmed ? "Trade Confirmed!" : "Confirm Trade"}
          </DialogTitle>
        </DialogHeader>

        {!isConfirmed ? (
          <div className="space-y-4 sm:space-y-6">
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
            </Card>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xl sm:text-2xl font-mono">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                {formatTime(countdown)}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Time remaining for this trade
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className={`flex-1 h-10 sm:h-11 text-sm sm:text-base ${
                  order.type === "buy"
                    ? "bg-primary-200 hover:bg-primary-100"
                    : "bg-primary-200 hover:bg-primary-100"
                } text-white`}
              >
                Confirm Trade
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-success mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Trade Executed!</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your {order.type} order has been placed successfully.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
