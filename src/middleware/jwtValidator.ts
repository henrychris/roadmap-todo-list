import jwt from "jsonwebtoken";
import { type JwtPayload } from "../interfaces/jwtPayload.ts";
import { JWT_SECRET } from "../config.ts";
import type { Request, Response, NextFunction } from "express";

export const jwtValidator = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            // Attach user data to the request object
            req.isAuthorised = true;
            req.userId = decoded.id;
            req.email = decoded.email;

            next();
        } catch (error) {
            const err = error as Error;
            console.error("Token verification failed:", err.message);
            res.status(401).json({
                message: "Unauthorized",
                error: {},
            });
        }
    } else {
        console.error("Authorization header missing or malformed");
        res.status(401).json({
            message: "Unauthorized",
            error: {},
        });
    }
};
