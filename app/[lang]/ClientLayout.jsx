'use client';

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      <Toaster position="top-center"/>
      {children}
      <Footer />
    </>
  );
}
