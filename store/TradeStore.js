import api from "@/lib/utils";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const TradeStore = create(
  persist(
    (set) => ({
      isLoading: false,
      TradeBuySellRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post("/trade/buy-sell/", body, {
            headers: {
              AUTHORIZATION: `Bearer ${Cookies.get("access")}`,
              "Content-Type": "application/json",
            },
          });
          toast.success(res.data["message"]);
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      openOrders: null,
      OpenOrdersRequest: async () => {
        try {
          set({ isLoading: true });
          let res = await api.get("/trade/open-orders/");
          if (res.status === 200) {
            set({ openOrders: res?.data?.open_orders });
          }
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      orderHistory: null,
      OrderHistoryRequest: async () => {
        try {
          set({ isLoading: true });
          let res = await api.get("/trade/order-history/");
          if (res.status === 200) {
            set({ orderHistory: res?.data?.order_history });
          }
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "trade-store",
      partialize: (state) => ({
        openOrders: state.openOrders,
        orderHistory: state.orderHistory,
      }),
    }
  )
);

export default TradeStore;
