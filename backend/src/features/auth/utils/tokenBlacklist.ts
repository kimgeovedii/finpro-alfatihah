import redis from "../../../config/redis";

const BLACKLIST_PREFIX = "bl:";

/**
 * Blacklist a token in Redis with automatic expiry.
 * @param token - JWT token to blacklist
 * @param expiresInSeconds - TTL in seconds (default: 7 days for refresh tokens)
 */
export async function blacklistToken(token: string, expiresInSeconds = 7 * 24 * 60 * 60): Promise<void> {
  await redis.set(`${BLACKLIST_PREFIX}${token}`, "1", "EX", expiresInSeconds);
}

/**
 * Check if a token has been blacklisted.
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await redis.get(`${BLACKLIST_PREFIX}${token}`);
  return result !== null;
}
