import Context from "@/contexts/Context";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import ClientLayout from "./ClientLayout";
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
    <html lang="en" suppressHydrationWarning className="dark:bg-dark dark:text-white">
      <body className={`${poppins.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme>
          <Context>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Context>
        </ThemeProvider>
      </body>
    </html>
  );
}
