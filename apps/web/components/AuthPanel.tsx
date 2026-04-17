"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Variant = "login" | "signup";

interface AuthPanelProps {
  variant: Variant;
}

const COPY: Record<Variant, { title: string; tagline: string; cta: string; altLabel: string; altHref: string; altText: string }> = {
  login: {
    title: "LOG IN",
    tagline: "Welcome back, operator.",
    cta: "Connect & Log In",
    altLabel: "New here?",
    altHref: "/signup",
    altText: "Create account →",
  },
  signup: {
    title: "SIGN UP",
    tagline: "Boot the terminal. Claim your aura.",
    cta: "Create Account",
    altLabel: "Already in?",
    altHref: "/login",
    altText: "Log in →",
  },
};

export function AuthPanel({ variant }: AuthPanelProps) {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();
  const [triggered, setTriggered] = useState(false);
  const copy = COPY[variant];

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/onboarding");
    }
  }, [ready, authenticated, router]);

  const handleClick = () => {
    setTriggered(true);
    login();
  };

  return (
    <div className="min-h-screen bg-term-bg flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center opacity-30">
        <div className="w-[700px] h-[700px] bg-term-green/10 blur-[160px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: "4s" }} />
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_3px] z-[1]" />

      {/* Concentric rings */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-10">
        <div className="w-[500px] h-[500px] border border-term-green rounded-full animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="w-[800px] h-[800px] border border-term-green rounded-full absolute opacity-50" />
      </div>

      <div className="z-10 w-full max-w-md animate-fadeIn">
        <div className="panel p-10 border-term-green/30 backdrop-blur-xl bg-term-panel/80 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-term-green/10 blur-[60px]" />

          <Link
            href="/"
            className="text-term-dim hover:text-term-green text-[10px] tracking-[0.3em] uppercase transition-colors inline-flex items-center gap-1"
          >
            ← BACK
          </Link>

          <div className="space-y-2 text-center">
            <div className="inline-block px-3 py-1 border border-term-green/40 shadow-[0_0_10px_rgba(57,255,136,0.15)] rounded-full text-term-green text-[10px] font-mono tracking-widest bg-term-green/5">
              AURA TERMINAL
            </div>
            <h1 className="text-term-green text-3xl tracking-[0.35em] font-bold">
              {copy.title}
            </h1>
            <p className="text-term-dim text-xs tracking-[0.15em]">
              {copy.tagline}
            </p>
          </div>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-term-green/40 to-transparent mx-auto" />

          <div className="space-y-4">
            <button
              onClick={handleClick}
              disabled={!ready || triggered}
              className="w-full py-3.5 border border-term-green bg-term-green/10 text-term-green hover:bg-term-green/20 hover:shadow-[0_0_25px_rgba(57,255,136,0.3)] active:bg-term-green/30 uppercase tracking-[0.25em] text-xs transition-all duration-200 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {!ready ? "Booting…" : triggered ? "Awaiting wallet…" : copy.cta}
            </button>

            <div className="text-center text-[10px] tracking-[0.2em] text-term-dim uppercase">
              {copy.altLabel}{" "}
              <Link href={copy.altHref} className="text-term-green hover:text-term-green/80 transition-colors">
                {copy.altText}
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-term-border/30 text-center">
            <Link
              href="/terminal?demo=true"
              className="inline-flex items-center gap-2 text-term-amber hover:text-term-amber/80 text-[10px] tracking-[0.25em] uppercase transition-colors"
            >
              → Skip: Try Demo Mode
            </Link>
          </div>
        </div>

        <p className="text-center text-term-dim/40 text-[10px] tracking-widest mt-6 font-mono">
          BAGS × HELIUS × PRIVY · v0.1.0
        </p>
      </div>
    </div>
  );
}
