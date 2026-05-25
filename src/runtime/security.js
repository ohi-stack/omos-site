function parseAllowedOrigins() {
  return (process.env.OMOS_ALLOWED_ORIGINS || "https://omos.onegodian.com,https://onegodian.org,https://onegodian.com,https://quantumohi.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("X-OMOS-Runtime", "node-authority");
  next();
}

function corsGuard(req, res, next) {
  const allowedOrigins = parseAllowedOrigins();
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-OMOS-Key");
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      error: "origin_not_allowed",
      message: "The request origin is not allowed for this OMOS runtime."
    });
  }

  next();
}

function requestId(req, res, next) {
  const inbound = req.headers["x-request-id"];
  const safeInbound = typeof inbound === "string" && /^[a-zA-Z0-9._:-]{8,120}$/.test(inbound)
    ? inbound
    : null;
  req.requestId = safeInbound || `omos_req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  res.setHeader("X-Request-ID", req.requestId);
  next();
}

function notFound(req, res) {
  res.status(404).json({
    error: "not_found",
    message: "The requested OMOS route does not exist.",
    requestId: req.requestId || null
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.status || error.statusCode || 500;
  const publicMessage = status >= 500 ? "Internal server error" : error.message;

  res.status(status).json({
    error: status >= 500 ? "internal_error" : "request_error",
    message: publicMessage,
    requestId: req.requestId || null
  });
}

module.exports = {
  corsGuard,
  errorHandler,
  notFound,
  parseAllowedOrigins,
  requestId,
  securityHeaders
};
