"use client";

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import DWStore from "@/store/DWStore";
import { ArrowLeft, BookMarked, Camera, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { twMerge } from "tailwind-merge";

function RechargeApply() {
  const searchParams = useSearchParams();
  const coin = searchParams.get("coin");
  const fileInputRef = useRef(null);
  const { GeRechargeAddressRequest, rechargeAddress, RechargeDepositRequest, isLoading } =
    DWStore();
  const navigate = useRouter();

  // ✅ Default network type based on coin
  const [networkType, setNetworkType] = useState(
    coin?.toUpperCase() === "USDT" ? "USDT-TRC20" : coin?.toUpperCase() || "USDT-TRC20"
  );
  
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [screenshotError, setScreenshotError] = useState("");

  const handleClick = () => fileInputRef?.current?.click();

  const handleFileChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      setSelectedScreenshot(file);
      setScreenshotError("");
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedScreenshot(null);
      setScreenshotPreview(null);
    }
  };

  const copyToClipboard = async () => {
    if (rechargeAddress) {
      try {
        await navigator.clipboard.writeText(rechargeAddress);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy address. Please try manually.");
      }
    }
  };

  // ✅ Sync networkType if coin changes from URL
  useEffect(() => {
    if (coin) {
      const upperCoin = coin.toUpperCase();
      if (upperCoin === "USDT") {
        setNetworkType((prev) => (prev.startsWith("USDT") ? prev : "USDT-TRC20"));
      } else {
        setNetworkType(upperCoin);
      }
    }
  }, [coin]);

  // ✅ Call API whenever networkType changes
  useEffect(() => {
    if (networkType) {
      GeRechargeAddressRequest(networkType);
    }
  }, [networkType]);

  const handleSubmit = async () => {
    let hasError = false;
    const amount = parseFloat(rechargeAmount);

    if (isNaN(amount) || amount <= 0) {
      setAmountError("Please enter a valid recharge amount (greater than 0).");
      hasError = true;
    } else setAmountError("");

    if (!selectedScreenshot) {
      setScreenshotError("Please upload a screenshot of your payment.");
      hasError = true;
    } else setScreenshotError("");

    if (hasError) return;

    const formData = new FormData();
    formData.append("currency", networkType); // ✅ Send networkType
    formData.append("amount", amount);
    formData.append("screenshot", selectedScreenshot);

    try {
      await RechargeDepositRequest(formData);
      setRechargeAmount("");
      setSelectedScreenshot(null);
      setScreenshotPreview(null);
      fileInputRef.current.value = "";
      navigate.push("/recharge-order");
    } catch (error) {
      console.error("Error submitting recharge:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // === JSX Below ===
  return (
    <div className="container py-[60px]">
      {/* Heading */}
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xl lg:text-3xl font-semibold dark:text-white text-black mb-4 flex gap-x-3">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="pt-1 cursor-pointer" />
          </button>
          Recharge <span className="uppercase">{coin}</span>
        </h4>

        <Link
          prefetch
          href="/recharge-order"
          className="flex items-center gap-x-1 lg:text-xl font-semibold border border-primary-100 p-[2px_10px] lg:p-[5px_15px] rounded hover:border-primary-200 duration-300 mt-[-10px] lg:mt0 dark:text-white"
        >
          History <BookMarked className="mt-1" />
        </Link>
      </div>

      {/* ✅ Network Tabs */}
      {coin?.toLowerCase() === "usdt" && (
        <div className="flex justify-center gap-2 mb-5">
          <button
            onClick={() => setNetworkType("USDT-TRC20")}
            className={`px-4 py-2 rounded-md border transition ${
              networkType === "USDT-TRC20"
                ? "bg-[#00B894] text-white border-[#00B894]"
                : "bg-white text-[#00B894] border-[#00B894]"
            }`}
          >
            TRC20
          </button>
          <button
            onClick={() => setNetworkType("USDT-ERC20")}
            className={`px-4 py-2 rounded-md border transition ${
              networkType === "USDT-ERC20"
                ? "bg-[#00B894] text-white border-[#00B894]"
                : "bg-white text-[#00B894] border-[#00B894]"
            }`}
          >
            ERC20
          </button>
        </div>
      )}

      {/* QR Code */}
      {rechargeAddress && (
        <div className="bg-white h-[200px] w-[200px] mx-auto p-1 rounded">
          <QRCode value={rechargeAddress} size={200} />
        </div>
      )}

      {/* Address + Copy */}
      <div className="mt-5 mb-5 md:max-w-[375px]">
        <h4 className="text-lg mb-2 block font-medium dark:text-white">
          Recharge Address ({networkType})
        </h4>
        <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="dark:text-white text-gray-900 text-[14px] lg:text-base tracking-wide break-all">
            {rechargeAddress}
          </p>
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 bg-[#00B894] hover:bg-[#009b7c] text-white px-4 py-2 rounded-md transition-colors w-full"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">{copiedMessage ? "Copied!" : "Copy Address"}</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      <FormInput
        label="Recharge Amount"
        placeholder="Please enter"
        type="number"
        value={rechargeAmount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value) || value === "") setRechargeAmount(value);
          setAmountError("");
        }}
        className="md:max-w-[375px] mb-2"
      />
      {amountError && <p className="text-red-500 text-sm mb-5 md:max-w-[375px]">{amountError}</p>}

      {/* Screenshot Upload */}
      <div className="mb-2">
        <h4 className="text-lg mb-2 block font-medium dark:text-white">
          Upload Screenshot or payment details
        </h4>
        <div
          className={twMerge(
            "w-full px-3 py-3 border-[1px] border-gray-300 dark:border-white rounded-md shadow-sm",
            "h-36 flex items-center justify-center cursor-pointer overflow-hidden",
            "hover:border-primary hover:ring-1 hover:ring-primary transition",
            "dark:bg-gray-700 dark:text-white",
            "md:max-w-[375px]",
            selectedScreenshot ? "border-green-500" : ""
          )}
          onClick={handleClick}
        >
          {screenshotPreview ? (
            <img
              src={screenshotPreview}
              alt="Screenshot Preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      {screenshotError && (
        <p className="text-red-500 text-sm mb-5 md:max-w-[375px]">{screenshotError}</p>
      )}

      <Button
        text="Confirm Recharge"
        className={"mt-5 w-full md:w-auto"}
        handleFunc={handleSubmit}
      />
    </div>
  );
}

export default RechargeApply;
