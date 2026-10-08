import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BINANCE_API_URL = process.env.BINANCE_API_URL || "https://api.binance.com";
const UPSTREAM_TIMEOUT_MS = 8000;
const MAX_CACHE_ENTRIES = 500;

// Only the public market-data endpoints the app uses, with how long (ms) a response may be reused.
const ENDPOINTS = {
  "ticker/price": { ttl: 1000, params: ["symbol", "symbols"] },
  "ticker/24hr": { ttl: 2000, params: ["symbol", "symbols"] },
  depth: { ttl: 500, params: ["symbol", "limit"] },
  klines: { ttl: 2000, params: ["symbol", "interval", "limit", "startTime", "endTime"] },
};

// Kept on globalThis so the cache survives dev hot reloads.
const cache = (globalThis.__binanceRestCache ??= new Map());
const inFlight = (globalThis.__binanceRestInFlight ??= new Map());

function buildQuery(searchParams, allowedParams) {
  const query = new URLSearchParams();
  allowedParams.forEach((name) => {
    const value = searchParams.get(name);
    if (value !== null) query.set(name, value);
  });
  return query.toString();
}

function remember(key, entry) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const now = Date.now();
    cache.forEach((cached, cachedKey) => {
      if (cached.expires <= now) cache.delete(cachedKey);
    });
    // Still full of live entries: drop the oldest one.
    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
  }
  cache.set(key, entry);
}

async function fetchUpstream(key, url, ttl) {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  const entry = { status: response.status, body: await response.text() };
  if (response.ok) remember(key, { ...entry, expires: Date.now() + ttl });
  return entry;
}

function respond({ status, body }, cacheStatus) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Cache": cacheStatus,
    },
  });
}

export async function GET(request, { params }) {
  const { path } = await params;
  const endpoint = path.join("/");
  const config = ENDPOINTS[endpoint];

  if (!config) {
    return NextResponse.json({ error: "Endpoint not allowed" }, { status: 404 });
  }

  const query = buildQuery(request.nextUrl.searchParams, config.params);
  const key = `${endpoint}?${query}`;

  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return respond(cached, "HIT");

  try {
    // Concurrent requests for the same data share one upstream call.
    let pending = inFlight.get(key);
    if (!pending) {
      pending = fetchUpstream(key, `${BINANCE_API_URL}/api/v3/${key}`, config.ttl).finally(() =>
        inFlight.delete(key)
      );
      inFlight.set(key, pending);
    }
    return respond(await pending, "MISS");
  } catch (error) {
    console.error(`Binance request failed for ${key}:`, error);
    return NextResponse.json({ error: "Market data unavailable" }, { status: 502 });
  }
}
