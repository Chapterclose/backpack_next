import { cryptoSites } from "@/constant";
import Image from "next/image";

export default function BuyPage() {
  return (
    <div className="bg-black min-h-screen text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Buy Cryptocurrency Worldwide</h1>

        <div className="grid grid-cols-1 gap-4">
          {cryptoSites.map((item, index) => (
            <a
              key={index}
              href={item.url}
              rel="noopener noreferrer"
              className="
                group 
                flex items-center justify-between
                p-4 rounded-xl
                bg-gradient-to-r from-gray-900 to-gray-800
                border border-gray-700
                transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_20px_rgba(0,255,200,0.3)]
                hover:border-teal-400
              "
            >
              <div className="flex items-center gap-4">
                {/* Logo */}
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 transition"
                />

                {/* Name */}
                <span className="text-xl font-medium group-hover:text-teal-300 transition">
                  {item.name}
                </span>
              </div>

              {/* Buy button */}
              <span className="text-teal-300 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition">
                Buy →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
