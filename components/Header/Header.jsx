'use client';

import { contextProvider } from "@/contexts/Context";
import {
  Activity,
  BadgeInfo,
  BookA,
  ChartNoAxesCombined,
  CircleUserRound,
  CreditCard,
  FileLock,
  Home,
  Layers,
  Lock,
  Mail,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import MobileNav from "./MobileNav";
import ThemeSwitcher from "./ThemeSwitcher";
import toast, { Toaster } from 'react-hot-toast';
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Logo from "@/assets/backpack-logo.png"

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, primaryCertified, setPrimaryCertified } =
    useContext(contextProvider);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/en/primary-certification",
      icon: ShieldCheck,
      label: "Primary Certification",
    },
    {
      href: "/en/real-name-authentication",
      icon: CircleUserRound,
      label: "Real-name Authentication",
      protected: true, 
    },
    { href: "/en/bind-card-bank", icon: CreditCard, label: "Bind Bank Card" },
    { href: "/en/set-fund-password", icon: FileLock, label: "Set Password" },
    { href: "/en/email-authentication", icon: Mail, label: "Email Authentication" },
    { href: "/en/service-terms", icon: Layers, label: "Service Terms" },
    { href: "/en/help-center", icon: BadgeInfo, label: "Help Center" },
  ];

  const handleNavItemClick = (item) => {
    if (item.protected && !primaryCertified) {
      toast.error("Please complete primary certification first.");
    } else {
      router.push(item.href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Desktop Header */}
      <div className="shadow-lg dark:shadow-2xl px-6 dark:bg-dark dark:text-white">
        <div className="py-3 lg:flex items-center justify-between relative hidden">
          {/* Left Section: Logo and Main Nav Links */}
          <div className="flex items-center">
            <div className="logo mr-10">
              <Link href="/">
                <Image
                  src={Logo}
                  alt="logo"
                  className="w-[180px] h-[60px]"
                />
              </Link>
            </div>
            <div className="hidden lg:block">
              <ul className="flex gap-x-8">
                <Link
                  href="/en/markets"
                  className="font-semibold p-1 hover:text-primary-100 duration-300"
                >
                  Markets
                </Link>
                <Link
                  href="/en/trade?symbol=btc"
                  className="font-semibold p-1 hover:text-primary-100 duration-300"
                >
                  Trade
                </Link>
                <Link
                  href="/en/assets"
                  className="font-semibold p-1 hover:text-primary-100 duration-300"
                >
                  Assets
                </Link>
              </ul>
            </div>
          </div>

          {/* Right Section: UserCircle and ThemeSwitcher */}
          <div className="flex items-center gap-x-5">
            <UserCircle
              className="cursor-pointer text-green-500"
              onClick={() => setMobileMenuOpen(true)} // Opens the mobile drawer
            />
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-[70%] bg-black/20 backdrop-blur transition-opacity duration-300`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div
          className={`w-[30%] bg-gray-900 text-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-end px-6 py-6 border-b border-gray-800">
            <button
              className="text-white text-2xl ml-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>
          <div className="px-6 mb-3">
            <h4 className="text-xl font-medium">Email: user@email.com</h4>
            <h4 className="text-xl font-medium">UID: 5295</h4>
            <p className="text-gray-500">Credit Score: 100</p>
          </div>

          {/* Mobile Menu Items */}
          <ul className="flex flex-col px-6 pt-6 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavItemClick(item)}
                    className={twMerge(
                      "text-lg font-semibold flex gap-x-3 items-center w-full text-left",
                      pathname === item.href
                        ? "text-yellow-400"
                        : "hover:text-yellow-300"
                    )}
                  >
                    {Icon && <Icon />}
                    {item.label}
                  </button>
                </li>
              );
            })}
            {/* Conditional Logout button based on isLoggedIn */}
            {isLoggedIn && (
              <li>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMobileMenuOpen(false);
                    router.push('/en/login');
                    toast.info("You have been logged out."); // Logout toast
                  }}
                  className="text-lg font-semibold flex gap-x-3 items-center w-full text-left text-red-500 hover:text-red-600 transition-colors"
                >
                  <Lock />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>


            {/* Mobile Nav  */}
      <MobileNav />
    </>
  );
};

export default Header;