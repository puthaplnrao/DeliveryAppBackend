const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Token = require("../models/Token");
const { v4: uuidv4 } = require("uuid");
const { generateSecureToken } = require("../utils/generateSecureToken");
const sendResponse = require("../utils/sendResponse");
const errorCodes = require("../constants/errorCodes");

// Register a new client
router.post("/register", async (req, res) => {
  const { name, email, redirectUris = [], scopes = [] } = req.body;

  if (!name || !email) {
    return sendResponse(res, {
      status: 400,
      codeObj: {
        code: errorCodes.CLIENT_REGISTRATION_BAD_REQUEST.code,
        message: errorCodes.CLIENT_REGISTRATION_BAD_REQUEST.message,
        description: errorCodes.CLIENT_REGISTRATION_BAD_REQUEST.description,
      },
    });
  }

  const existing = await Client.findOne({ email });
  if (existing) {
    return sendResponse(res, {
      status: 409,
      codeObj: {
        code: errorCodes.CLIENT_REGISTRATION_DUPLICATE.code,
        message: errorCodes.CLIENT_REGISTRATION_DUPLICATE.message,
        description: errorCodes.CLIENT_REGISTRATION_DUPLICATE.description,
      },
    });
  }

  const clientId = uuidv4();
  const clientSecret = uuidv4();

  try {
    const client = new Client({
      clientId,
      clientSecret,
      name,
      email,
      redirectUris,
      scopes,
    });
    await client.save();

    return sendResponse(res, {
      status: 201,
      codeObj: {
        code: errorCodes.CLIENT_REGISTRATION_SUCCESS.code,
        message: errorCodes.CLIENT_REGISTRATION_SUCCESS.message,
        description: errorCodes.CLIENT_REGISTRATION_SUCCESS.description,
      },
      data: {
        clientId,
        clientSecret,
      },
    });
  } catch (err) {
    return sendResponse(res, {
      status: 500,
      codeObj: {
        code: errorCodes.CLIENT_REGISTRATION_FAILED.code,
        message: errorCodes.CLIENT_REGISTRATION_FAILED.message,
        description: errorCodes.CLIENT_REGISTRATION_FAILED.description,
      },
    });
  }
});

// Generate access + refresh tokens
router.post("/token", async (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  if (grant_type !== "client_credentials") {
    return sendResponse(res, {
      status: 400,
      codeObj: {
        code: errorCodes.TOKEN_INVALID_GRANT_TYPE.code,
        message: errorCodes.TOKEN_INVALID_GRANT_TYPE.message,
        description: errorCodes.TOKEN_INVALID_GRANT_TYPE.description,
      },
    });
  }

  const client = await Client.findOne({ clientId: client_id });
  if (!client || client.clientSecret !== client_secret) {
    return sendResponse(res, {
      status: 401,
      codeObj: {
        code: errorCodes.TOKEN_INVALID_CLIENT_CREDENTIALS.code,
        message: errorCodes.TOKEN_INVALID_CLIENT_CREDENTIALS.message,
        description: errorCodes.TOKEN_INVALID_CLIENT_CREDENTIALS.description,
      },
    });
  }

  // Generate access token (1 hour expiry)
  const {
    token: accessToken,
    expiresAt: accessExpiresAt,
    expiresIn: accessExpiresIn,
  } = generateSecureToken(client, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_SEC,
  }); // 1 hour in seconds

  // Generate refresh token (30 days expiry)
  const {
    token: refreshToken,
    expiresAt: refreshExpiresAt,
    expiresIn: refreshExpiresIn,
  } = generateSecureToken(client, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_SEC,
  }); // 30 days in seconds

  // Save tokens to DB
  await Token.create([
    {
      accessToken,
      clientId: client.clientId,
      userId: null,
      expiresAt: new Date(accessExpiresAt),
      type: "access_token",
    },
    {
      accessToken: refreshToken,
      clientId: client.clientId,
      userId: null,
      expiresAt: new Date(refreshExpiresAt),
      type: "refresh_token",
    },
  ]);

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: accessExpiresIn,
    refresh_token_expires_in: refreshExpiresIn,
  });
});

// Refresh access token using refresh_token
router.post("/token/refresh", async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return sendResponse(res, {
      status: 400,
      codeObj: {
        code: errorCodes.TOKEN_MISSING_REFRESH_TOKEN.code,
        message: errorCodes.TOKEN_MISSING_REFRESH_TOKEN.message,
        description: errorCodes.TOKEN_MISSING_REFRESH_TOKEN.description,
      },
    });
  }

  const storedRefreshToken = await Token.findOne({
    accessToken: refresh_token,
    type: "refresh_token",
  });

  if (!storedRefreshToken) {
    return sendResponse(res, {
      status: 401,
      codeObj: {
        code: errorCodes.TOKEN_INVALID.code,
        message: errorCodes.TOKEN_INVALID.message,
        description: errorCodes.TOKEN_INVALID.description,
      },
    });
  }

  if (storedRefreshToken.expiresAt < new Date()) {
    return sendResponse(res, {
      status: 401,
      codeObj: {
        code: errorCodes.TOKEN_EXPIRED.code,
        message: errorCodes.TOKEN_EXPIRED.message,
        description: errorCodes.TOKEN_EXPIRED.description,
      },
    });
  }

  const client = await Client.findOne({
    clientId: storedRefreshToken.clientId,
  });
  if (!client) {
    return sendResponse(res, {
      status: 404,
      codeObj: {
        code: errorCodes.TOKEN_CLIENT_NOT_FOUND.code,
        message: errorCodes.TOKEN_CLIENT_NOT_FOUND.message,
        description: errorCodes.TOKEN_CLIENT_NOT_FOUND.description,
      },
    });
  }

  // Generate new access token (1 hour expiry)
  const {
    token: newAccessToken,
    expiresAt: newAccessExpiresAt,
    expiresIn: newAccessExpiresIn,
  } = generateSecureToken(client, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_SEC,
  }); // 1 hour

  // Save new access token to DB
  await Token.create({
    accessToken: newAccessToken,
    clientId: client.clientId,
    userId: null,
    expiresAt: new Date(newAccessExpiresAt),
    type: "access_token",
  });

  res.json({
    access_token: newAccessToken,
    token_type: "Bearer",
    expires_in: newAccessExpiresIn,
  });
});

module.exports = router;
