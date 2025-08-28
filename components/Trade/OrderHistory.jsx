"use client";

import { CheckCircle, Clock } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contextProvider } from "@/contexts/Context";
import TradeStore from "@/store/TradeStore";
import First from "./First";
import HistoryCard from "./HistoryCard";

export const OrderHistory = ({ high, low, volume, change, candleColor, onOpen }) => {
  const { openOrders, orderHistory, OpenOrdersRequest, OrderHistoryRequest, TradeUpdateRequest } =
    TradeStore();

  const { countdown, setCountdown } = useContext(contextProvider);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown, setCountdown]);

  // This hook ensures we get the latest data when the countdown hits 0
  useEffect(() => {
    if (countdown === 0) {
      OpenOrdersRequest();
    }
  }, [countdown]);

  const isFinalPopup =
    openOrders[0]?.countdown_seconds === 0 && openOrders[0]?.is_popup_open === false;

  useEffect(() => {
    if (isFinalPopup && countdown === 0) {
      onOpen();
    }
  }, [openOrders, countdown, isFinalPopup]);

  const [activeTab, setActiveTab] = useState("open");

  useEffect(() => {
    if (activeTab === "open") {
      OpenOrdersRequest();
    } else if (activeTab === "history") {
      OrderHistoryRequest();
    }
  }, [activeTab]);

  return (
    <Card className="p-3 sm:p-6 dark:text-white mt-15">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
          <TabsTrigger value="open" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Open Orders</span>
            <span className="xs:hidden">Open</span>
            <span className="ml-1">({openOrders?.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Order History</span>
            <span className="xs:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-3 sm:mt-4">
          <OrderTable
            orders={openOrders}
            high={high}
            low={low}
            volume={volume}
            isOpen={true}
            change={change}
            countdown={countdown}
            candleColor={candleColor}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-3 sm:mt-4">
          <OrderTable orders={orderHistory} isOpen={false} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const OrderTable = ({ orders, isOpen, high, low, volume, countdown, change, candleColor }) => {
  if (orders?.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground">
        <p className="text-sm sm:text-base">No orders found</p>
      </div>
    );
  }

  return (
    <>
      {isOpen ? (
        <First
          tradingDetails={orders[0]}
          high={high}
          low={low}
          volume={volume}
          change={change}
          candleColor={candleColor}
        />
      ) : (
        orders?.map((order, i) => <HistoryCard key={i} order={order} />)
      )}
    </>
  );
};
