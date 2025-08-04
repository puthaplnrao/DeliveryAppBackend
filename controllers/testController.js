const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("../utils/encryptor");
const Client = require("../models/Client");
const Token = require("../models/Token");

exports.querytest = (req, res) => {
  const data = {
    orders: [
      { product: "Widget A", quantity: 2, price: 19.99 },
      { product: "Widget B", quantity: 1, price: 9.99 },
      { product: "Widget C", quantity: 3, price: 5.99 },
    ],
  };

  res.status(200).json(data);
};
