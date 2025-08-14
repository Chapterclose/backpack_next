"use client";

import UserStore from "@/store/UserStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const contextProvider = createContext();

const Context = ({ children }) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [markets, setMarkets] = useState({})
  const [primaryCertified, setPrimaryCertified] = useState(false)
  const [walletAddress, setWalletAddress] = useState("");
  const {UserLoginRequest, GetUserInfoRequest} = UserStore()

  // Connect to MetaMask
    const connectWallet = async () => {
      if (typeof window?.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }
  
      try {
        const accounts = await window?.ethereum.request({
          method: "eth_requestAccounts",
        });
        if(accounts?.length >0){
          const res = await UserLoginRequest({"metamask_id":`${accounts[0]}`})
          if(res.status === 200 || res.status === 201){
            setWalletAddress(accounts[0]);
            toast.success("User Login Success!")
          }else if(res.status === 404) {
            toast.error(res.response.data["message"])
            setWalletAddress("")
          }else if(res.status === 400){
            toast.error(res.response.data["message"])
            setWalletAddress("")
          }else if(res.status === 401){
            toast.error("Unauthorized User, Try again!")
          }
        }
      } catch (error) {
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
            const res = await GetUserInfoRequest({"metamask_id":`${accounts[0]}`})
            if(res?.status === 404){
              // toast.error(res.response.data["message"])
              setWalletAddress("");
            }else if(res.status === 401){
              setWalletAddress("")
            }
            else if(res.status === 200){
              setWalletAddress(accounts[0]);
            }
          }
        }
      };
      checkWallet();
    }, []);

    const handleLogout=()=>{
      setWalletAddress("")
      Cookies.remove('access')
      router.push("/")
      localStorage.removeItem("user-store")
      localStorage.removeItem("dw-store")
      toast.success("User Logged Out!")
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
