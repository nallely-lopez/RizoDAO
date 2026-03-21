"use client";
import { AcceslyProvider } from "accesly";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AcceslyProvider
      appId={process.env.NEXT_PUBLIC_ACCESLY_APP_ID!}
      network="testnet"
      theme="light"
    >
      {children}
    </AcceslyProvider>
  );
}