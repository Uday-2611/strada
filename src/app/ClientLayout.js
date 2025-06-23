"use client"

import { Toaster } from "sonner";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import { Inter } from "next/font/google";

import { AuthProvider } from "@/components/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }) {
  return (
    <div className={inter.className + " bg-gray-50"}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </div>
  );
}
