const express = require("express");

const router = express.Router();

router.get("/", function (_req, res) {
    res.send("Hello!");
});

module.exports = router;
