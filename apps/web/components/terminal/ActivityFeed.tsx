"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "./Panel";
import { fmtNum, shortAddr, timeAgo } from "@/lib/utils";
import type { TxEvent } from "@creator-intel/shared";

interface Props {
  mint: string;
}

const kindColor: Record<TxEvent["kind"], string> = {
  buy: "text-term-green",
  sell: "text-term-red",
  transfer: "text-term-cyan",
  mint: "text-term-amber",
  burn: "text-term-red",
  unknown: "text-term-dim",
};

export function ActivityFeed({ mint }: Props) {
  const [events, setEvents] = useState<TxEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "live" | "offline">(
    "connecting",
  );
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/feed/stream?mint=${mint}`);
    esRef.current = es;
    es.onopen = () => setStatus("live");
    es.onerror = () => setStatus("offline");
    es.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data) as TxEvent;
        setEvents((prev) => [event, ...prev].slice(0, 40));
      } catch {}
    };
    return () => {
      es.close();
      esRef.current = null;
    };
  }, [mint]);

  return (
    <Panel
      title="Activity Feed"
      tag="FEED"
      right={
        <span
          className={
            status === "live"
              ? "text-term-green"
              : status === "offline"
                ? "text-term-red"
                : "text-term-dim"
          }
        >
          ● {status.toUpperCase()}
        </span>
      }
    >
      <ul className="space-y-1 text-xs max-h-[340px] overflow-y-auto pr-1">
        {events.length === 0 && (
          <li className="text-term-dim italic py-4 text-center">
            waiting for on-chain events…
          </li>
        )}
        {events.map((e) => (
          <li
            key={e.signature}
            className="flex gap-2 tabular-nums animate-tick border-b border-term-border/40 pb-1"
          >
            <span className={`${kindColor[e.kind]} w-12 uppercase`}>{e.kind}</span>
            <span className="text-term-text">{fmtNum(e.amount, { compact: true })}</span>
            <span className="text-term-dim">
              {e.fromWallet ? shortAddr(e.fromWallet) : "·"} →{" "}
              {e.toWallet ? shortAddr(e.toWallet) : "·"}
            </span>
            <span className="ml-auto text-term-dim">{timeAgo(e.blockTime)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
