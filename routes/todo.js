const express = require("express");
const jwtValidator = require("../middleware/jwtValidator.js");
const todoController = require("../controllers/todoController.js");

const router = express.Router();
router.use(jwtValidator);

router.post("/", todoController.create);
router.get("/:id", todoController.getById);

module.exports = router;
