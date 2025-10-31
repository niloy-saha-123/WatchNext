/**
 * @file csrf.js
 * @description Minimal double-submit CSRF protection middleware.
 * Requires frontend to send header 'x-csrf-token' matching 'XSRF-TOKEN' cookie for write requests.
 */

const shouldCheck = (req) => {
  const method = (req.method || 'GET').toUpperCase();
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
};

const csrfProtect = (req, res, next) => {
  if (!shouldCheck(req)) return next();
  // Read token from cookie and header
  const cookieToken = req.cookies['XSRF-TOKEN'];
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token',
    });
  }
  return next();
};

module.exports = {
  csrfProtect,
};


