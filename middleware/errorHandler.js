module.exports = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get("env") === "development" ? err : {},
    });
};
