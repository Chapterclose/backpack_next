import axios from 'axios';
import clsx from "clsx";
import Cookies from 'js-cookie';
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

const baseURL = 'https://backpack-backend-qv40.onrender.com/api';
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "AUTHORIZATION":`Bearer ${Cookies.get('access')}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000,
});

export default api;

export const apiWithoutToken = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});




// Delay function (useful in testing or debounce simulations)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
