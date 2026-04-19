"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getDemoCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("demo_mode=true"));
}

function setDemoCookie() {
  document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
}

function clearDemoCookie() {
  document.cookie = "demo_mode=; path=/; max-age=0";
}

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, logout, user } = usePrivy();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // Handle ?demo=true query param + read existing demo cookie
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setDemoCookie();
      setIsDemo(true);
      router.replace("/terminal");
    } else {
      setIsDemo(getDemoCookie());
    }
  }, [searchParams, router]);

  // Route guard: unauthenticated & not demo → /login. Authed but no role → /onboarding.
  useEffect(() => {
    if (!ready) return;

    if (isDemo) {
      setCheckingRole(false);
      return;
    }

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    router.replace("/onboarding");
  }, [ready, authenticated, isDemo, router]);

  if (!ready && !isDemo) {
    return <BootScreen label="booting terminal…" />;
  }

  if (!authenticated && !isDemo) {
    return <BootScreen label="redirecting…" />;
  }

  if (!isDemo && checkingRole) {
    return <BootScreen label="loading profile…" />;
  }

  const handleDisconnect = () => {
    if (isDemo) {
      clearDemoCookie();
      router.push("/");
    } else {
      logout();
      router.push("/");
    }
  };

  return (
    <>
      {children}
      <WalletBadge
        address={isDemo ? "DemoMode" : user?.wallet?.address}
        onLogout={handleDisconnect}
        isDemo={isDemo}
      />
    </>
  );
}

function BootScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen grid place-items-center text-term-dim">
      <div className="flex flex-col items-center gap-3 animate-fadeIn">
        <div className="w-6 h-6 border-2 border-term-green/30 border-t-term-green rounded-full animate-spin" />
        <span className="tracking-[0.3em] text-xs uppercase">{label}</span>
      </div>
    </div>
  );
}

function WalletBadge({
  address,
  onLogout,
  isDemo,
}: {
  address?: string;
  onLogout: () => void;
  isDemo?: boolean;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 text-xs panel px-3 py-2 border-term-green/20 animate-slideUp">
      <span className={`inline-block w-2 h-2 rounded-full ${isDemo ? "bg-term-amber" : "bg-term-green"} animate-pulse`} />
      {isDemo && (
        <span className="text-term-amber font-bold tracking-widest">DEMO</span>
      )}
      <span className="text-term-dim font-mono">
        {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}
      </span>
      <button
        onClick={onLogout}
        className="text-term-dim hover:text-term-red transition-colors duration-200 tracking-[0.1em] uppercase"
      >
        disconnect
      </button>
    </div>
  );
}
