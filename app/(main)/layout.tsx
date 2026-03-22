"use client";
import Navbar from "@/components/layout/Navbar";
import { SessionProvider } from "next-auth/react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#FAF8F5]">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}
