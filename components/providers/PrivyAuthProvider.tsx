"use client";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export type RizoUser = {
  id: string;
  email: string;
  name: string;
  tokens: number;
  stellarPublicKey: string | null;
  onboardingCompleted: boolean;
};

type RizoAuthContextType = {
  user: RizoUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const RizoAuthContext = createContext<RizoAuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const useRizoAuth = () => useContext(RizoAuthContext);

function RizoAuthHandler({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user: privyUser, login, logout } = usePrivy();
  const [rizoUser, setRizoUser] = useState<RizoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchRizoUser = useCallback(async (email: string, name?: string) => {
    const res = await fetch("/api/auth/privy-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    return res.json();
  }, []);

  const refreshUser = useCallback(async () => {
    const email =
      privyUser?.email?.address || (privyUser as any)?.google?.email;
    if (!email) return;
    const data = await fetchRizoUser(email);
    if (data.id) {
      setRizoUser({
        id: data.id,
        email: data.email,
        name: data.name || data.email.split("@")[0],
        tokens: data.tokens,
        stellarPublicKey: data.stellarPublicKey,
        onboardingCompleted: data.onboardingCompleted,
      });
    }
  }, [privyUser, fetchRizoUser]);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated || !privyUser) {
      setRizoUser(null);
      setLoading(false);
      return;
    }

    const email =
      privyUser.email?.address || (privyUser as any)?.google?.email;
    if (!email) {
      setLoading(false);
      return;
    }

    const name =
      (privyUser as any)?.google?.name || email.split("@")[0];

    fetchRizoUser(email, name)
      .then((data) => {
        if (data.id) {
          setRizoUser({
            id: data.id,
            email: data.email,
            name: data.name || name,
            tokens: data.tokens,
            stellarPublicKey: data.stellarPublicKey,
            onboardingCompleted: data.onboardingCompleted,
          });
          if (!data.onboardingCompleted && pathname !== "/onboarding") {
            router.push("/onboarding");
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ready, authenticated, privyUser]);

  const handleLogout = async () => {
    await logout();
    setRizoUser(null);
    router.push("/");
  };

  return (
    <RizoAuthContext.Provider
      value={{
        user: rizoUser,
        loading: !ready || loading,
        login,
        logout: handleLogout,
        refreshUser,
      }}
    >
      {children}
    </RizoAuthContext.Provider>
  );
}

export function RizoPrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clxxx";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "google"],
        appearance: {
          theme: "light",
          accentColor: "#8D6E63",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
          solana: { createOnLogin: "off" },
        },
      }}
    >
      <RizoAuthHandler>{children}</RizoAuthHandler>
    </PrivyProvider>
  );
}
