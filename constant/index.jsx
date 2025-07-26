import { AiOutlineCloseSquare, AiOutlineSetting } from "react-icons/ai";
import {
  BiBarChart,
  BiSolidDashboard,
  BiSolidNotification,
  BiSolidShoppingBags,
  BiStar,
  BiTrendingUp,
  BiWallet,
} from "react-icons/bi";
import { FaHandHoldingUsd } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbHexagons } from "react-icons/tb";

// User Dashboard Menus
export const userDashboardMenus = [
  {
    id: 1,
    title: "Dashboard",
    icon: BiSolidDashboard,
    url: "/my/dashboard",
  },
  {
    id: 2,
    title: "Markets",
    icon: BiBarChart,
    url: "/markets/overview",
  },
  {
    id: 9,
    title: "Leverage",
    icon: AiOutlineCloseSquare,
    url: "/leverage",
  },

  {
    id: 11,
    title: "Arbitrage",
    icon: BiSolidShoppingBags,
    url: "/arbitrage",
  },
  {
    id: 12,
    title: "Help Loan",
    icon: FaHandHoldingUsd,
    url: "/help-loan",
  },

  {
    id: 14,
    title: "Profit Statistics",
    icon: LiaFileInvoiceDollarSolid,
    url: "/profit-statistics",
  },
  {
    id: 3,
    title: "Wallets",
    icon: BiTrendingUp,
    url: "/wallet",
  },
  {
    id: 4,
    title: "Trade",
    icon: BiWallet,
    url: "/trade",
  },
  {
    id: 99,
    title: "Mining",
    icon: TbHexagons,
    url: "/mining-machine",
  },
  {
    id: 6,
    title: "Referral",
    icon: BiStar,
    url: "/referral",
  },
  {
    id: 7,
    title: "Settings",
    icon: AiOutlineSetting,
    url: "/my/settings",
  },
  {
    id: 8,
    title: "Notification",
    icon: BiSolidNotification,
    url: "/my/notification",
  },
];

// User Dashboard Tabs
export const userDashboardMainTab = [
  {
    title: "Markets",
  },
  {
    title: "Discover",
  },
];
export const userMarketTabs = [
  {
    title: "Holding",
  },
  {
    title: "Hot",
  },
  {
    title: "New Listing",
  },
  {
    title: "Favorite",
  },
];
// order tabs
export const spotOrderTabs = [
  { title: "Open Orders" },
  { title: "Order History" },
  { title: "Trade History" },
];

// Homepage accordion data
export const homeFaqData = [
  {
    id: 1,
    title: "What is a cryptocurrency exchange?",
    url: "Cryptocurrency exchanges are digital marketplaces that enable users to buy and sell cryptocurrencies like Bitcoin, Ethereum, and Tether. The Backpack Exchange exchange is the largest crypto exchange by trade volume.",
  },
  {
    id: 2,
    title: "What products does Backpack Exchange provide?",
    url: "Backpack Exchange is the world's leading cryptocurrency exchange, catering to 169 million registered users in over 180 countries. With low fees and over 350 cryptocurrencies to trade, Backpack Exchange is the preferred exchange to trade Bitcoin, Altcoins, and other virtual assets.",
  },
  {
    id: 3,
    title: "How to buy Bitcoin and other cryptocurrencies on Backpack Exchange",
    url: "There are several ways to buy cryptocurrencies on Backpack Exchange. You can use a credit/debit card, cash balance, or Apple Pay/Google Pay to purchase crypto on Backpack Exchange. Before getting started, please make sure you’ve completed Identity Verification for your Backpack Exchange account.",
  },
  {
    id: 4,
    title: "How to track cryptocurrency prices",
    url: "The easiest way to track the latest cryptocurrency prices, trading volumes, trending altcoins, and market cap is the Backpack Exchange Cryptocurrency Directory. Click on the coins to know historical coin prices, 24-hour trading volume, and the price of cryptocurrencies like Bitcoin, Ethereum, BNB and others in real-time.",
  },
  {
    id: 5,
    title: "How to trade cryptocurrencies on Backpack Exchange",
    url: "You can trade hundreds of cryptocurrencies on Backpack Exchange via the Spot, Margin, Futures, and Options markets. To begin trading, users need to register an account, complete identity verification, buy/deposit crypto, and start trading.",
  },
  {
    id: 6,
    title: "How to earn from crypto on Backpack Exchange",
    url: "Users can earn rewards on more than 180+ cryptocurrencies by using one of the products offered on Backpack Exchange Earn. Our platform offers dozens of digital assets like Bitcoin, Ethereum, and stablecoins.",
  },
];

