// Production-ready Redis Caching Layer for Codexa
// Utilizes Upstash REST API for zero-dependency cloud caching with memory fallback

class UpstashRedisCache {
  private cache = new Map<string, { value: string; expires: number }>();

  private getCredentials() {
    const url = process.env.REDIS_URL;
    const token = process.env.REDIS_TOKEN;
    if (url && token && (url.startsWith("http://") || url.startsWith("https://"))) {
      return { url, token };
    }
    return null;
  }

  async get(key: string): Promise<string | null> {
    const creds = this.getCredentials();
    if (creds) {
      try {
        const response = await fetch(creds.url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${creds.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["GET", key]),
        });
        if (response.ok) {
          const data = await response.json();
          return data.result;
        }
      } catch (err) {
        console.error("[Redis Cache Error] GET failed, falling back to local memory:", err);
      }
    }

    // Fallback to local memory cache
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, expireSeconds: number): Promise<void> {
    const creds = this.getCredentials();
    if (creds) {
      try {
        const response = await fetch(creds.url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${creds.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["SET", key, value, "EX", expireSeconds]),
        });
        if (response.ok) {
          return;
        }
      } catch (err) {
        console.error("[Redis Cache Error] SET failed, falling back to local memory:", err);
      }
    }

    // Fallback to local memory cache
    this.cache.set(key, {
      value,
      expires: Date.now() + expireSeconds * 1000,
    });
  }
}

export const redis = new UpstashRedisCache();
