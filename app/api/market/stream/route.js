import {
  isValidStream,
  MAX_STREAMS_PER_CLIENT,
  subscribeToStreams,
} from "@/lib/server/binanceStream";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEARTBEAT_INTERVAL_MS = 20000;
const MAX_BUFFERED_BYTES = 512 * 1024;

// Server-Sent Events feed of live Binance market data.
// GET /api/market/stream?streams=btcusdt@trade,ethusdt@trade
export async function GET(request) {
  const requested = (request.nextUrl.searchParams.get("streams") || "")
    .split(",")
    .map((stream) => stream.trim())
    .filter(Boolean);
  const streams = [...new Set(requested)];

  if (streams.length === 0 || streams.length > MAX_STREAMS_PER_CLIENT) {
    return NextResponse.json(
      { error: `Provide between 1 and ${MAX_STREAMS_PER_CLIENT} streams` },
      { status: 400 }
    );
  }

  const invalid = streams.find((stream) => !isValidStream(stream));
  if (invalid) {
    return NextResponse.json({ error: `Stream not allowed: ${invalid}` }, { status: 400 });
  }

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const body = new ReadableStream(
    {
      start(controller) {
        let closed = false;

        const send = (text) => {
          if (closed) return;
          // A client that cannot keep up just misses updates; the next one replaces them anyway.
          if (controller.desiredSize !== null && controller.desiredSize <= 0) return;
          try {
            controller.enqueue(encoder.encode(text));
          } catch {
            cleanup();
          }
        };

        send("retry: 3000\n\n");

        const unsubscribe = subscribeToStreams(streams, (raw) => send(`data: ${raw}\n\n`));
        const heartbeat = setInterval(() => send(": ping\n\n"), HEARTBEAT_INTERVAL_MS);

        cleanup = () => {
          if (closed) return;
          closed = true;
          clearInterval(heartbeat);
          unsubscribe();
          try {
            controller.close();
          } catch {
            // already closed by the client
          }
        };

        request.signal.addEventListener("abort", cleanup);
      },
      cancel() {
        cleanup();
      },
    },
    new ByteLengthQueuingStrategy({ highWaterMark: MAX_BUFFERED_BYTES })
  );

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      // no-transform also stops Next.js from gzip-buffering the stream
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // tell nginx not to buffer
    },
  });
}
