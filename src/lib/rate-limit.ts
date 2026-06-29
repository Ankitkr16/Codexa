import { headers } from "next/headers";

class SimpleRateLimiter {
  private tracker = new Map<string, { count: number; resetTime: number }>();

  async check(ip: string, limitCount: number, windowMs: number): Promise<{ success: boolean; limit: number; remaining: number }> {
    const now = Date.now();
    const entry = this.tracker.get(ip);

    if (!entry) {
      this.tracker.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { success: true, limit: limitCount, remaining: limitCount - 1 };
    }

    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
      return { success: true, limit: limitCount, remaining: limitCount - 1 };
    }

    entry.count++;
    const remaining = Math.max(0, limitCount - entry.count);

    if (entry.count > limitCount) {
      return { success: false, limit: limitCount, remaining };
    }

    return { success: true, limit: limitCount, remaining };
  }
}

const limiter = new SimpleRateLimiter();

export async function rateLimit(limitCount: number = 60, windowMs: number = 60 * 1000) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";
  
  const res = await limiter.check(ip, limitCount, windowMs);
  if (!res.success) {
    throw new Error("Too many requests. Please try again later.");
  }
}
