import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Context from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased bg-primary text-t-primary px-5`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
          <Context>
            <Header />
            {children}
            <Footer />
          </Context>
        </ThemeProvider>
      </body>
    </html>
  );
}