// trade page - Market trades and my trades tab
export const marketAndMyTradesTabs = [
  { title: "Market Trades" },
  { title: "My Trades" },
];

// Footer Data
export const footerUrls = [
  [
    {
      id: 1,
      title: "about",
      url: "/about",
    },
    {
      id: 2,
      title: "career",
      url: "/career",
    },
    {
      id: 3,
      title: "announcements",
      url: "/announcements",
    },
    {
      id: 4,
      title: "news",
      url: "/news",
    },
    {
      id: 5,
      title: "press",
      url: "/press",
    },
    {
      id: 6,
      title: "legal",
      url: "/legal",
    },
    {
      id: 7,
      title: "terms",
      url: "/terms",
    },
    {
      id: 8,
      title: "privacy",
      url: "/privacy",
    },
    {
      id: 9,
      title: "building trust",
      url: "/building trust",
    },
    {
      id: 10,
      title: "blog",
      url: "/blog",
    },
    {
      id: 11,
      title: "community",
      url: "/community",
    },
  ],
  [
    {
      id: 1,
      title: "P2P Merchant Application",
      url: "/p2p merchant application",
    },
    {
      id: 2,
      title: "P2P Pro Merchant Application",
      url: "/p2p pro merchant",
    },
    {
      id: 3,
      title: "Listing Application",
      url: "/listing application",
    },
    {
      id: 4,
      title: "Institutional & VIP Services",
      url: "/institutional services",
    },
    {
      id: 5,
      title: "labs",
      url: "/labs",
    },
  ],
  [
    {
      id: 1,
      title: "Learn & Earn",
      url: "/learn",
    },
    {
      id: 2,
      title: "Browse Crypto Prices",
      url: "/crypto",
    },
    {
      id: 3,
      title: "Bitcoin Price",
      url: "/listing application",
    },
    {
      id: 4,
      title: "Ethereum Price",
      url: "/institutional services",
    },
    {
      id: 5,
      title: "Browse Crypto Price Predictions",
      url: "/labs",
    },
    {
      id: 5,
      title: "Bitcoin Price Prediction",
      url: "/labs",
    },
    {
      id: 5,
      title: "Ethereum Price Prediction",
      url: "/labs",
    },
    {
      id: 5,
      title: "Buy Bitcoin",
      url: "/labs",
    },
  ],
  [
    {
      id: 1,
      title: "Affiliate",
      url: "/learn",
    },
    {
      id: 2,
      title: "Referral",
      url: "/crypto",
    },
    {
      id: 3,
      title: "OTC Trading",
      url: "/listing application",
    },
    {
      id: 4,
      title: "Historical Market Data",
      url: "/institutional services",
    },
    {
      id: 5,
      title: "Proof of Reserves",
      url: "/labs",
    },
  ],
  [
    {
      id: 1,
      title: "24/7 Chat Support",
      url: "/learn",
    },
    {
      id: 2,
      title: "Support Center",
      url: "/crypto",
    },
    {
      id: 3,
      title: "Product Feedback & Suggestions",
      url: "/listing application",
    },
    {
      id: 4,
      title: "Fees",
      url: "/institutional services",
    },
    {
      id: 5,
      title: "APIs",
      url: "/labs",
    },
    {
      id: 5,
      title: "BackPack Exchange Verify",
      url: "/labs",
    },
    {
      id: 5,
      title: "Trading Rules",
      url: "/labs",
    },
    {
      id: 5,
      title: "BackPack Exchange Airdrop Portal",
      url: "/labs",
    },
    {
      id: 5,
      title: "Law Enforcement Requests",
      url: "/labs",
    },
  ],
];
