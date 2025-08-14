"use client";

import Logo from "@/assets/backpack-logo.png";
import { navItems } from "@/constant";
import { contextProvider } from "@/contexts/Context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { BiSolidUserCircle } from "react-icons/bi";
import MobileNav from "./MobileNav";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";
import UserStore from "@/store/UserStore";
import toast from "react-hot-toast";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error,setError] = useState(false)
  const {isLoggedIn, setIsLoggedIn, walletAddress, setWalletAddress, connectWallet} = useContext(contextProvider)
  const {UserData} = UserStore()
  const router = useRouter();

  const handleNavItemClick = (item) => {
    if (item.protected && UserData.id_number === null) {
      // setError(true)
      toast.error("Please complete primary certification first.")
    } else {
      router.push(item.href);
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [error]); 
  return (
    <>
      <div className="shadow-lg dark:shadow-2xl px-6 dark:bg-dark dark:text-white">
        <div className="py-3 lg:flex items-center justify-between relative hidden">
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
                <Link href="/en/markets" className="font-semibold p-1 hover:text-primary-100 duration-300">
                  Markets
                </Link>
                <Link href="/en/trade?symbol=btc" className="font-semibold p-1 hover:text-primary-100 duration-300">
                  Trade
                </Link>
                <Link href="/en/assets" className="font-semibold p-1 hover:text-primary-100 duration-300">
                  Assets
                </Link>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            {walletAddress !== "" ? (
              <div
                className="cursor-pointer text-green-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <BiSolidUserCircle className="text-3xl"/>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-primary hover:bg-primary-200 font-medium text-black p-[5px_20px] rounded cursor-pointer"
              >
                Log In
              </button>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>


          <UserMenu
            isLoggedIn={isLoggedIn}
            handleNavItemClick={handleNavItemClick}
            mobileMenuOpen={mobileMenuOpen}
            navItems={navItems}
            setIsLoggedIn={setIsLoggedIn}
            setMobileMenuOpen={setMobileMenuOpen}
            error={error}
          />

        
        <MobileNav/>
    </>
  );
};

export default Header;
