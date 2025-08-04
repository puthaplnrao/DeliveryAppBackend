const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

// Ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      (info) =>
        `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new transports.File({
      filename: path.join(
        logDir,
        `REQUEST_${new Date().toISOString().split("T")[0]}.log`
      ),
    }),
  ],
});

module.exports = logger;
