// Server-only. One shared WebSocket to Binance for the whole app: streams are
// subscribed on demand, reference counted, and fanned out to every listener.

const BINANCE_WS_URL = process.env.BINANCE_WS_URL || "wss://stream.binance.com:9443";

const FLUSH_INTERVAL_MS = 100; // listeners get at most one (the latest) message per stream per tick
const CONTROL_INTERVAL_MS = 500; // Binance limits how often we may send SUBSCRIBE/UNSUBSCRIBE
const RELEASE_GRACE_MS = 15000; // keep a stream alive briefly after its last listener leaves
const STALE_AFTER_MS = 60000; // reconnect if the socket goes silent
const MAX_RECONNECT_DELAY_MS = 30000;

export const MAX_STREAMS_PER_CLIENT = 64;

const STREAM_PATTERN =
  /^[a-z0-9]{2,20}@(trade|ticker|depth20@100ms|kline_(1s|1m|3m|5m|15m|30m|1h|2h|4h|6h|8h|12h|1d|3d|1w|1M))$/;

export function isValidStream(stream) {
  return STREAM_PATTERN.test(stream);
}

class BinanceStreamHub {
  constructor() {
    this.listeners = new Map(); // stream -> Set of listeners
    this.active = new Set(); // streams we want subscribed upstream
    this.latest = new Map(); // stream -> last raw message
    this.dirty = new Set(); // streams with a message not yet delivered
    this.releaseTimers = new Map();
    this.pendingSubscribe = new Set();
    this.pendingUnsubscribe = new Set();
    this.socket = null;
    this.requestId = 0;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.controlTimer = null;
    this.flushTimer = null;
    this.lastControlAt = 0;
    this.lastMessageAt = 0;
  }

  // listener receives the raw JSON text: {"stream":"btcusdt@trade","data":{...}}
  subscribe(streams, listener) {
    streams.forEach((stream) => {
      clearTimeout(this.releaseTimers.get(stream));
      this.releaseTimers.delete(stream);

      if (!this.listeners.has(stream)) this.listeners.set(stream, new Set());
      this.listeners.get(stream).add(listener);

      if (!this.active.has(stream)) {
        this.active.add(stream);
        // If an unsubscribe was still queued, the stream is live upstream already.
        if (!this.pendingUnsubscribe.delete(stream)) this.pendingSubscribe.add(stream);
      }

      const last = this.latest.get(stream);
      if (last) listener(last);
    });

    this.connect();
    this.scheduleControl();
    if (!this.flushTimer) this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);

    let released = false;
    return () => {
      if (released) return;
      released = true;
      streams.forEach((stream) => this.removeListener(stream, listener));
    };
  }

  removeListener(stream, listener) {
    const set = this.listeners.get(stream);
    if (!set) return;
    set.delete(listener);
    if (set.size > 0) return;

    this.listeners.delete(stream);
    this.releaseTimers.set(
      stream,
      setTimeout(() => this.release(stream), RELEASE_GRACE_MS)
    );
  }

  release(stream) {
    this.releaseTimers.delete(stream);
    if (this.listeners.has(stream)) return;

    this.active.delete(stream);
    this.latest.delete(stream);
    this.dirty.delete(stream);
    if (!this.pendingSubscribe.delete(stream)) this.pendingUnsubscribe.add(stream);

    if (this.active.size === 0) {
      this.shutdown();
    } else {
      this.scheduleControl();
    }
  }

  shutdown() {
    clearInterval(this.flushTimer);
    clearTimeout(this.reconnectTimer);
    clearTimeout(this.controlTimer);
    this.flushTimer = null;
    this.reconnectTimer = null;
    this.controlTimer = null;
    this.pendingSubscribe.clear();
    this.pendingUnsubscribe.clear();
    this.reconnectAttempts = 0;

    const socket = this.socket;
    this.socket = null;
    if (socket) socket.close();
  }

  connect() {
    if (this.socket || this.reconnectTimer || this.active.size === 0) return;

    const socket = new WebSocket(`${BINANCE_WS_URL}/stream`);
    this.socket = socket;
    this.lastMessageAt = Date.now();

    socket.onopen = () => {
      if (this.socket !== socket) return;
      // A fresh connection has no subscriptions, so resend everything we need.
      this.pendingSubscribe = new Set(this.active);
      this.pendingUnsubscribe.clear();
      this.scheduleControl();
    };

    socket.onmessage = (event) => {
      if (this.socket !== socket) return;
      this.lastMessageAt = Date.now();
      this.reconnectAttempts = 0;
      this.handleMessage(event.data);
    };

    socket.onerror = () => {
      console.error("Binance stream socket error");
    };

    socket.onclose = () => {
      if (this.socket !== socket) return;
      this.socket = null;
      this.scheduleReconnect();
    };
  }

  scheduleReconnect() {
    if (this.reconnectTimer || this.active.size === 0) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, MAX_RECONNECT_DELAY_MS);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  handleMessage(raw) {
    if (typeof raw !== "string") return;

    let message;
    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }

    if (message.error) {
      console.error("Binance stream request rejected:", message.error);
      return;
    }

    const { stream } = message;
    if (!stream || !this.active.has(stream)) return;

    this.latest.set(stream, raw);
    this.dirty.add(stream);
  }

  flush() {
    if (this.dirty.size > 0) {
      const streams = [...this.dirty];
      this.dirty.clear();

      streams.forEach((stream) => {
        const raw = this.latest.get(stream);
        const set = this.listeners.get(stream);
        if (!raw || !set) return;
        set.forEach((listener) => {
          try {
            listener(raw);
          } catch (error) {
            console.error("Market stream listener failed:", error);
          }
        });
      });
    }

    // Drop a silent connection so the close handler reconnects it.
    if (this.socket && Date.now() - this.lastMessageAt > STALE_AFTER_MS) {
      const socket = this.socket;
      this.socket = null;
      socket.close();
      this.scheduleReconnect();
    }
  }

  scheduleControl() {
    if (this.controlTimer) return;
    if (this.pendingSubscribe.size === 0 && this.pendingUnsubscribe.size === 0) return;

    const wait = Math.max(20, this.lastControlAt + CONTROL_INTERVAL_MS - Date.now());
    this.controlTimer = setTimeout(() => {
      this.controlTimer = null;
      this.sendControl();
    }, wait);
  }

  sendControl() {
    // Not open yet: onopen will queue the full subscription list again.
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.lastControlAt = Date.now();
    if (this.pendingSubscribe.size > 0) {
      this.send("SUBSCRIBE", [...this.pendingSubscribe]);
      this.pendingSubscribe.clear();
    }
    if (this.pendingUnsubscribe.size > 0) {
      this.send("UNSUBSCRIBE", [...this.pendingUnsubscribe]);
      this.pendingUnsubscribe.clear();
    }
  }

  send(method, params) {
    this.requestId += 1;
    this.socket.send(JSON.stringify({ method, params, id: this.requestId }));
  }
}

// Kept on globalThis so every route shares one hub, including across dev hot reloads.
const hub = (globalThis.__binanceStreamHub ??= new BinanceStreamHub());

export function subscribeToStreams(streams, listener) {
  return hub.subscribe(streams, listener);
}
