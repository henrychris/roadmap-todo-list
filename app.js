require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const db = require("./db");
const { PORT } = require("./config.js");
const errorHandler = require("./middleware/errorHandler.js");

const indexRouter = require("./routes/index.js");
const authRouter = require("./routes/auth.js");
const todoRouter = require("./routes/todo.js");

const app = express();
app.use(logger("dev"));
app.use(express.json());

// Define routes before the 404 handler
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/todos", todoRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
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

// !: 28th Aug 2024
// - add unit tests
// - add rate limiting
// - implement refresh tokens
