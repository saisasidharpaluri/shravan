const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const entries = new Map<string, { startedAt: number; count: number }>();

export function checkSpeechRateLimit(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwardedFor || request.headers.get('x-real-ip') || 'local';
  const now = Date.now();
  if (entries.size > 1000) {
    for (const [key, value] of entries) if (now - value.startedAt > WINDOW_MS) entries.delete(key);
  }
  const current = entries.get(address);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    entries.set(address, { startedAt: now, count: 1 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - current.startedAt)) / 1000) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
