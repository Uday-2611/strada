"use client"

import { Toaster } from "sonner";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'

import { AuthProvider } from "@/components/context/AuthProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
