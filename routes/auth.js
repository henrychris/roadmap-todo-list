const express = require("express");

const authController = require("../controllers/authController.js");
const limiter = require("../middleware/rateLimiter.js");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", limiter, authController.login);
router.post("/refresh", authController.refreshToken);

module.exports = router;
