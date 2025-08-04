// tokenCache.js (for Redis alternative)
const redis = require("redis");
const client = redis.createClient();

module.exports = client;
