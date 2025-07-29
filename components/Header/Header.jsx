"use client";

import { contextProvider } from "@/contexts/AuthContext";
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
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import MobileNav from "./MobileNav";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(contextProvider);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: '/en', icon: Home, label: 'Home' },
    { href: '/en/markets', icon: ChartNoAxesCombined, label: 'Markets' },
    { href: '/en/trade', icon: Activity, label: 'Trade' },
    { href: '/en/assets', icon: BookA, label: 'Assets' },
    { href: '/en/primary-certification', icon: ShieldCheck, label: 'Primary Certification' },
    { href: '/en/real-name-authentication', icon:CircleUserRound, label: 'Real-name Authentication' },
    { href: '/en/bind-card-bank', icon:CreditCard, label: 'Bind Bank Card' },
    { href: '/en/set-fund-password', icon:FileLock, label: 'Set Fund Password' },
    { href: '/en/set-login-password', icon:Lock, label: 'Set Login Password' },
    { href: '/en/email-authentication', icon:Mail, label: 'Email Authenticaion' },
    { href: '/en/service-terms', icon:Layers, label: 'Service Terms' },
    { href: '/en/help-center', icon:BadgeInfo, label: 'Help Center' },
    // { href: '/en/e', icon:Globe, label: 'English' },
  ];

  return (
    <>
      {/* Desktop Header */}
      <div className="shadow-lg px-6">
        <div className="py-5 lg:flex items-center justify-between relative hidden">
          {/* Left */}
          <div className="flex items-center">
            <div className="logo mr-10">
              <Link href="/">
                <h3 className="text-primary-100 font-semibold">
                  <span className="text-xl font-bold">B</span>ack
                  <span className="text-xl font-bold">P</span>ack{" "}
                  <span className="text-xl font-bold">E</span>xchange
                </h3>
              </Link>
            </div>
            <div className="hidden lg:block">
              <ul className="flex gap-x-8">
                <Link
                  href="/markets"
                  className="font-semibold p-1 hover:text-primary-100 duration-300"
                >
                  Markets
                </Link>
                <Link
                  href="/trade"
                  className="font-semibold p-1 hover:text-primary-100 duration-300"
                >
                  Trade
                </Link>
                <Link
                  href="/assets"
                  className="font-semibold p-1 hover:text-primary-100 duration-300"
                >
                  Assets
                </Link>
              </ul>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-x-5">
            <UserCircle
              className="cursor-pointer text-green-500"
              onClick={() => setMobileMenuOpen(true)}
            />
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Left 20% Overlay */}
        <div
          className={`w-[70%] bg-black/20 backdrop-blur transition-opacity duration-300`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Right 80% Panel */}
        <div
          className={`w-[30%] bg-gray-900 text-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-end px-6 py-6 border-b border-gray-800">
            <button
              className="text-white text-2xl ml-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 mb-3">
            <h4 className="text-xl font-medium">Email: user@email.com</h4>
            <h4 className="text-xl font-medium">UID: 5295</h4>
            <p className="text-gray-500">Credit Score: 100</p>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col px-6 pt-6 space-y-4">
            {navItems.slice(4).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold flex gap-x-3 ${
                      pathname === item.href
                        ? "text-yellow-400"
                        : "hover:text-yellow-300"
                    }`}
                  >
                    {Icon && <Icon />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Mobile Nav Component */}
      <MobileNav />
    </>
  );
};

export default Header;
