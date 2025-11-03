"use client";

import Logo from "@/assets/backpack-logo.png";
import { contextProvider } from "@/contexts/Context";
import UserStore from "@/store/UserStore";
import {
  Activity,
  BadgeInfo,
  BookA,
  ChartNoAxesCombined,
  Home, // Announcement
  Info, // Real-name Authentication
  KeyRound, // Set Fund Password
  Landmark,
  Layers,
  LogOut, // Bind Bank Card (like a bank/financial icon)
  MailCheck, // Service Terms (like a contract/terms sheet)
  Megaphone,
  ShieldCheck,
  // Custom imports for better visual representation of your items
  UserCheck,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiSolidUserCircle } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import ThemeSwitcher from "./ThemeSwitcher";

const MobileNav = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { primaryCertified, setPrimaryCertified, walletAddress, connectWallet, handleLogout } =
    useContext(contextProvider);
  const { UserData } = UserStore();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ************ Your ORIGINAL navItems RE-ORGANIZED ************
  const allNavItems = [
    { href: "/en", icon: Home, label: "Home", isBottomNav: true },
    { href: "/en/markets", icon: ChartNoAxesCombined, label: "Markets", isBottomNav: true },
    {
      href: "/en/trade?symbol=btc",
      icon: Activity,
      label: "Trade",
      dynamicPath: "/en/trade",
      isBottomNav: true,
    },
    { href: "/en/assets", icon: BookA, label: "Assets", isBottomNav: true },

    // --- Security/Account Management Group ---
    {
      href: "/en/primary-certification",
      icon: ShieldCheck,
      label: "Primary Certification",
      group: "Account & Security",
    },
    {
      href: "/en/real-name-authentication",
      icon: UserCheck, // Using UserCheck instead of CircleUserRound for R-N Auth
      label: "Real-name Authentication",
      protected: true,
      group: "Account & Security",
    },
    {
      href: "/en/bind-card-bank",
      icon: Landmark,
      label: "Bind Bank Card",
      group: "Account & Security",
    },
    {
      href: "/en/set-fund-password",
      icon: KeyRound,
      label: "Set Password",
      group: "Account & Security",
    }, // Using KeyRound instead of FileLock for Password
    {
      href: "/en/email-authentication",
      icon: MailCheck,
      label: "Email Authenticaion",
      group: "Account & Security",
    }, // Using MailCheck instead of Mail

    // --- Info/Support Group ---
    {
      href: "/en/service-terms",
      icon: Layers,
      label: "Service Terms",
      group: "Information & Help",
    },
    { href: "/en/help-center", icon: BadgeInfo, label: "Help Center", group: "Information & Help" },
  ];

  // Group items for the Sidebar display
  const sidebarNavSections = [
    {
      title: "Account & Security",
      items: allNavItems.filter((item) => item.group === "Account & Security"),
    },
    {
      title: "Information & Help",
      items: allNavItems.filter((item) => item.group === "Information & Help"),
    },
  ];

  const bottomNavItems = allNavItems.filter((item) => item.isBottomNav);

  const handleNavItemClick = (item) => {
    // Retain the original protection logic
    if (item.protected && UserData.id_number === null) {
      toast.error("Please complete primary certification first.");
    } else {
      router.push(item.href);
      setMobileMenuOpen(false);
    }
  };

  // Function to determine the Icon component for a given item
  const getIconComponent = (item) => {
    // This handles the custom icons used in the sidebar for better visual match
    if (item.label === "Real-name Authentication") return UserCheck;
    if (item.label === "Bind Bank Card") return Landmark;
    if (item.label === "Set Password") return KeyRound;
    if (item.label === "Email Authenticaion") return MailCheck;
    if (item.label === "Announcement") return Megaphone;
    if (item.label === "About Us") return Info;
    return item.icon;
  };

  return (
    <div className="lg:hidden shadow dark:shadow-2xl">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="py-2 flex items-center justify-between px-5">
        <div className="logo mr-10">
          <Link prefetch href="/">
            <Image src={Logo} alt="logo" className="w-[130px] h-[45px]" />
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-x-4">
            {walletAddress !== "" ? (
              <div
                className="cursor-pointer text-green-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <BiSolidUserCircle className="text-3xl" />
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-primary hover:bg-primary-200 font-medium text-black p-[5px_20px] rounded cursor-pointer"
              >
                Connect
              </button>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Bottom Tab Nav - Uses your original bottom items */}
      <div className="fixed bottom-0 bg-gray-900 w-full grid grid-cols-4 gap-x-2 z-[200]">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.dynamicPath
            ? pathname.startsWith(item.dynamicPath)
            : pathname === item.href;

          return (
            <Link
              prefetch
              key={item.href}
              href={item.href}
              className={`text-center py-2 text-xs ${
                isActive ? "text-green-500 font-semibold" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {Icon && <Icon className="mx-auto w-4 h-4" />}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Sidebar (Full Width) - NEW DESIGN HERE */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-900 text-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-end px-6 py-6 border-b border-gray-800">
          <button
            className="text-white text-2xl ml-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        {/* User info - Styled like the image */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg text-black">
              {UserData?.email?.charAt(0).toUpperCase() || "T"}
            </div>
            <div>
              <h4 className="text-lg font-medium">Test (UID: {UserData?.id || "20045"})</h4>
            </div>
          </div>
          <div className="flex items-center text-green-500 font-medium">Verified</div>
        </div>

        {/* Menu Items - Grid Layout */}
        <div className="overflow-y-auto h-[calc(100%-130px)]">
          <div className="flex flex-col space-y-4 pt-4">
            {sidebarNavSections.map((section, index) => (
              <div key={index} className="px-6">
                <h3 className="text-base font-bold mb-3 text-gray-300">{section.title}</h3>
                {/* 3-column Grid for the menu items */}
                <div className="grid grid-cols-3 gap-y-4 text-center">
                  {section.items.map((item) => {
                    const Icon = getIconComponent(item);
                    const isActive = item.dynamicPath
                      ? pathname.startsWith(item.dynamicPath)
                      : pathname === item.href;

                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavItemClick(item)}
                        className={twMerge(
                          "flex flex-col items-center p-2 rounded transition-colors duration-200",
                          isActive ? "text-green-500" : "text-white hover:text-green-300"
                        )}
                      >
                        {Icon && <Icon className="w-6 h-6 mb-1 mx-auto" />}
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Separator between sections */}
                {index < sidebarNavSections.length - 1 && (
                  <div className="my-4 border-b border-gray-800"></div>
                )}
              </div>
            ))}
          </div>

          {/* Log Out Button - Centered in the middle after all menus */}
          <div className="mt-20 mb-20 text-center px-6">
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="font-semibold text-lg inline-flex items-center bg-red-500 text-white p-[5px_50px] rounded-lg transition-colors duration-300"
            >
              <LogOut className="w-6 h-6 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
