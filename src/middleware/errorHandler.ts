import type { NextFunction, Request, Response } from "express";
import { type ErrorWithStatus } from "../interfaces/errorWithStatus.ts";

export const errorHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get("env") === "development" ? err : {},
    });
};
