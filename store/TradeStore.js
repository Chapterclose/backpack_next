import api from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const TradeStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      tradingData: null,

      countDown: 0,

      setCountdown: (value) => set({ countDown: value }),

      TradeBuySellRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post("/trade/buy-sell/", body);
          // console.log(res)
          
          // Optimistically update openOrders
          const currentOpenOrders = get().openOrders || [];
          const newTrade = res.data?.trade;
          
          set({ 
            tradingData: newTrade,
            openOrders: [newTrade, ...currentOpenOrders]
          });
          
          // toast.success(res.data["message"]);
          return res;
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      tradingDetails: null,
      TradeDetailsRequest: async (id) => {
        try {
          set({ isLoading: true });
          let res = await api.get(`/trade/trade-details/${id}/`);
          set({ tradingDetails: res.data });
          return res;
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      TradeUpdateRequest: async (id, body) => {
        try {
          set({ isLoading: true });
          let res = await api.patch(`/trade/trade-update/${id}/`, body);
          set({ tradingData: res.data?.trade });
          // toast.success(res.data["message"]);
          return res;
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
          return res;
        } catch (e) {
          console.log(e);
          set({ openOrders: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      clearOpenOrders: () => set({ openOrders: [] }),

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
          set({ orderHistory: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      tradePopupRequest: async (id) => {
        try {
          set({ isLoading: true });
          let res = await api.patch(`/trade/trade-popup-update/${id}/`);
          // console.log(res)
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      transferRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post(`/trade/transfer/`, body);
          console.log(res);
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
        tradingData: state.tradingData,
        tradingDetails: state.tradingDetails,
        openOrders: state.openOrders,
        orderHistory: state.orderHistory,
        countDown: state.countDown,
      }),
    }
  )
);

export default TradeStore;
