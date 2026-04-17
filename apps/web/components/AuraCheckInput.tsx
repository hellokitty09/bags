"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuraCheckInput() {
  const [mint, setMint] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleCheck() {
    const trimmed = mint.trim();
    if (!trimmed || trimmed.length < 32) return;
    setLoading(true);
    router.push(`/aura/${trimmed}`);
  }

  return (
    <div className="flex gap-2 max-w-lg mx-auto w-full">
      <input
        type="text"
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        placeholder="Paste any token mint address..."
        className="flex-1 bg-term-bg border border-term-border/50 focus:border-term-cyan text-white text-xs px-4 py-3 outline-none placeholder:text-term-dim/40 font-mono transition-colors"
      />
      <button
        onClick={handleCheck}
        disabled={loading || mint.trim().length < 32}
        className="px-6 py-3 bg-term-cyan/10 border border-term-cyan/50 hover:border-term-cyan text-term-cyan text-xs tracking-widest uppercase transition-all duration-200 hover:bg-term-cyan/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap font-bold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-term-cyan/40 border-t-term-cyan rounded-full animate-spin" />
            Checking…
          </span>
        ) : (
          "Check Aura →"
        )}
      </button>
    </div>
  );
}
