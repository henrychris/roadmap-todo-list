import { PORT } from "./config.js";

import express from "express";
import * as db from "./db";

import logger from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import todoRouter from "./routes/todo.js";

const app = express();
app.use(logger("dev"));
app.use(express.json());

// Define routes before the 404 handler
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/todos", todoRouter);

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error("Not Found");
    // err.status = 404;
    next(err);
});

// Error handler middleware
app.use(errorHandler);

db.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    });
