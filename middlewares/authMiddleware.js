const errorCodes = require("../constants/errorCodes");
const {
  generateSecureToken,
  cacheverifyToken,
} = require("../utils/generateSecureToken");
const sendResponse = require("../utils/sendResponse");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return sendResponse(res, {
      status: 401,
      codeObj: {
        code: errorCodes.TOKEN_UNAUTHORIZED.code,
        message: errorCodes.TOKEN_UNAUTHORIZED.message,
        description: errorCodes.TOKEN_UNAUTHORIZED.description,
      },
    });

  const token = authHeader.split(" ")[1];
  const tokenValidation = cacheverifyToken(token);
  if (!tokenValidation.valid) {
    return sendResponse(res, {
      status: 403,
      codeObj: {
        code: errorCodes.TOKEN_INVALID.code,
        message: errorCodes.TOKEN_INVALID.message,
        description: tokenValidation.message,
      },
    });
  }
  next();
};
