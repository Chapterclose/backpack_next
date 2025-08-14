"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import DWStore from "@/store/DWStore";
import { ArrowLeft, BookMarked, Camera, Copy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { twMerge } from "tailwind-merge";

function RechargeApply() {
    const searchParams = useSearchParams();
    const coin = searchParams.get("coin");
    const fileInputRef = useRef(null);
    const { GeRechargeAddressRequest, rechargeAddress ,RechargeDepositRequest, isLoading} = DWStore();

    const [rechargeAmount, setRechargeAmount] = useState("");
    const [selectedScreenshot, setSelectedScreenshot] = useState(null); 
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
        }
    };

    // Function to copy text to clipboard
    const copyToClipboard = async () => {
        if (rechargeAddress) {
            try {
                await navigator.clipboard.writeText(rechargeAddress);
                setCopiedMessage(true);
                setTimeout(() => {
                    setCopiedMessage(false);
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy address. Please try manually.');
            }
        }
    };

    useEffect(() => {
        GeRechargeAddressRequest();
    }, []);

    const handleSubmit = async () => {
        // Validation
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
            return; // Stop if there are validation errors
        }
        const currency = coin ? coin.toUpperCase() : ''; 

        // Create FormData object
        const formData = new FormData();
        formData.append("currency", currency);
        formData.append("amount", amount);
        formData.append("screenshot", selectedScreenshot);
        try {
            await RechargeDepositRequest(formData)
            setRechargeAmount("");
            setSelectedScreenshot(null);
            fileInputRef.current.value = '';
        } catch (error) {
            console.error('Error submitting recharge:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container py-[60px]">
            <div className="flex items-center justify-between mb-5">
                <h4 className="text-xl lg:text-3xl font-semibold dark:text-white text-black mb-4 flex gap-x-3">
                    <button onClick={() => window.history.back()}> <ArrowLeft className="pt-1 cursor-pointer" /> </button>
                    Recharge <span className="uppercase">{coin}</span></h4>

                <Link href="/recharge-order" className="flex items-center gap-x-1 lg:text-xl font-semibold border border-primary-100 p-[2px_10px] lg:p-[5px_15px] rounded hover:border-primary-200 duration-300 mt-[-10px] lg:mt0 dark:text-white">History <BookMarked className="mt-1" /></Link>
            </div>
            
            {rechargeAddress !== null  && <QRCode
                size={200}
                style={{ height: "200", maxWidth: "100%", width: "200", margin:"0 auto" }}
                value={rechargeAddress}
                viewBox={`0 0 200 200`}
            />}

            <div className="mt-5 mb-5 relative">
                <h4 className="text-lg mb-2 block font-medium dark:text-white">Recharge Address (<span className="uppercase">{coin}</span>)</h4>
                <p className="flex items-center gap-x-3 dark:text-white text-gray-900 text-xs lg:text-base">
                    {rechargeAddress === "" ? "Loading..." : rechargeAddress}
                    <Copy
                        className="text-green-500 cursor-pointer w-4 h-4"
                        onClick={copyToClipboard}
                    />
                    {copiedMessage && (
                        <span className="absolute top-2 left-[250px] lg:left-[350px]  bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">Copied!</span>
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
                    if (/^\d*\.?\d*$/.test(value) || value === '') { 
                        setRechargeAmount(value);
                    }
                    setAmountError("");
                }}
                className="md:max-w-[375px] mb-2" 
            />
            {amountError && <p className="text-red-500 text-sm mb-5 md:max-w-[375px]">{amountError}</p>}


            <div className="mb-2"> {/* Reduced margin for error message */}
                <h4 className="text-lg mb-2 block font-medium dark:text-white">Upload Screenshot or payment details</h4>
                <div
                    className={twMerge(
                        "w-full px-3 py-3 border-[1px] border-gray-300 dark:border-white rounded-md shadow-sm",
                        "h-36 flex items-center justify-center cursor-pointer",
                        "hover:border-primary hover:ring-1 hover:ring-primary transition",
                        "dark:bg-gray-700 dark:text-white",
                        "md:max-w-[375px]",
                        selectedScreenshot ? "border-green-500" : "" 
                    )}
                    onClick={handleClick}
                >
                    {selectedScreenshot ? (
                        <p className="text-green-500 text-center">File Selected: {selectedScreenshot.name}</p>
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
            {screenshotError && <p className="text-red-500 text-sm mb-5 md:max-w-[375px]">{screenshotError}</p>}


            <Button
                text="Confirm Recharge"
                className={"mt-5 w-full md:w-auto"}
                handleFunc={handleSubmit} // Attach handleSubmit here
            />
        </div>
    );
}

export default RechargeApply;