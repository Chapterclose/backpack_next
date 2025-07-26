import { userDashboardMenus } from "@/constant";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiCertification, BiMoon, BiSolidSun, BiUserCircle } from "react-icons/bi";
// import useDarkMode from "use-dark-mode";

const MobileNav = () => {
  const [toggleUserMenu, setToggleUserMenu] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  // const darkMode = useDarkMode(false);

  return (
    <div className="py-5 flex lg:hidden items-center justify-between relative no-scrollbar">
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
      </div>
      {/* Right Side  */}
      <div className="flex items-center gap-x-5">
        <span>
          <BiUserCircle
            onClick={() => setToggleUserMenu(!toggleUserMenu)}
            className="text-xl cursor-pointer"
          />
        </span>
      </div>

      {/* Mobile User Dropdown  */}
      {toggleUserMenu && (
        <div className="w-full no-scrollbar h-full dark:bg-primary bg-primary-100 fixed overflow-y-scroll left-0 top-0 right-0 z-50">
          <div className="mb-14">
            <AiOutlineClose
              onClick={() => setToggleUserMenu(false)}
              className="absolute right-5 top-5 text-xl cursor-pointer"
            />
          </div>
          <div className="pl-8">
            <h4 className="text-xl font-semibold">monib2024@gmail.com</h4>
            <button className="bg-yellow-500 text-black px-1 rounded-full mt-1 flex items-center gap-x-1 text-[14px]">
              <BiCertification /> Unverified
            </button>
          </div>

          {/* Menus  */}
          <ul className="mt-4">
            {userDashboardMenus?.map((item) => (
              <Link
                href={`${item.url}`}
                key={item.id}
                onClick={() => setToggleUserMenu(false)}
                className="p-[15px_30px] hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-x-2 group"
              >
                <item.icon className="text-gray-400 group-hover:text-white duration-300" />{" "}
                {item.title}
              </Link>
            ))}

            <li
              onClick={() => (resolvedTheme === "light" ? setTheme("dark") : setTheme("light"))}
              className="p-[15px_30px] hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-x-2 group"
            >
              {resolvedTheme === "light" && (
                <BiMoon
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer text-xl text-gray-400 group-hover:text-white"
                />
              )}
              {resolvedTheme === "dark" && (
                <BiSolidSun
                  onClick={() => setTheme("light")}
                  className="cursor-pointer text-xl text-gray-400 group-hover:text-white"
                />
              )}
              Theme
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
