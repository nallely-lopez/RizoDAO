"use client";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AcceslyProvider } from "accesly";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-[#F5F0EA]">
        <AcceslyProvider appId={process.env.NEXT_PUBLIC_ACCESLY_APP_ID!}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </AcceslyProvider>
      </body>
    </html>
  );
}