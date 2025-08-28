import axios from "axios";
import clsx from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Format a Date to a readable string (e.g., "26 Jul 2025")
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Capitalize the first letter of a string
export const capitalize = (str) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate a long string with ellipsis
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

// Parse URL query string into an object
export const parseQuery = (urlSearchParams) => {
  const query = {};
  for (const [key, value] of urlSearchParams.entries()) {
    query[key] = value;
  }
  return query;
};

// Convert object to query string (e.g., ?page=1&sort=asc)
export const toQueryString = (obj = {}) => {
  return (
    "?" +
    Object.entries(obj)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join("&")
  );
};

// Safe JSON parsing
export const safeJsonParse = (str, fallback = {}) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Axios

const baseURL = "https://backpack-backend-qv40.onrender.com/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Prefer localStorage token; fall back to cookies (Next.js server cookies or document.cookie on client)
api.interceptors.request.use(async (config) => {
  let token = "";

  // Client-side: try localStorage first, then js-cookie
  if (typeof window !== "undefined") {
    try {
      token = window.localStorage?.getItem("access") || "";
    } catch {
      token = "";
    }
    if (!token) {
      try {
        token = Cookies.get("access") || "";
      } catch {
        token = "";
      }
    }
  } else {
    // Server-side rendering: skip attaching Authorization here to avoid importing server-only APIs in client bundles.
    // If you need SSR-authenticated requests, create a server-only axios instance in that server context.
    token = "";
  }

  // Apply Authorization header only when we have a token
  if (!config.headers) config.headers = {};
  if (token) {
    // Use correct casing
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Ensure we don't send a stale/empty header
    // @ts-ignore
    delete config.headers.Authorization;
    // Also remove any accidental uppercase header
    // @ts-ignore
    delete config.headers.AUTHORIZATION;
  }

  return config;
});

export default api;

export const apiWithoutToken = axios.create({
  baseURL,
  timeout: 10000,
});

// comma separator
export const AmountWithCommas = (amount, coin) => {
  if (amount === null || amount === undefined || amount === "") {
    return "0.00";
  }

  const num = Number(amount);
  if (isNaN(num)) {
    return "0.00";
  }

  let decimalPlaces;
  const lowerCoin = coin?.toLowerCase();

  if (lowerCoin === "usd") {
    decimalPlaces = 2;
  } else if (lowerCoin === "eth" || lowerCoin === "btc") {
    decimalPlaces = 7;
  } else {
    // Default to 2 decimal places for other coins
    decimalPlaces = 2;
  }

  // Convert the number to a string and handle the sign
  const isNegative = num < 0;
  const absNumString = Math.abs(num).toString();

  // Split the number into integer and decimal parts
  let [integerPart, decimalPart] = absNumString.split(".");

  // Truncate or pad the decimal part to the required length
  if (!decimalPart) {
    decimalPart = "0".repeat(decimalPlaces);
  } else if (decimalPart.length > decimalPlaces) {
    decimalPart = decimalPart.substring(0, decimalPlaces);
  } else {
    decimalPart = decimalPart.padEnd(decimalPlaces, "0");
  }

  // Add commas to the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const finalFormattedNumber = `${isNegative ? "-" : ""}${formattedIntegerPart}.${decimalPart}`;

  return finalFormattedNumber;
};

// Delay function (useful in testing or debounce simulations)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
