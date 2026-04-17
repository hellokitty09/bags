import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtUsd(n: number, opts?: { compact?: boolean }) {
  const f = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: n < 1 ? 6 : 2,
  });
  return f.format(n);
}

export function fmtPct(n: number, digits = 2) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtNum(n: number, opts?: { compact?: boolean }) {
  return new Intl.NumberFormat("en-US", {
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(n);
}

export function shortAddr(addr: string, edge = 4) {
  if (!addr) return "";
  if (addr.length <= edge * 2 + 3) return addr;
  return `${addr.slice(0, edge)}…${addr.slice(-edge)}`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}
