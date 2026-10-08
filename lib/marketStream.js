// Browser-side live market data. Every subscription in the tab shares a single
// Server-Sent Events connection to /api/market/stream.

const SYNC_DELAY_MS = 100; // lets components mounting together share one connection
const RETRY_DELAY_MS = 3000;

const handlers = new Map(); // stream -> Set of handlers
const latest = new Map(); // stream -> last data received
let source = null;
let sourceKey = "";
let syncTimer = null;

function deliver(handler, data, stream) {
  try {
    handler(data, stream);
  } catch (error) {
    console.error("Market stream handler failed:", error);
  }
}

function scheduleSync(delay = SYNC_DELAY_MS) {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(sync, delay);
}

function sync() {
  syncTimer = null;

  const key = [...handlers.keys()].sort().join(",");
  if (source && key === sourceKey) return;

  if (source) source.close();
  source = null;
  sourceKey = key;
  if (!key) return;

  const eventSource = new EventSource(`/api/market/stream?streams=${encodeURIComponent(key)}`);
  source = eventSource;

  eventSource.onmessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch {
      return;
    }

    const set = handlers.get(message.stream);
    if (!set) return;
    latest.set(message.stream, message.data);
    set.forEach((handler) => deliver(handler, message.data, message.stream));
  };

  eventSource.onerror = () => {
    // The browser retries dropped connections itself; it only gives up when the
    // server answers with an error, so that case is retried here.
    if (source !== eventSource || eventSource.readyState !== EventSource.CLOSED) return;
    source = null;
    scheduleSync(RETRY_DELAY_MS);
  };
}

/**
 * Subscribe to Binance streams, e.g. ["btcusdt@trade", "btcusdt@kline_1m"].
 * The handler is called with (data, streamName). Returns an unsubscribe function.
 */
export function subscribeMarketStreams(streams, handler) {
  if (typeof window === "undefined") return () => {};

  let active = true;

  streams.forEach((stream) => {
    if (!handlers.has(stream)) handlers.set(stream, new Set());
    handlers.get(stream).add(handler);
  });
  scheduleSync();

  // Streams another component already has open will not be resent by the server.
  queueMicrotask(() => {
    streams.forEach((stream) => {
      if (active && latest.has(stream)) deliver(handler, latest.get(stream), stream);
    });
  });

  return () => {
    active = false;
    streams.forEach((stream) => {
      const set = handlers.get(stream);
      if (!set) return;
      set.delete(handler);
      if (set.size === 0) {
        handlers.delete(stream);
        latest.delete(stream);
      }
    });
    scheduleSync();
  };
}
