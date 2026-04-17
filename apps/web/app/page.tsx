import Link from "next/link";
import { AuraCheckInput } from "@/components/AuraCheckInput";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-term-bg overflow-x-hidden selection:bg-term-green/20 relative">
      {/* Animated grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08] animate-gridDrift"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center opacity-30">
        <div className="w-[800px] h-[800px] bg-term-green/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: "6s" }} />
      </div>
      <div className="fixed top-1/4 left-10 w-[300px] h-[300px] bg-term-cyan/10 blur-[100px] rounded-full mix-blend-screen animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 right-10 w-[400px] h-[400px] bg-term-amber/5 blur-[120px] rounded-full mix-blend-screen animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_3px] z-[1]" />

      {/* Nav bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-term-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-term-green shadow-[0_0_8px_rgba(57,255,136,0.6)] animate-pulse" />
          <span className="text-term-green text-xs tracking-[0.35em] font-bold">AURA</span>
          <span className="hidden sm:inline text-term-dim text-[10px] tracking-widest">// BAGS.FM TERMINAL</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-term-dim hover:text-term-green text-[11px] tracking-[0.25em] uppercase transition-colors px-3 py-1.5"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="border border-term-green/50 hover:border-term-green text-term-green hover:bg-term-green/10 hover:shadow-[0_0_15px_rgba(57,255,136,0.25)] text-[11px] tracking-[0.25em] uppercase px-4 py-1.5 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center pt-12 md:pt-20 pb-24">
        <div className="container mx-auto px-4 flex flex-col items-center max-w-5xl">

          {/* Animated Logo */}
          <div className="mb-10 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <img
              src="/logo.png"
              alt="AURA Logo"
              className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_25px_rgba(57,255,136,0.5)] animate-pulse"
              style={{ animationDuration: "3s" }}
            />
          </div>

          {/* Hero Copy — Narrative Hook */}
          <div className="text-center space-y-6 mb-12 animate-slideUp" style={{ animationDelay: "0.5s" }}>
            <div className="inline-block px-3 py-1 mb-4 border border-term-green/40 shadow-[0_0_10px_rgba(57,255,136,0.2)] rounded-full text-term-green text-xs font-mono tracking-widest bg-term-green/5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-term-green mr-2 animate-pulse" />
              BAGS.FM TERMINAL v0.1.0 ONLINE
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide leading-tight">
              Your token has an <span className="text-term-green drop-shadow-[0_0_20px_rgba(57,255,136,0.5)]">aura</span>.
              <br />
              <span className="text-term-dim text-3xl md:text-5xl">Do you know what it is?</span>
            </h1>

            {/* Typing effect line */}
            <div className="flex justify-center">
              <div
                className="overflow-hidden whitespace-nowrap border-r-2 border-term-green animate-typewriter text-term-dim text-xs md:text-sm font-mono tracking-[0.15em]"
                style={{ ["--type-to" as string]: "34ch" } as React.CSSProperties}
              >
                &gt; track_token_aura --live --based
              </div>
            </div>

            <p className="text-term-dim text-sm md:text-base max-w-2xl mx-auto font-mono leading-relaxed px-4 pt-2">
              The AI-powered <span className="text-term-green">vibe check</span> for every creator token on Bags.fm.
              <br className="hidden md:block" />
              Know when to post, who&apos;s buying, and whether your community is <span className="text-term-cyan">based</span> or <span className="text-term-dim">mid</span>.
            </p>
          </div>

          {/* Instant Aura Check — The 10-Second Wow Moment */}
          <div className="w-full max-w-2xl mb-8 animate-slideUp" style={{ animationDelay: "0.7s" }}>
            <div className="panel p-6 border-term-green/20 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-term-green text-xs tracking-[0.3em] uppercase font-bold">
                  Instant vibe check — no signup needed
                </p>
                <p className="text-term-dim text-[11px]">
                  Paste any Bags.fm token mint address and get your aura score in seconds.
                </p>
              </div>
              <AuraCheckInput />
            </div>
          </div>

          {/* CTAs */}
          <div className="mb-20 animate-slideUp w-full" style={{ animationDelay: "0.9s" }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-term-green/10 border border-term-green text-term-green hover:bg-term-green/20 hover:shadow-[0_0_30px_rgba(57,255,136,0.4)] active:bg-term-green/30 uppercase tracking-[0.25em] text-sm transition-all duration-300 text-center font-bold animate-glowPulse"
              >
                Launch Dashboard →
              </Link>
              <Link
                href="/terminal?demo=true"
                className="w-full sm:w-auto px-8 py-4 border border-term-amber/50 text-term-amber hover:border-term-amber hover:shadow-[0_0_25px_rgba(255,176,32,0.3)] hover:bg-term-amber/5 uppercase tracking-[0.25em] text-sm transition-all duration-300 text-center"
              >
                Try Demo
              </Link>
            </div>
            <p className="text-center text-term-dim/50 text-[10px] tracking-widest mt-4 uppercase">
              No signup required for aura check or demo · Read-only · 24h session
            </p>
          </div>

          {/* Outcome Stats Strip */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideUp" style={{ animationDelay: "1.1s" }}>
            {[
              { label: "AI Signals", value: "3 LAYERS", desc: "Timing · Whale · Momentum" },
              { label: "Feed", value: "REAL-TIME", desc: "Helius webhooks < 100ms" },
              { label: "Vibe Check", value: "AURA™", desc: "0-100 composite score" },
              { label: "Share", value: "1-CLICK", desc: "OG cards for X & Discord" },
            ].map((s) => (
              <div key={s.label} className="panel p-4 text-center border-term-green/10 hover:border-term-green/30 transition-colors group">
                <div className="text-term-dim text-[10px] tracking-[0.25em] uppercase mb-1">{s.label}</div>
                <div className="text-term-green text-sm font-bold tracking-widest group-hover:drop-shadow-[0_0_8px_rgba(57,255,136,0.4)] transition-all">{s.value}</div>
                <div className="text-term-dim/40 text-[9px] tracking-wide mt-1">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Demo Video Frame Section */}
          <div className="w-full mt-24 animate-slideUp" style={{ animationDelay: "1.3s" }}>
            <div className="mb-4 flex items-center justify-between text-xs font-mono text-term-dim tracking-widest px-2">
              <span>TERMINAL_PREVIEW.MP4</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-term-red animate-pulse" /> LIVE
              </span>
            </div>

            <div className="w-full aspect-video p-1 bg-gradient-to-br from-term-green/30 via-term-green/5 to-transparent rounded-lg shadow-2xl overflow-hidden relative group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-[1px] bg-term-panel flex items-center justify-center rounded-lg overflow-hidden border border-term-border/50">
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 z-0 mix-blend-overlay"></div>
                <div className="z-10 flex flex-col items-center gap-4 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-16 h-16 rounded-full border-2 border-term-green flex items-center justify-center bg-term-green/10 shadow-[0_0_20px_rgba(57,255,136,0.3)] backdrop-blur-sm">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-term-green border-b-8 border-b-transparent ml-1" />
                  </div>
                  <span className="text-term-green tracking-[0.3em] text-xs font-bold drop-shadow-md">PLAY DEMO</span>
                </div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20"></div>
              </div>
            </div>
          </div>

          {/* Dual-Sided Marketplace Info */}
          <div className="w-full mt-32 mb-16 animate-slideUp text-left" style={{ animationDelay: "1.5s" }}>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-widest mb-4">
                 DUAL-SIDED <span className="text-term-green">ARCHITECTURE</span>
              </h2>
              <div className="w-24 h-px bg-term-green/40 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-term-green/20 to-transparent -translate-x-1/2" />

              {/* Creator Side */}
              <div className="panel p-8 border-term-green/20 hover:border-term-green/50 bg-black/40 backdrop-blur-sm relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-term-green/10 blur-[50px] group-hover:bg-term-green/20 transition-colors" />
                <div className="text-term-green text-sm tracking-[0.2em] mb-6 border-b border-term-border pb-2 inline-block">
                  [01] THE CREATOR
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-wide">
                  Own Your Economy
                </h3>
                <ul className="space-y-4 text-term-dim font-mono text-sm mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-term-green mt-0.5">▸</span>
                    <span><strong>AI Intelligence Briefing:</strong> Multi-signal analysis combines timing, whale alerts, and momentum into one actionable recommendation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-term-green mt-0.5">▸</span>
                    <span><strong>Revenue Tracking:</strong> Monitor exact USD equivalent of protocol fees on a gorgeous 30-day sparkline.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-term-green mt-0.5">▸</span>
                    <span><strong>Holder Health:</strong> Gini coefficient treemap instantly identifies dangerous whales.</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-term-green/10 border border-term-green text-term-green hover:bg-term-green/20 hover:shadow-[0_0_20px_rgba(57,255,136,0.3)] uppercase tracking-[0.2em] text-xs transition-all duration-300"
                >
                  Launch As Creator →
                </Link>
              </div>

              {/* Trader Side */}
              <div className="panel p-8 border-term-cyan/20 hover:border-term-cyan/50 bg-black/40 backdrop-blur-sm relative overflow-hidden group transition-all">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-term-cyan/10 blur-[50px] group-hover:bg-term-cyan/20 transition-colors" />
                <div className="text-term-cyan text-sm tracking-[0.2em] mb-6 border-b border-term-border pb-2 inline-block">
                  [02] THE TRADER
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-wide">
                  Never Miss a Buy
                </h3>
                <ul className="space-y-4 text-term-dim font-mono text-sm mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-term-cyan mt-0.5">▸</span>
                    <span><strong>Live Webhook Feed:</strong> Transactions stream via Helius within milliseconds of hitting the chain.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-term-cyan mt-0.5">▸</span>
                    <span><strong>Aura Score™:</strong> Instant vibe check on any token — share the score, flex your bags.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-term-cyan mt-0.5">▸</span>
                    <span><strong>Shareable Intel:</strong> Dynamic OG cards for X and Discord — your aura score becomes your flex.</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-term-cyan/10 border border-term-cyan text-term-cyan hover:bg-term-cyan/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] uppercase tracking-[0.2em] text-xs transition-all duration-300"
                >
                  Trade As Fan →
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full pt-12 border-t border-term-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-term-dim tracking-widest uppercase">
            <span>© 2026 Aura Terminal · For the bags.fm ecosystem</span>
            <span>BAGS × BIRDEYE × HELIUS × PRIVY · v0.1.0</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
