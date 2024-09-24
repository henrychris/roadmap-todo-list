const express = require("express");
const jwtValidator = require("../middleware/jwtValidator.js");

const router = express.Router();

router.get("/", function (_req, res) {
    res.send("Hello!");
});

router.get("/test", jwtValidator, function (_req, res) {
    res.send("Test!");
});

module.exports = router;
