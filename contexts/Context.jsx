"use client";

import { createContext, useState } from "react";

export const contextProvider = createContext();

const Context = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [markets, setMarkets] = useState({})

  const values = {
    isLoggedIn,
    setIsLoggedIn,
    markets,
    setMarkets
  };

  return <contextProvider.Provider value={values}>{children}</contextProvider.Provider>;
};

export default Context;
