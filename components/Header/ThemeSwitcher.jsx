"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BiMoon, BiSolidSun } from "react-icons/bi";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const [activeTheme, setActiveTheme] = useState("system");
  useEffect(() => setMounted(true), []);

  if (!mounted) return;
  return (
    <span className="hidden lg:block">
      {resolvedTheme === "light" && (
        <BiSolidSun onClick={() => setTheme("dark")} className="cursor-pointer text-xl" />
      )}
      {resolvedTheme === "dark" && (
        <BiMoon
          onClick={() => setTheme("light")}
          className="cursor-pointer text-xl text-white"
        />
      )}
    </span>
  );
}
