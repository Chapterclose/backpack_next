"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const contextProvider = createContext();

const Context = ({ children }) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [markets, setMarkets] = useState({})
  const [primaryCertified, setPrimaryCertified] = useState(false)
  const [walletAddress, setWalletAddress] = useState("");

  // Connect to MetaMask
    const connectWallet = async () => {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }
  
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("MetaMask connection error:", error);
      }
    };
  
    // Auto-load wallet if already connected
    useEffect(() => {
      const checkWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        }
      };
      checkWallet();
    }, []);

    const handleLogout=()=>{
      setWalletAddress("")
      router.push("/")
    }

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
    handleLogout
  };

  return <contextProvider.Provider value={values}>{children}</contextProvider.Provider>;
};

export default Context;
