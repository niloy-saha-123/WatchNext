/**
 * @file cookies.js
 * @description Helpers for setting auth and CSRF cookies consistently
 */

const crypto = require('crypto');
const { config } = require('../config/config');

const getBaseCookieOptions = () => {
  const isProd = config.nodeEnv === 'production';
  const sameSite = isProd ? 'none' : 'lax';
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: '/',
  };

  // Optionally scope cookie domain in production via env
  if (process.env.COOKIE_DOMAIN) {
    base.domain = process.env.COOKIE_DOMAIN;
  }
  return base;
};

const setAuthCookies = (res, { accessToken, refreshToken }, opts = {}) => {
  const base = getBaseCookieOptions();

  res.cookie('accessToken', accessToken, {
    ...base,
    maxAge: typeof opts.accessMaxAgeMs === 'number' ? opts.accessMaxAgeMs : parseDurationMs(config.jwt.accessExpiresIn || '15m'),
  });

  res.cookie('refreshToken', refreshToken, {
    ...base,
    maxAge: typeof opts.refreshMaxAgeMs === 'number' ? opts.refreshMaxAgeMs : parseDurationMs(config.jwt.refreshExpiresIn || '7d'),
  });
};

// Non-HttpOnly CSRF cookie for double-submit pattern
const setCsrfCookie = (res) => {
  const isProd = config.nodeEnv === 'production';
  const token = crypto.randomBytes(32).toString('hex');
  const options = {
    httpOnly: false, // must be readable by JS
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }
  res.cookie('XSRF-TOKEN', token, options);
  return token;
};

// Simple duration parser for forms like '15m', '7d'
function parseDurationMs(input) {
  if (typeof input === 'number') return input;
  if (typeof input !== 'string') return 0;
  const match = input.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 'ms': return value;
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}

module.exports = {
  setAuthCookies,
  setCsrfCookie,
  getBaseCookieOptions,
};


