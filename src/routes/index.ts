import express from "express";
import type { Request, Response } from "express";
import { jwtValidator } from "../middleware/jwtValidator.ts";

const router = express.Router();

router.get("/", function (_req, res) {
    res.send("Hello!");
});

router.get("/test", jwtValidator, function (req: Request, res: Response) {
    if (req.isAuthorised) {
        res.send(`User ID: ${req.userId}, Email: ${req.email}`);
    } else {
        res.status(401).send("Unauthorized");
    }
});

export default router;
