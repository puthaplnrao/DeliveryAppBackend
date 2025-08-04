const crypto = require("crypto");

// In-memory cache (optional, for quick reuse - can be removed if you always store in DB)
const tokenCache = new Map();

/**
 * Generate a secure token string with expiry info.
 * @param {object} client - Client object with clientId and clientSecret
 * @param {object} options - Optional { expiresIn } in seconds
 * @returns {object} { token, expiresIn, expiresAt }
 */
function generateSecureToken(client, options = {}) {
  const now = Date.now();
  const defaultExpirySec = parseInt(
    process.env.ACCESS_TOKEN_EXPIRATION_SEC,
    10
  ); // default 1 hour
  const expirySec = options.expiresIn || defaultExpirySec;

  // Generate some randomness + client data + timestamp
  const raw = `${client.clientId}:${client.clientSecret}:${now}:${crypto
    .randomBytes(16)
    .toString("hex")}`;

  // Create token with HMAC SHA256
  const token = crypto
    .createHmac("sha256", process.env.ENC_SECRET || "default_secret")
    .update(raw)
    .digest("hex");

  const expiresAt = now + expirySec * 1000; // timestamp in ms

  // Optional cache storage
  const cacheKey = `${client.clientId}_${expirySec}`;
  tokenCache.set(cacheKey, { token, expiresAt });
  tokenCache.set(token, { clientId: client.clientId, expiresAt });

  return {
    token,
    expiresIn: expirySec,
    expiresAt,
  };
}

/**
 * Verify token from cache (optional, you can verify from DB instead)
 * @param {string} token
 * @returns {object} { valid, clientId?, message? }
 */
function cacheverifyToken(token) {
  const cached = tokenCache.get(token);
  if (!cached) {
    return { valid: false, message: "Invalid token" };
  }
  const now = Date.now();
  if (now > cached.expiresAt) {
    tokenCache.delete(token);
    return { valid: false, message: "Token expired" };
  }
  return { valid: true, clientId: cached.clientId };
}

module.exports = { generateSecureToken, cacheverifyToken };
