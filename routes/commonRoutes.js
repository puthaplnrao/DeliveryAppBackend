const express = require("express");
const sendResponse = require("../utils/sendResponse");
const errorCodes = require("../constants/errorCodes");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

router.post("/api/querytest", (req, res) => {
  return sendResponse(res, {
    status: 200,
    codeObj: {
      code: errorCodes.GENERIC_SUCCESS.code,
      message: errorCodes.GENERIC_SUCCESS.message,
      description: errorCodes.GENERIC_SUCCESS.description,
    },
    data: {
      orders: [
        { product: "Widget A", quantity: 2, price: 19.99 },
        { product: "Widget B", quantity: 1, price: 9.99 },
        { product: "Widget C", quantity: 3, price: 5.99 },
      ],
    },
  });
});

module.exports = router;
