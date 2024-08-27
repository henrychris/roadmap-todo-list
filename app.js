require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const db = require("./db");
const PORT = process.env.PORT;

db.connect().catch((err) => console.log(err));

const app = express();
app.use(logger("dev"));
app.use(express.json());

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(PORT, function () {
    console.log(`Example app listening on http://localhost:${PORT}!`);
});
