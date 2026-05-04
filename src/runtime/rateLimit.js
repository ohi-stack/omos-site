const rateMap = new Map();

function rateLimit({ limit = 100, windowMs = 60000 } = {}) {
  return (req, res, next) => {
    const key = req.apiKeyMeta?.name || req.ip;
    const now = Date.now();

    if (!rateMap.has(key)) {
      rateMap.set(key, []);
    }

    const timestamps = rateMap.get(key).filter(ts => now - ts < windowMs);

    if (timestamps.length >= limit) {
      return res.status(429).json({
        error: "rate_limit_exceeded",
        message: "Too many requests"
      });
    }

    timestamps.push(now);
    rateMap.set(key, timestamps);

    next();
  };
}

module.exports = { rateLimit };
