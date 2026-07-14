import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const numberFormatCache = new Map<string, Intl.NumberFormat>();

export function fmtUsd(n: number, opts?: { compact?: boolean }) {
  const notation = opts?.compact ? "compact" : "standard";
  const maximumFractionDigits = Math.abs(n) < 1 && n !== 0 ? 6 : 2;
  const key = `usd-${notation}-${maximumFractionDigits}`;
  let formatter = numberFormatCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation,
      maximumFractionDigits,
    });
    numberFormatCache.set(key, formatter);
  }
  return formatter.format(n);
}

export function fmtPct(n: number, digits = 2) {
  const key = `pct-${digits}`;
  let formatter = numberFormatCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      signDisplay: "exceptZero",
    });
    numberFormatCache.set(key, formatter);
  }
  return formatter.format(n / 100);
}

export function fmtNum(n: number, opts?: { compact?: boolean }) {
  const notation = opts?.compact ? "compact" : "standard";
  const key = `num-${notation}`;
  let formatter = numberFormatCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      notation,
      maximumFractionDigits: 2,
    });
    numberFormatCache.set(key, formatter);
  }
  return formatter.format(n);
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
