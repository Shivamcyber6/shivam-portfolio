// A simple fixed-window rate limiter kept in memory. On Vercel each server instance has its own
// memory, so this is a guard against bursts, not a hard global limit. For a strict limit,
// swap this for Upstash Redis.

const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= limit) return { ok: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  entry.count++;
  return { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}
