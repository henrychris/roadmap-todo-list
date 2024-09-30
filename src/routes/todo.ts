import express from "express";
import { jwtValidator } from "../middleware/jwtValidator.ts";
import * as todoController from "../controllers/todoController.ts";

const router = express.Router();
router.use(jwtValidator);

router.post("/", todoController.createTodo);
router.get("/", todoController.getAllTodos);
router.get("/:id", todoController.getTodoById);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

export default router;
