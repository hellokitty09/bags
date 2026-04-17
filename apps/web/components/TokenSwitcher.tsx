"use client";

import { useEffect, useState } from "react";

interface TokenOption {
  mint: string;
  symbol: string;
  name: string;
}

interface Props {
  value: string | null;
  onChange: (mint: string, symbol: string) => void;
}

export function TokenSwitcher({ value, onChange }: Props) {
  const [tokens, setTokens] = useState<TokenOption[]>([]);
  const [adding, setAdding] = useState(false);
  const [mintInput, setMintInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        const list: TokenOption[] = d.tokens ?? [];
        setTokens(list);
        if (!value && list[0]) onChange(list[0].mint, list[0].symbol);
      })
      .catch(() => {});
  }, [value, onChange]);

  async function addToken() {
    if (!mintInput) return;
    setAdding(true);
    try {
      const r = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mint: mintInput.trim() }),
      });
      const d = await r.json();
      if (r.ok && d.token) {
        const t: TokenOption = {
          mint: d.token.mint,
          symbol: d.token.symbol,
          name: d.token.name,
        };
        setTokens((prev) => [...prev, t]);
        onChange(t.mint, t.symbol);
        setMintInput("");
        setShowInput(false);
      } else {
        alert(d.error ?? "failed to add");
      }
    } finally {
      setAdding(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") addToken();
    if (e.key === "Escape") {
      setShowInput(false);
      setMintInput("");
    }
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <label className="text-term-dim uppercase tracking-[0.2em] hidden sm:block">
        token
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => {
          const t = tokens.find((x) => x.mint === e.target.value);
          if (t) onChange(t.mint, t.symbol);
        }}
        className="bg-term-panel border border-term-border hover:border-term-green/40 focus:border-term-green/60 focus:outline-none px-3 py-2 text-term-text min-w-[160px] rounded-sm transition-all duration-200 cursor-pointer appearance-none"
      >
        {tokens.length === 0 && <option value="">no tokens linked</option>}
        {tokens.map((t) => (
          <option key={t.mint} value={t.mint}>
            ${t.symbol} · {t.name}
          </option>
        ))}
      </select>

      {showInput ? (
        <div className="flex items-center gap-2 animate-fadeIn">
          <input
            autoFocus
            value={mintInput}
            onChange={(e) => setMintInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="paste mint address"
            className="bg-term-panel border border-term-border focus:border-term-green/60 focus:outline-none focus:shadow-[0_0_10px_rgba(57,255,136,0.1)] px-3 py-2 text-term-text w-[240px] sm:w-[300px] rounded-sm transition-all duration-200 placeholder:text-term-dim/50"
          />
          <button
            onClick={addToken}
            disabled={adding || !mintInput}
            className="px-4 py-2 bg-term-green/10 border border-term-green text-term-green uppercase tracking-[0.15em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-term-green/20 hover:shadow-[0_0_15px_rgba(57,255,136,0.2)] active:bg-term-green/30 transition-all duration-200 rounded-sm whitespace-nowrap"
          >
            {adding ? "linking…" : "link"}
          </button>
          <button
            onClick={() => {
              setShowInput(false);
              setMintInput("");
            }}
            className="px-2 py-2 text-term-dim hover:text-term-red transition-colors duration-200"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="px-4 py-2 border border-term-green/60 text-term-green uppercase tracking-[0.15em] hover:bg-term-green/10 hover:border-term-green hover:shadow-[0_0_15px_rgba(57,255,136,0.15)] active:bg-term-green/20 transition-all duration-200 rounded-sm whitespace-nowrap"
        >
          + link token
        </button>
      )}
    </div>
  );
}
