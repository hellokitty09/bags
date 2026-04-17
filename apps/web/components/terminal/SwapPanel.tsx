"use client";

import { useState } from "react";
import { Panel } from "./Panel";

export function SwapPanel({ mint, symbol }: { mint: string; symbol: string }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [swapping, setSwapping] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simulated exchange rate: 1 SOL = 5,420 TOKEN
  const rate = 5420.5;

  const solAmount = side === "buy" ? amount : String(Number(amount) / rate);
  const tokenAmount = side === "buy" ? String(Number(amount) * rate) : amount;

  const handleSwap = () => {
    if (!amount || Number(amount) <= 0) return;
    setSwapping(true);
    setSuccess(false);

    // Simulate blockchain confirmation delay
    setTimeout(() => {
      setSwapping(false);
      setSuccess(true);
      setAmount("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <Panel title="EXCHANGE ROUTER" right={<span className="text-[10px] text-term-dim">JUPITER SIMULATOR</span>}>
      <div className="flex flex-col gap-4">
        
        {/* Toggle Buy/Sell */}
        <div className="flex bg-term-bg border border-term-border p-1 rounded-sm">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
              side === "buy" ? "bg-term-green/20 text-term-green border border-term-green/30" : "text-term-dim hover:text-white"
            }`}
          >
            Buy {symbol}
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
              side === "sell" ? "bg-term-red/20 text-term-red border border-term-red/30" : "text-term-dim hover:text-white"
            }`}
          >
            Sell {symbol}
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-term-bg border border-term-border p-4 rounded-sm flex flex-col gap-3 relative overflow-hidden group focus-within:border-term-cyan/50 transition-colors">
          <div className="flex justify-between text-xs text-term-dim tracking-widest">
            <span>YOU PAY</span>
            <span>BALANCE: 14.2 {side === "buy" ? "SOL" : symbol}</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-3xl text-white font-mono outline-none w-full appearance-none m-0"
              style={{ MozAppearance: "textfield" }}
            />
            <span className="text-xl font-bold ml-4">
              {side === "buy" ? "SOL" : symbol}
            </span>
          </div>
        </div>

        {/* Output Calculation */}
        <div className="flex justify-between items-center text-xs font-mono text-term-dim px-2">
           <span className="tracking-widest">EST. OUTPUT</span>
           <span className="text-white font-bold">≈ {Number(side === "buy" ? tokenAmount : solAmount).toLocaleString(undefined, { maximumFractionDigits: 4 })} {side === "buy" ? symbol : "SOL"}</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSwap}
          disabled={swapping || !amount || Number(amount) <= 0}
          className={`w-full py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3 mt-2 ${
            success 
              ? "bg-term-cyan/20 border border-term-cyan text-term-cyan" 
              : side === "buy" 
                ? "bg-term-green/10 border border-term-green/50 text-term-green hover:bg-term-green/20 hover:border-term-green hover:shadow-[0_0_20px_rgba(57,255,136,0.3)] disabled:opacity-50"
                : "bg-term-red/10 border border-term-red/50 text-term-red hover:bg-term-red/20 hover:border-term-red hover:shadow-[0_0_20px_rgba(255,77,109,0.3)] disabled:opacity-50"
          }`}
        >
          {swapping ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
              <span>Routing...</span>
            </>
          ) : success ? (
            <>
              <span>Swap Confirmed</span>
            </>
          ) : (
            <span>Confirm {side}</span>
          )}
        </button>

      </div>
    </Panel>
  );
}
