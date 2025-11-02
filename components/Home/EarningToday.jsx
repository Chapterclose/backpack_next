"use client";

import { contextProvider } from "@/contexts/Context";
import { useContext } from "react";
import Button from "../Form/Button";
import { BiWallet, BiTrendingUp, BiShield } from "react-icons/bi";

function EarningToday() {
  const { walletAddress, connectWallet } = useContext(contextProvider);
  
  const features = [
    {
      icon: <BiTrendingUp className="text-3xl" />,
      title: "Low Fees",
      description: "Trade with competitive fees"
    },
    {
      icon: <BiShield className="text-3xl" />,
      title: "Secure Platform",
      description: "Your assets are protected"
    },
    {
      icon: <BiWallet className="text-3xl" />,
      title: "Fast Transactions",
      description: "Instant deposits and withdrawals"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-dark">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container relative z-10 py-16 md:py-20 lg:py-24">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black dark:text-white">
              Start Earning{" "}
              <span className="bg-gradient-to-r from-primary-200 to-primary bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Join thousands of traders making profits every day. Connect your wallet and start trading now.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          {walletAddress === "" && (
            <div className="pt-8">
              <Button 
                handleFunc={connectWallet} 
                text="Connect Wallet Now" 
                className="px-10 py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EarningToday;
