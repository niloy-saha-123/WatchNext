/**
 * @file tokenBlacklist.js
 * @path backend/utils/tokenBlacklist.js
 * @description Token blacklist keyed by token JTI for logout functionality.
 * Uses in-memory Set by default with timed cleanup. Optionally uses Redis if REDIS_URL is provided.
 */

let redis = null;
if (process.env.REDIS_URL) {
  try {
    // Optional dependency, fallback to memory if not installed
    // eslint-disable-next-line global-require
    const IORedis = require('ioredis');
    redis = new IORedis(process.env.REDIS_URL, {
      lazyConnect: true,
    });
    redis.on('error', (err) => {
      console.warn('Redis error, falling back to in-memory blacklist:', err.message);
      redis = null;
    });
  } catch (e) {
    console.warn('ioredis not installed; using in-memory blacklist');
  }
}

// In-memory Set to store blacklisted token JTIs
const blacklistedJtis = new Set();

/**
 * Add a token JTI to the blacklist
 * @param {string} jti - Token ID (JTI) to blacklist
 * @param {number} expiresIn - Time in milliseconds until token expires naturally
 */
const addToBlacklist = async (jti, expiresIn = 15 * 60 * 1000) => {
  if (!jti) return;
  if (redis) {
    try {
      // PX for milliseconds TTL
      await redis.set(`bl:${jti}`, '1', 'PX', expiresIn);
      return;
    } catch (e) {
      console.warn('Redis blacklist set failed; using memory fallback:', e.message);
    }
  }
  blacklistedJtis.add(jti);
  setTimeout(() => {
    blacklistedJtis.delete(jti);
  }, expiresIn);
};

/**
 * Check if a token JTI is blacklisted
 * @param {string} jti - Token ID to check
 * @returns {boolean} - True if blacklisted, false otherwise
 */
const isBlacklisted = async (jti) => {
  if (!jti) return false;
  if (redis) {
    try {
      const v = await redis.get(`bl:${jti}`);
      return Boolean(v);
    } catch (e) {
      // fall through to memory
    }
  }
  return blacklistedJtis.has(jti);
};

/**
 * Get memory blacklist size (for debugging/monitoring)
 * @returns {number} - Number of tokens currently blacklisted
 */
const getBlacklistSize = () => {
  return blacklistedJtis.size;
};

/**
 * Clear entire blacklist (for testing/debugging)
 * WARNING: Only use in development
 */
const clearBlacklist = () => {
  blacklistedJtis.clear();
};

module.exports = {
  addToBlacklist,
  isBlacklisted,
  getBlacklistSize,
  clearBlacklist
};

