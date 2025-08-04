module.exports = {
  REGISTRATION_SUCCESS: {
    code: 100,
    message: "SUCCESS",
    description: "Registered successfully",
  },
  EMAIL_ALREADY_EXISTS: {
    code: 101,
    message: "EMAIL_ALREADY_EXISTS",
    description: "Email already exists",
  },
  REGISTRATION_FAILED: {
    code: 102,
    message: "FAILED",
    description: "Registration failed due to an unknown error",
  },
  REGISTRATION_BAD_REQUEST: {
    code: 103,
    message: "BAD_REQUEST",
    description: "The request is invalid or cannot be processed",
  },
  LOGIN_SUCCESS: {
    code: 200,
    message: "SUCCESS",
    description: "Logged in successfully",
    token: null,
  },
  LOGIN_INVALID_CREDENTIALS: {
    code: 201,
    message: "INVALID_CREDENTIALS",
    description: "Invalid email or password",
  },
  LOGIN_BAD_REQUEST: {
    code: 202,
    message: "BAD_REQUEST",
    description: "The request is invalid or cannot be processed",
  },
  LOGIN_INTERNAL_SERVER_ERROR: {
    code: 203,
    message: "INTERNAL_SERVER_ERROR",
    description: "An unexpected error occurred",
  },
  TOKEN_SUCCESS: {
    code: 300,
    message: "TOKEN_SUCCESS",
    description: "Token generated successfully",
  },
  TOKEN_INVALID_GRANT_TYPE: {
    code: 301,
    message: "INVALID_GRANT_TYPE",
    description: "The grant type is not supported or invalid",
  },
  TOKEN_INVALID_CLIENT_CREDENTIALS: {
    code: 302,
    message: "INVALID_CLIENT_CREDENTIALS",
    description: "The provided client credentials are invalid",
  },
  TOKEN_UNAUTHORIZED: {
    code: 303,
    message: "UNAUTHORIZED",
    description: "No token provided",
  },
  TOKEN_INVALID: {
    code: 305,
    message: "INVALID_TOKEN",
    description: "The provided token is invalid",
  },
  TOKEN_MISSING_REFRESH_TOKEN: {
    code: 306,
    message: "MISSING_REFRESH_TOKEN",
    description: "Refresh token is missing",
  },
  TOKEN_EXPIRED: {
    code: 307,
    message: "TOKEN_EXPIRED",
    description: "The provided token has expired",
  },
  TOKEN_CLIENT_NOT_FOUND: {
    code: 308,
    message: "CLIENT_NOT_FOUND",
    description: "Client not found for the provided credentials",
  },
  CLIENT_REGISTRATION_SUCCESS: {
    code: 400,
    message: "CLIENT_REGISTRATION_SUCCESS",
    description: "Client registered successfully",
  },
  CLIENT_REGISTRATION_BAD_REQUEST: {
    code: 401,
    message: "CLIENT_REGISTRATION_BAD_REQUEST",
    description: "Please provide both name and email for client registration.",
  },
  CLIENT_REGISTRATION_DUPLICATE: {
    code: 402,
    message: "CLIENT_REGISTRATION_DUPLICATE",
    description: "Client with this email already exists",
  },
  CLIENT_REGISTRATION_FAILED: {
    code: 403,
    message: "CLIENT_REGISTRATION_FAILED",
    description: "Client registration failed due to an unknown error",
  },
  GENERIC_SUCCESS: {
    code: 200,
    message: "SUCCESS",
    description: "Operation completed successfully",
  },
};
