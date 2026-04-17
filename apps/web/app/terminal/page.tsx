import { Suspense } from "react";
import { Dashboard } from "@/components/Dashboard";
import { LoginGate } from "@/components/LoginGate";

export default function TerminalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center text-term-dim">
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-6 h-6 border-2 border-term-green/30 border-t-term-green rounded-full animate-spin" />
            <span className="tracking-[0.3em] text-xs uppercase">booting terminal…</span>
          </div>
        </div>
      }
    >
      <LoginGate>
        <Dashboard />
      </LoginGate>
    </Suspense>
  );
}
