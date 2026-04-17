import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        term: {
          bg: "#0a0e0a",
          panel: "#0f1410",
          border: "#1f2a1f",
          text: "#d1f5d3",
          dim: "#5b7a5f",
          green: "#39ff88",
          amber: "#ffb020",
          red: "#ff4d6d",
          cyan: "#22d3ee",
        },
      },
      boxShadow: {
        term: "inset 0 0 0 1px rgba(57, 255, 136, 0.08)",
      },
      keyframes: {
        blink: { "0%,50%": { opacity: "1" }, "51%,100%": { opacity: "0" } },
        tick: { "0%": { opacity: "0.4" }, "100%": { opacity: "1" } },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawSvg: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        gridDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        typewriter: {
          "0%": { width: "0ch" },
          "100%": { width: "var(--type-to, 18ch)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(57,255,136,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(57,255,136,0.5)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        tick: "tick 120ms ease-out",
        fadeIn: "fadeIn 0.4s ease-out both",
        slideUp: "slideUp 0.3s ease-out both",
        drawSvg: "drawSvg 3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 8s ease-in-out infinite",
        gridDrift: "gridDrift 20s linear infinite",
        typewriter: "typewriter 2.5s steps(30) 0.8s forwards",
        glowPulse: "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
