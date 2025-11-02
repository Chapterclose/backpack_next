"use client";

import TradeStore from "@/store/TradeStore";
import UserStore from "@/store/UserStore";
import { marketData } from "@/constant/marketArr";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

export const contextProvider = createContext();

const Context = ({ children }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [markets, setMarkets] = useState({});
  const [primaryCertified, setPrimaryCertified] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { UserLoginRequest, GetUserInfoRequest, GetAccountBalanceRequest } = UserStore();
  const [totalAvailableBalance, setTotalAvailableBalance] = useState(0);
  const { openOrders, OpenOrdersRequest, OrderHistoryRequest } = TradeStore();
  // trade countdown
  const [countdown, setCountdown] = useState(0);
  const wsRef = useRef(null);
  const abortControllerRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Fetch initial market data via REST API and establish WebSocket connection
  useEffect(() => {
    const watchedSymbols = marketData.map((data) => data.symbol);
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_URL;
    const wsUrl = process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL;

    // Create AbortController for cleanup
    abortControllerRef.current = new AbortController();

    // Fetch initial market data immediately via REST API
    const fetchInitialData = async () => {
      try {
        const symbolsParam = watchedSymbols.map(s => `"${s}"`).join(',');
        const response = await fetch(
          `${binanceUrl}/api/v3/ticker/24hr?symbols=[${symbolsParam}]`,
          { signal: abortControllerRef.current.signal }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const tickers = await response.json();
        
        // Build markets object from results
        const initialMarkets = {};
        tickers.forEach((ticker) => {
          initialMarkets[ticker.symbol] = {
            price: parseFloat(ticker.lastPrice || ticker.c || 0).toFixed(2),
            change: parseFloat(ticker.priceChangePercent || ticker.P || 0).toFixed(2),
          };
        });

        // Update markets immediately with available data
        if (Object.keys(initialMarkets).length > 0) {
          setMarkets((prev) => ({ ...prev, ...initialMarkets }));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching initial market data:", error);
        }
      }
    };

    // Start fetching immediately
    fetchInitialData();

    // Connect WebSocket for real-time updates
    if (wsUrl && !wsRef.current) {
      wsRef.current = new WebSocket(`${wsUrl}/ws/!ticker@arr`);

      wsRef.current.onmessage = (event) => {
        const now = Date.now();
        // Throttle updates to every 500ms to prevent excessive re-renders
        if (now - lastUpdateRef.current < 500) return;
        lastUpdateRef.current = now;

        try {
          const updates = JSON.parse(event.data);
          const filtered = updates.filter((ticker) =>
            watchedSymbols.includes(ticker.s)
          );

          setMarkets((prev) => {
            const updated = { ...prev };
            filtered.forEach((ticker) => {
              updated[ticker.s] = {
                price: parseFloat(ticker.c).toFixed(2),
                change: parseFloat(ticker.P).toFixed(2),
              };
            });
            return updated;
          });
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error("Market WebSocket Error:", event);
      };

      wsRef.current.onclose = () => {
        wsRef.current = null;
      };
    }

    // Cleanup function
    return () => {
      // Abort fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Close WebSocket (only if this is the last component using it)
      // Note: In a real scenario, you might want to keep WebSocket alive
      // For now, we'll close it on unmount
      if (wsRef.current) {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
          wsRef.current = null;
        }
      }
    };
  }, []); // Empty deps - only run once on mount

  // This useEffect handles fetching initial data - only when logged in
  useEffect(() => {
    if (walletAddress) {
      OpenOrdersRequest();
    }
  }, [walletAddress, OpenOrdersRequest]);

  // This useEffect handles setting the countdown when openOrders data is fetched
  useEffect(() => {
    if (openOrders?.length > 0) {
      setCountdown(openOrders[0]?.countdown_seconds);
    }
  }, [openOrders]);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window?.ethereum === "undefined") {
      alert("Connect with Web3!");
      return;
    }

    try {
      const accounts = await window?.ethereum.request({
        method: "eth_requestAccounts",
      });
      setLoading(true);
      if (accounts?.length > 0) {
        const res = await UserLoginRequest({ metamask_id: `${accounts[0]}` });
        if (res.status === 200 || res.status === 201) {
          setWalletAddress(accounts[0]);
          await GetAccountBalanceRequest();
          await OrderHistoryRequest();
          await OpenOrdersRequest();
          setLoading(false);
          toast.success("User Login Success!");
        } else if (res.status === 404) {
          toast.error(res.response.data["message"]);
          setLoading(false);
          setWalletAddress("");
        } else if (res.status === 400) {
          toast.error(res.response.data["message"]);
          setLoading(false);
          setWalletAddress("");
        } else if (res.status === 401) {
          setLoading(false);
          toast.error("Unauthorized User, Try again!");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("MetaMask connection error:", error);
    }
  };

  // Auto-load wallet if already connected
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window?.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts?.length > 0) {
          const res = await GetUserInfoRequest({ metamask_id: `${accounts[0]}` });
          if (res?.status === 404) {
            // toast.error(res.response.data["message"])
            setWalletAddress("");
          } else if (res.status === 401) {
            setWalletAddress("");
          } else if (res.status === 200) {
            setWalletAddress(accounts[0]);
          }
        }
      }
    };
    checkWallet();
  }, []);

  const handleLogout = () => {
    setWalletAddress("");
    try {
      Cookies.remove("access", { path: "/" });
    } catch {}
    router.push("/");
    try {
      localStorage.removeItem("access");
    } catch {}
    localStorage.removeItem("user-store");
    localStorage.removeItem("dw-store");
    localStorage.removeItem("realNameAuthStatus");
    localStorage.removeItem("trade-store");
    toast.success("User Logged Out!");
  };

  const values = {
    isLoggedIn,
    setIsLoggedIn,
    markets,
    setMarkets,
    primaryCertified,
    setPrimaryCertified,
    walletAddress,
    setWalletAddress,
    connectWallet,
    handleLogout,
    countdown,
    setCountdown,
    totalAvailableBalance,
    setTotalAvailableBalance,
    loading,
  };

  return <contextProvider.Provider value={values}>{children}</contextProvider.Provider>;
};

export default Context;
