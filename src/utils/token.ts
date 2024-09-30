import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config.ts";
import { type JwtPayload } from "../interfaces/jwtPayload.ts";

export function createToken(userId: string, email: string) {
    return jwt.sign({ id: userId, email: email }, JWT_SECRET, {
        expiresIn: "1h",
    });
}

export function createRefreshToken(userId: string, email: string) {
    return jwt.sign({ id: userId, email: email }, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}

export function validateRefreshToken(refreshToken: string) {
    try {
        const decoded = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET
        ) as JwtPayload;

        console.log(`Refresh token valid for user id: ${decoded.id}`);
        return { userId: decoded.id, email: decoded.email };
    } catch (error) {
        let err = error as Error;
        console.error("Invalid refresh token", err.message);
        throw new Error("Invalid refresh token");
    }
}
