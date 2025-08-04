const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const testController = require("../controllers/testController");

router.post("/querytest", testController.querytest);
router.get("/secure-data", verifyToken, (req, res) => {
  res.json({ message: "This is protected data.", user: req.user });
});

module.exports = router;
