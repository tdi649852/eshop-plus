/**
 * Simple in-memory rate limiting middleware
 * For production, use Redis-based rate limiting (e.g., express-rate-limit with Redis store)
 */

const rateLimit = {};

function rateLimiter(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    max = 60, // 60 requests per minute
    keyGenerator = (req) => req.ip,
    message = 'Too many requests, please try again later.',
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!rateLimit[key]) {
      rateLimit[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    const record = rateLimit[key];

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        error: true,
        message,
      });
    }

    record.count++;
    next();
  };
}

// Predefined rate limiters
const authRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many authentication attempts, please try again later.',
});

const apiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.',
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter,
};
