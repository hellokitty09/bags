"use client";

import { useState } from "react";

interface Props {
  mint: string;
  symbol: string;
  score: number;
  tier: string;
}

const TIER_EMOJI: Record<string, string> = {
  "GOD TIER": "🔮👑",
  "HIGH AURA": "🔮🟢",
  "BASED": "🔮🔵",
  "MID": "🔮⚪",
  "LOW AURA": "🔮🟡",
  "NO AURA": "🔮🔴",
};

export function AuraShareActions({ mint, symbol, score, tier }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/aura/${mint}`
    : `/aura/${mint}`;

  const emoji = TIER_EMOJI[tier] ?? "🔮";
  const shareText = `$${symbol} just scored ${score}/100 on AURA — ${tier} ${emoji}\n\nCan your bags compete? Check your token's aura:`;

  function onCopy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function onCopyShareText() {
    if (typeof navigator === "undefined") return;
    const full = `${shareText}\n${url}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div className="panel p-6 space-y-4 border-term-green/30 text-center">
      <div className="text-term-green text-[10px] tracking-[0.3em] uppercase font-bold">
        Flex your aura
      </div>
      <p className="text-term-dim text-xs max-w-md mx-auto">
        Share your token&apos;s vibe check — the preview image is auto-generated with your score and stats.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-5 py-3 border border-term-green bg-term-green/10 text-term-green hover:bg-term-green/20 hover:shadow-[0_0_20px_rgba(57,255,136,0.3)] uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 font-bold"
        >
          <span>𝕏</span> Post to X →
        </a>
        <button
          onClick={onCopyShareText}
          className="flex-1 px-5 py-3 border border-term-cyan/50 text-term-cyan hover:text-white hover:border-term-cyan hover:bg-term-cyan/10 uppercase tracking-[0.2em] text-xs transition-all"
        >
          {copied ? "✓ Copied!" : "Copy Share Text"}
        </button>
        <button
          onClick={onCopy}
          className="flex-1 px-5 py-3 border border-term-border/60 text-term-dim hover:text-white hover:border-white uppercase tracking-[0.2em] text-xs transition-all"
        >
          {copied ? "✓ Copied!" : "Copy Link"}
        </button>
      </div>
      <div className="font-mono text-[10px] text-term-dim/60 break-all bg-term-bg/50 border border-term-border/30 px-3 py-2">
        {url}
      </div>
    </div>
  );
}
