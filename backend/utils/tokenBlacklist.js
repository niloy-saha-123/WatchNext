/**
 * @file tokenBlacklist.js
 * @path backend/utils/tokenBlacklist.js
 * @description Simple in-memory token blacklist for logout functionality.
 * NOTE: This is a project-level implementation. For production, use Redis or database.
 */

// In-memory Set to store blacklisted tokens
const blacklistedTokens = new Set();

/**
 * Add a token to the blacklist
 * @param {string} token - JWT token to blacklist
 * @param {number} expiresIn - Time in milliseconds until token expires naturally
 */
const addToBlacklist = (token, expiresIn = 15 * 60 * 1000) => {
  if (!token) return;
  
  blacklistedTokens.add(token);
  
  // Auto-remove from blacklist after expiry (cleanup)
  // No need to keep expired tokens in memory
  setTimeout(() => {
    blacklistedTokens.delete(token);
  }, expiresIn);
};

/**
 * Check if a token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if blacklisted, false otherwise
 */
const isBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

/**
 * Get blacklist size (for debugging/monitoring)
 * @returns {number} - Number of tokens currently blacklisted
 */
const getBlacklistSize = () => {
  return blacklistedTokens.size;
};

/**
 * Clear entire blacklist (for testing/debugging)
 * WARNING: Only use in development
 */
const clearBlacklist = () => {
  blacklistedTokens.clear();
};

module.exports = {
  addToBlacklist,
  isBlacklisted,
  getBlacklistSize,
  clearBlacklist
};

