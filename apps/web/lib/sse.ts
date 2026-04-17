export function sseStream<T>(opts: {
  subscribe: (push: (data: T) => void) => Promise<() => void> | (() => void);
  heartbeatMs?: number;
}) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const push = (event: T) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };
      controller.enqueue(encoder.encode(`: connected\n\n`));
      const unsubscribe = await opts.subscribe(push);
      const hb = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(`: hb\n\n`));
      }, opts.heartbeatMs ?? 15_000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(hb);
        try {
          unsubscribe();
        } catch {}
        try {
          controller.close();
        } catch {}
      };

      (controller as unknown as { signal?: AbortSignal }).signal?.addEventListener(
        "abort",
        cleanup,
      );

      return cleanup;
    },
  });
}

export const sseHeaders: HeadersInit = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};
