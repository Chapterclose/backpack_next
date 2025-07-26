import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap", // Optimizes font loading
  variable: "--font-poppins", // Defines a CSS variable
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify desired weights
});

export const metadata = {
  title: "Backpack Trading App",
  description: "Most advanced trading app for crypto",
  keywords: ["crypto", "trading", "app", "advanced", "finance"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
