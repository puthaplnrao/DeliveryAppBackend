const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");

// Public Routes
router.post("/register", verifyToken, authController.register);
router.post("/login", verifyToken, authController.login);

module.exports = router;
