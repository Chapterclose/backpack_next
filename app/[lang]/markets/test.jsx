"use client";
import { useEffect, useState } from "react";

export default function CryptoMarkets() {
  const [coins, setCoins] = useState([]);

  // Fetch CoinGecko data
  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
      );
      const data = await res.json();
      setCoins(data);
    } catch (error) {
      console.error("Failed to fetch CoinGecko data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // initial fetch

    const interval = setInterval(() => {
      fetchData(); // poll every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top 10 Cryptos (Live Update)</h1>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Symbol</th>
            <th className="border px-4 py-2 text-left">Price (USD)</th>
            <th className="border px-4 py-2 text-left">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className="hover:bg-gray-50 transition">
              <td className="border px-4 py-2 flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                {coin.name}
              </td>
              <td className="border px-4 py-2 uppercase">{coin.symbol}</td>
              <td className="border px-4 py-2">
                ${coin.current_price.toLocaleString()}
              </td>
              <td
                className={`border px-4 py-2 ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
