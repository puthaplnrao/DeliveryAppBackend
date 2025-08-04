const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  accessToken: String,
  userId: String,
  clientId: String,
  expiresAt: Date,
  type: String, // 'access_token' or 'refresh_token'
});

module.exports = mongoose.model("Token", tokenSchema);
