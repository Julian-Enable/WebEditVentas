type RateLimitStore = Map<string, { count: number; expiresAt: number }>;

const store: RateLimitStore = new Map();

interface RateLimitConfig {
    limit: number;      // Number of requests
    windowMs: number;   // Window size in milliseconds
}

/**
 * Basic in-memory rate limiter. 
 * Note: This works for single-instance deployments. For serverless/distributed, 
 * you would need a shared store like Redis.
 */
export function rateLimit(ip: string, config: RateLimitConfig = { limit: 5, windowMs: 15 * 60 * 1000 }): {
    success: boolean;
    remaining: number;
    resetAt: number;
} {
    const now = Date.now();
    const record = store.get(ip);

    // Clean up expired entry
    if (record && now > record.expiresAt) {
        store.delete(ip);
    }

    const currentRecord = store.get(ip) || { count: 0, expiresAt: now + config.windowMs };

    if (currentRecord.count >= config.limit) {
        return {
            success: false,
            remaining: 0,
            resetAt: currentRecord.expiresAt
        };
    }

    currentRecord.count += 1;
    store.set(ip, currentRecord);

    // Cleanup old entries periodically (could be optimized)
    if (store.size > 10000) {
        for (const [key, val] of store.entries()) {
            if (now > val.expiresAt) {
                store.delete(key);
            }
        }
    }

    return {
        success: true,
        remaining: config.limit - currentRecord.count,
        resetAt: currentRecord.expiresAt
    };
}
