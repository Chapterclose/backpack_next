"use client";

import { contextProvider } from "@/contexts/Context";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext } from "react";
import { BiRightArrowAlt, BiTrendingUp } from "react-icons/bi";
import { HiShieldCheck } from "react-icons/hi";
import { RiGlobalLine } from "react-icons/ri";
import Button from "../Form/Button";
import HeroSectionTab from "./HeroSectionTab";

function HeroSection() {
  const { walletAddress, connectWallet } = useContext(contextProvider);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const stats = [
    { icon: <RiGlobalLine className="text-2xl" />, value: "282M+", label: "Users Worldwide" },
    { icon: <HiShieldCheck className="text-2xl" />, value: "99.9%", label: "Uptime" },
    { icon: <BiTrendingUp className="text-2xl" />, value: "$2.5T+", label: "Trading Volume" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <motion.div
        className="container relative z-10 py-12 md:py-16 lg:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-sm font-medium text-primary-200 dark:text-primary mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Crypto Trading Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary-200 to-primary bg-clip-text text-transparent">
                  Trade Crypto
                </span>
                <br />
                <span className="text-black dark:text-white">
                  Like a Pro
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Join millions of traders worldwide. Fast, secure, and reliable cryptocurrency trading platform.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                    {stat.icon}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-black dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            {walletAddress === "" && (
              <motion.div variants={itemVariants} className="pt-4">
                <Button 
                  handleFunc={connectWallet} 
                  text="Connect Wallet" 
                  className="px-8 py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                />
              </motion.div>
            )}
          </div>

          {/* Right Column - Market Ticker */}
          <motion.div variants={itemVariants} className="mt-8 lg:mt-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <HeroSectionTab />
              <motion.div variants={itemVariants} className="mt-6">
                <Link
                  prefetch
                  href="/markets"
                  className="inline-flex items-center gap-2 text-primary-200 dark:text-primary font-semibold hover:gap-3 transition-all duration-300 group"
                >
                  View all Markets <BiRightArrowAlt className="text-xl group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSection;
