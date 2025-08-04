const logger = require("../utils/logger");
const { parseStringPromise } = require("xml2js");

function requestLogger(req, res, next) {
  const chunks = [];
  let rawXml = "";
  const now = new Date();

  // Capture raw XML body if applicable
  if (req.is("application/xml") || req.is("text/xml")) {
    req.on("data", (chunk) => (rawXml += chunk));
  }

  // Intercept response
  const oldWrite = res.write;
  const oldEnd = res.end;
  const responseChunks = [];

  res.write = function (chunk, ...args) {
    responseChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    return oldWrite.apply(res, [chunk, ...args]);
  };

  res.end = function (chunk, ...args) {
    if (chunk) {
      responseChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const responseBody = Buffer.concat(responseChunks).toString("utf8");

    let logEntry = `\n------------ Logger Started ---------------\n`;
    logEntry += `${req.method} ${req.originalUrl}\n`;
    logEntry += `Time: ${now.toISOString()}\n`;
    logEntry += `Headers: ${JSON.stringify(req.headers)}\n`;

    if (Object.keys(req.query).length > 0) {
      logEntry += `Query: ${JSON.stringify(req.query)}\n`;
    }

    if (req.is("application/x-www-form-urlencoded")) {
      logEntry += `Form Data: ${JSON.stringify(req.body)}\n`;
    }

    if (req.is("application/json")) {
      logEntry += `JSON Body: ${JSON.stringify(req.body)}\n`;
    }

    if ((req.is("application/xml") || req.is("text/xml")) && rawXml) {
      parseStringPromise(rawXml)
        .then((parsedXml) => {
          logEntry += `XML Body: ${JSON.stringify(parsedXml)}\n`;
        })
        .catch((err) => {
          logEntry += `XML Parse Error: ${err.message}\n`;
        })
        .finally(() => {
          logEntry += `Status: ${res.statusCode}\n`;
          logEntry += `Response: ${responseBody}\n`;
          logEntry += `------------ Logger End -------------------\n`;
          logger.info(logEntry);
        });
    } else {
      logEntry += `Status: ${res.statusCode}\n`;
      logEntry += `Response: ${responseBody}\n`;
      logEntry += `------------ Logger End -------------------\n`;
      logger.info(logEntry);
    }

    return oldEnd.apply(res, [chunk, ...args]);
  };

  next();
}

module.exports = requestLogger;
