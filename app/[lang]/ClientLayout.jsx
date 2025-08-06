'use client';

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
