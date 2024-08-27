require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const db = require("./db");
const errorHandler = require("./middleware/errorHandler.js");
const indexRouter = require("./routes/index.js");

const app = express();
app.use(logger("dev"));
app.use(express.json());

// Define routes before the 404 handler
app.use("/", indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT;
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
