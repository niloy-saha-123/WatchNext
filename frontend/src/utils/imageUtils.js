/**
 * @file imageUtils.js
 * @description Utility functions for image handling and formatting
 */

/**
 * Get TMDB image URL
 * @param {string} path - Image path from TMDB
 * @param {string} size - Image size (e.g., 'w200', 'w342', 'w500', 'original')
 * @returns {string|null} - Full image URL or null if path is invalid
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  // Handle absolute URLs (though TMDB paths should be relative)
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Get poster image URL (default size for posters)
 */
export const getPosterUrl = (path) => getImageUrl(path, 'w342');

/**
 * Get backdrop image URL (default size for backdrops)
 */
export const getBackdropUrl = (path) => getImageUrl(path, 'w1280');

/**
 * Get profile image URL (default size for profiles)
 */
export const getProfileUrl = (path) => getImageUrl(path, 'w185');

