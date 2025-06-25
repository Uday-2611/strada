"use client"

import { Toaster } from "sonner";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import { Inter } from "next/font/google";

import { AuthProvider } from "@/components/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }) {
  return (
    <div className='bg-gray-50'>
      <div>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </div>
    </div >
  );
}
