"use client";
import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdtImg from "@/assets/markets/usdt.png";
import { AmountWithCommas } from "@/lib/utils";
import UserStore from "@/store/UserStore";
import Image from "next/image";
import { BiBitcoin, BiEthereum } from "react-icons/bi";

function AssetDetails({ showBalance }) {
  const { AccountBalance } = UserStore();

  const assets = [
    {
      symbol: "USDT",
      name: "Tether",
      icon: usdtImg,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      icon: btcImg,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    }
  ];

  const getBalance = (asset, type) => {
    if (!showBalance) return "****";
    const balance = AccountBalance?.[asset.symbol]?.[type];
    if (!balance) return "0.00";
    return AmountWithCommas(balance, asset.symbol.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <h4 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6">
        Asset Details
      </h4>

      <div className="space-y-4">
        {assets.map((asset, index) => (
          <div
            key={asset.symbol}
            className={`relative overflow-hidden ${asset.bgColor} rounded-xl border-2 ${asset.borderColor} p-5 md:p-6 hover:shadow-lg transition-all duration-300`}
          >
            {/* Decorative gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${asset.color} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${asset.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <Image 
                    src={asset.icon} 
                    alt={asset.symbol} 
                    height={32} 
                    width={32}
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-black dark:text-white">
                    {asset.symbol}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
                </div>
              </div>

              {/* Balance Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Available
                  </div>
                  <div className="text-base md:text-lg font-bold text-black dark:text-white">
                    {getBalance(asset, "available")}
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Locked
                  </div>
                  <div className="text-base md:text-lg font-bold text-black dark:text-white">
                    {getBalance(asset, "locked")}
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total
                  </div>
                  <div className="text-base md:text-lg font-bold text-black dark:text-white">
                    {getBalance(asset, "total")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetDetails;
