import { hash, compare } from "bcrypt";
import {
    createToken,
    createRefreshToken,
    validateRefreshToken,
} from "../utils/token.js";
import { User } from "../models/user.ts";
import type { NextFunction, Request, Response } from "express";
import type { LoginRequest, SignupRequest } from "../dto/authDtos.ts";

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const request: SignupRequest = req.body;

        // use schema to validate
        if (!request.name) {
            res.status(422).send({ message: "A name is required.", error: {} });
            return;
        }

        if (!request.email || !request.password) {
            res.status(422).send({
                message: "Email and password are required!",
                error: {},
            });
            return;
        }

        let existingUser = await User.findOne({ email: request.email });
        if (existingUser) {
            res.status(400).send({
                message: "An account exists with this email address.",
                error: {},
            });
            return;
        }

        const passwordHash = await hash(request.password, 10);
        const user = new User({
            name: request.name,
            email: request.email,
            passwordHash,
        });

        await user.validate();
        await user.save();
        console.log("User created.");

        const token = createToken(user._id.toString(), user.email);
        const refreshToken = createRefreshToken(
            user._id.toString(),
            user.email
        );
        res.status(200).send({ token, refreshToken });
        return;
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const request: LoginRequest = req.body;
        const user = await User.findOne({ email: request.email });

        if (!user) {
            res.status(400).send({
                message: "email or password incorrect.",
                error: {},
            });
            return;
        }

        const isPasswordValid = await compare(
            request.password,
            user.passwordHash
        );
        if (!isPasswordValid) {
            res.status(400).send({
                message: "email or password incorrect.",
                error: {},
            });
            return;
        }

        const token = createToken(user._id.toString(), user.email);
        const refreshToken = createRefreshToken(
            user._id.toString(),
            user.email
        );
        res.status(200).send({ token, refreshToken });
        return;
    } catch (error) {
        next(error);
    }
}

export async function refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const refreshToken: string = req.body;
        if (!refreshToken) {
            console.error("Refresh token not provided.");
            res.status(400).send({
                message: "Please provide a refresh token",
                errors: {},
            });
            return;
        }

        let { userId, email } = validateRefreshToken(refreshToken);
        const token = createToken(userId, email);
        const newRefreshToken = createRefreshToken(userId, email);
        // in a production application, we'd want to revoke the old token.
        // obviously, this is not a production app :)

        res.status(200).send({ token, newRefreshToken });
        return;
    } catch (error) {
        next(error);
    }
}
