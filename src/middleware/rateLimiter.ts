import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false,
    message: {
        message: "Too many requests, please try again later.",
        errors: {},
    },
});
