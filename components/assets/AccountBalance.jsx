"use client"
import { BadgeDollarSign, CloudDownload, CloudUpload, Eye, EyeOff, FolderSync, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react"; // Import useState hook

function AccountBalance({ showBalance, toggleBalanceVisibility }) {
    const [isLoading, setIsLoading] = useState(false); // State for loading

    const handleRefresh = () => {
        setIsLoading(true); 
        setTimeout(() => {
            setIsLoading(false);
        }, 1500); 
    };

    return (
        <div>
            <div className="flex items-center gap-x-5">
                <h4 className="text-xl lg:text-4xl font-semibold text-black dark:text-white">Account Balance(USDT)</h4>
                <div className="flex gap-x-2">
                    {showBalance ? (
                        <Eye onClick={toggleBalanceVisibility} className="cursor-pointer" />
                    ) : (
                        <EyeOff onClick={toggleBalanceVisibility} className="cursor-pointer" />
                    )}
                    <RefreshCw
                        className={`cursor-pointer ${isLoading ? 'animate-spin' : ''}`} 
                        onClick={handleRefresh}
                    />
                </div>
            </div>
            <h3 className="text-3xl font-semibold text-black dark:text-white mt-2">
                {showBalance ? "0.00" : "****"}
            </h3>

            {isLoading && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-10 flex items-center justify-center z-50">
                    <div className="w-20 h-20 border-4 border-t-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="flex items-center text-center gap-x-5 mt-10">
                <Link href="/recharge-deposit" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer dark:bg-gray-800">
                    <CloudUpload className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="text-[14px] md:text-base font-medium dark:text-white text-black mt-1">Deposit</h4>
                </Link>
                <Link href="/withdraw" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer dark:bg-gray-800">
                    <CloudDownload className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="text-[14px] md:text-base font-medium dark:text-white text-black mt-1">Withdraw</h4>
                </Link>
                <Link href="/convert" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer dark:bg-gray-800">
                    <FolderSync className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="text-[14px] md:text-base font-medium dark:text-white text-black mt-1">Convert</h4>
                </Link>
                <Link href="/transfer" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer dark:bg-gray-800">
                    <BadgeDollarSign className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="text-[14px] md:text-base font-medium dark:text-white text-black mt-1">Transfer</h4>
                </Link>
            </div>
        </div>
    );
}

export default AccountBalance;