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

  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null); // New state for image preview
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [screenshotError, setScreenshotError] = useState("");

  const handleClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      setSelectedScreenshot(file);
      setScreenshotError(""); // Clear error if file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedScreenshot(null);
      setScreenshotPreview(null); // Clear preview if no file is selected
    }
  };

  const copyToClipboard = async () => {
    if (rechargeAddress) {
      try {
        await navigator.clipboard.writeText(rechargeAddress);
        setCopiedMessage(true);
        setTimeout(() => {
          setCopiedMessage(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy address. Please try manually.");
      }
    }
  };

  useEffect(() => {
    GeRechargeAddressRequest();
  }, []);

  const handleSubmit = async () => {
    let hasError = false;

    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      setAmountError("Please enter a valid recharge amount (greater than 0).");
      hasError = true;
    } else {
      setAmountError("");
    }

    if (!selectedScreenshot) {
      setScreenshotError("Please upload a screenshot of your payment.");
      hasError = true;
    } else {
      setScreenshotError("");
    }

    if (hasError) {
      return;
    }
    const currency = coin ? coin.toUpperCase() : "";

    const formData = new FormData();
    formData.append("currency", currency);
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

  if (isLoading) {
    return (
      <div className="container py-[40px] lg:py-[60px]">
        <div className="max-w-2xl mx-auto mb-5 animate-pulse">
          <div className="h-8 w-32 bg-gray-300 rounded mb-3"></div>
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="h-72 bg-gray-200 rounded mb-10 animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="container py-[60px]">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xl lg:text-3xl font-semibold dark:text-white text-black mb-4 flex gap-x-3">
          <button onClick={() => window.history.back()}>
            {" "}
            <ArrowLeft className="pt-1 cursor-pointer" />{" "}
          </button>
          Recharge <span className="uppercase">{coin}</span>
        </h4>

        <Link
          href="/recharge-order"
          className="flex items-center gap-x-1 lg:text-xl font-semibold border border-primary-100 p-[2px_10px] lg:p-[5px_15px] rounded hover:border-primary-200 duration-300 mt-[-10px] lg:mt0 dark:text-white"
        >
          History <BookMarked className="mt-1" />
        </Link>
      </div>

      {rechargeAddress !== null && (
        <div className="bg-white h-[200px] w-[200px] mx-auto p-1 rounded">
          <QRCode
            size={200}
            style={{
              height: "200",
              maxWidth: "100%",
              width: "200",
              margin: "0 auto",
              paddingBottom: "7px",
            }}
            value={rechargeAddress}
            viewBox={`0 0 200 200`}
          />
        </div>
      )}

      <div className="mt-5 mb-5 relative">
        <h4 className="text-lg mb-2 block font-medium dark:text-white">
          Recharge Address (<span className="uppercase">{coin}</span>)
        </h4>
        <p className="flex items-center gap-x-3 dark:text-white text-gray-900 text-[14px] lg:text-base tracking-wide">
          {rechargeAddress === "" && isLoading
            ? "0xa8d2bbE4b181948B8C78709c3603E91DCd25Ff06"
            : rechargeAddress}
          <Copy className="text-green-500 cursor-pointer w-4 h-4" onClick={copyToClipboard} />
          {copiedMessage && (
            <span className="absolute top-2 left-[270px] lg:left-[350px] bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              Copied!
            </span>
          )}
        </p>
      </div>

      <FormInput
        label="Recharge Amount"
        placeholder="Please enter"
        type="number"
        value={rechargeAmount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value) || value === "") {
            setRechargeAmount(value);
          }
          setAmountError("");
        }}
        className="md:max-w-[375px] mb-2"
      />
      {amountError && <p className="text-red-500 text-sm mb-5 md:max-w-[375px]">{amountError}</p>}

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
