"use client";

import { userDashboardMenus } from "@/constant";
import { contextProvider } from "@/contexts/AuthContext";
import Link from "next/link";
import { useContext, useState } from "react";
import { BiMenu, BiSearch, BiUserCircle } from "react-icons/bi";
import MobileNav from "./MobileNav";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(contextProvider);
  const [toggleUserMenu, setToggleUserMenu] = useState(false);

  return (
    <>
      <div className="bg-primary py-5 lg:flex items-center justify-between relative hidden">
        {/* left Side  */}
        <div className="flex items-center">
          <div className="logo mr-10">
            <Link href="/">
              <h3 className="text-orange-500 dark:text-orange-300 font-semibold">
                <span className="text-xl font-bold">B</span>ack
                <span className="text-xl font-bold">P</span>ack{" "}
                <span className="text-xl font-bold">E</span>xchange
              </h3>
            </Link>
          </div>
          <div className="hidden lg:block">
            <ul className="flex gap-x-8">
              <Link href="/markets/overview" className="font-semibold p-1">
                Markets
              </Link>
              <Link href="/trade" className="font-semibold p-1">
                Trade
              </Link>
            </ul>
          </div>
        </div>
        {/* Right Side  */}
        <div className="flex items-center gap-x-5">
          <span className="hidden lg:block">
            <BiSearch className="cursor-pointer text-xl" />
          </span>
          {isLoggedIn && (
            <span>
              <BiUserCircle
                onClick={() => setToggleUserMenu(!toggleUserMenu)}
                className="text-xl cursor-pointer"
              />
            </span>
          )}
          <span className="lg:hidden">
            <BiMenu className="text-xl cursor-pointer" />
          </span>
          {!isLoggedIn && (
            <div className="hidden lg:block">
              <Link
                onClick={() => setIsLoggedIn(true)}
                href="/"
                className="font-semibold text-white p-[5px_10px] bg-gray-100 hover:bg-gray-500 rounded mr-3"
              >
                Log In
              </Link>
              <Link
                onClick={() => setIsLoggedIn(true)}
                href="/"
                className="font-semibold p-[5px_10px] text-black bg-yellow-300 hover:bg-yellow-500 rounded"
              >
                Sign Up
              </Link>
            </div>
          )}

          <ThemeSwitcher />
        </div>

        {/* Desktop User Dropdown  */}
        {toggleUserMenu ? (
          <div className="absolute max-w-[300px] shadow-2xl rounded right-[20px] top-[70px] bg-primary-100 dark:bg-gray-100 hidden lg:block z-10">
            <div className="px-[15px] mt-4">
              <h4>monib2025@gmail.com</h4>
            </div>
            <ul className="mt-4">
              {userDashboardMenus?.map((item) => (
                <Link
                  href={`${item.url}`}
                  key={item.id}
                  onClick={() => setToggleUserMenu(false)}
                  className="p-[8px_15px] hover:bg-gray-700 cursor-pointer flex items-center gap-x-2 hover:text-white group"
                >
                  <item.icon className="text-gray-400 group-hover:text-white duration-300" />{" "}
                  {item.title}
                </Link>
              ))}
              {/* <li className="p-[8px_15px] hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-x-2 group">
                <BiMoon className="text-gray-400 group-hover:text-white duration-300" />{" "}
                Theme
              </li> */}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Mobile Nav  */}
      <MobileNav />
    </>
  );
};

export default Header;
