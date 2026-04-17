"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  const tree = (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );

  if (!appId) {
    return tree;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#39ff88",
          logo: undefined,
        },
        loginMethods: ["wallet", "email", "twitter"],
        embeddedWallets: { createOnLogin: "users-without-wallets" },
      }}
    >
      {tree}
    </PrivyProvider>
  );
}
