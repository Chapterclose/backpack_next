"use client";
import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdtImg from "@/assets/markets/usdt.png";
import { marketDataAssets } from "@/constant/marketArr";
import { AmountWithCommas } from "@/lib/utils";
import UserStore from "@/store/UserStore";
import Image from "next/image";

function AssetDetails({ showBalance }) {
  const { AccountBalance } = UserStore();

  const assets = [
    {
      symbol: "USDT",
      name: "Tether",
      icon: usdtImg,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      icon: btcImg,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      symbol: "TRX",
      name: "TRON",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      symbol: "XRP",
      name: "XRP",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      symbol: "SHIB",
      name: "Shiba Inu",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      symbol: "XUAT",
      name: "Ethereum",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      symbol: "BNB",
      name: "BNB",
      icon: ethImg,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  ];

  const getBalance = (asset, type) => {
    if (!showBalance) return "****";
    const balance = AccountBalance?.[asset.symbol]?.[type];
    if (!balance) return "0.00";
    return AmountWithCommas(balance, asset.symbol.toLowerCase());
  };

  return (
    <div className="space-y-2">
      <h4 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6">Asset List</h4>

      <div className="space-y-2">
        {marketDataAssets?.slice(0,10).map((asset, index) => (
          <div
            key={asset.symbol}
            className={`relative overflow-hidden rounded-xl border-2 p-2 hover:shadow-lg transition-all duration-300`}
          >
            <div className="relative">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg`}>
                  <Image
                    src={asset.icon}
                    alt={asset.symbol}
                    height={24}
                    width={24}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h4 className="text-lg text-black dark:text-white">{asset.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{asset.subname}</p>
                </div>
              </div>

              {/* Balance Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="rounded-lg p-3 md:p-4">
                  <div className="text-xs md:text-sm text-gray-500 dark:text-primary mb-1">
                    Available
                  </div>
                  <div className="text-xs md:text-lg text-black dark:text-white">
                    {getBalance(asset, "available")}
                  </div>
                </div>
                <div className="rounded-lg p-3 md:p-4">
                  <div className="text-xs md:text-sm text-gray-500 dark:text-primary mb-1">
                    Frozen
                  </div>
                  <div className="text-xs md:text-lg text-black dark:text-white">
                    {getBalance(asset, "locked")}
                  </div>
                </div>
                <div className="rounded-lg p-3 md:p-4">
                  <div className="text-xs md:text-sm text-gray-500 dark:text-primary mb-1">
                    Equivalent(USDT)
                  </div>
                  <div className="text-xs md:text-lg text-black dark:text-white">
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
