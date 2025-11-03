"use client";
import { AmountWithCommas } from "@/lib/utils";
import UserStore from "@/store/UserStore";
import {
  BadgeDollarSign,
  CloudDownload,
  CloudUpload,
  Eye,
  EyeOff,
  FolderSync,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function AccountSummary({ totalAvailableBalance, showBalance, toggleBalanceVisibility }) {
  const [isLoading, setIsLoading] = useState(false);
  const { AccountBalance, GetAccountBalanceRequest } = UserStore();

  const handleRefresh = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await GetAccountBalanceRequest();
      setIsLoading(false);
    }, 1500);
  };

  const actions = [
    {
      icon: <CloudUpload className="w-6 h-6" />,
      label: "Deposit",
      href: "/recharge-deposit",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <CloudDownload className="w-6 h-6" />,
      label: "Withdraw",
      href: "/withdraw",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FolderSync className="w-6 h-6" />,
      label: "Convert",
      href: "/convert",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <BadgeDollarSign className="w-6 h-6" />,
      label: "Transfer",
      href: "/transfer",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="relative overflow-hidden mb-8 md:mb-12">
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-black dark:text-white mb-2">
              Total Assets <span className="font-normal">(USDT)</span>
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBalanceVisibility}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isLoading ? "animate-spin" : ""
              }`}
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="mb-8">
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-2">
            {showBalance ? (
              <span className="bg-gradient-to-r from-primary-200 to-primary bg-clip-text text-transparent">
                ${AmountWithCommas(totalAvailableBalance)}
              </span>
            ) : (
              <span className="text-gray-400">****</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              prefetch
              href={action.href}
              className="group relative overflow-hidden"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 text-center mx-auto`}
              >
                {action.icon}
              </div>
              <h4 className="text-sm md:text-base font-semibold text-black dark:text-white text-center">
                {action.label}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default AccountSummary;
