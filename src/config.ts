import * as dotenv from "dotenv";

dotenv.config();

function assertIsDefined<T>(
    value: T | undefined | null,
    name: string
): asserts value is T {
    if (value === undefined || value === null) {
        throw new Error(`Environment variable ${name} is not defined`);
    }
}

// when they are called, they will have a value, or an exception will be thrown.
export const PORT = process.env.PORT!;
export const DB_URL = process.env.DB_URL!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

assertIsDefined(PORT, "PORT");
assertIsDefined(DB_URL, "DB_URL");
assertIsDefined(JWT_SECRET, "JWT_SECRET");
assertIsDefined(REFRESH_TOKEN_SECRET, "REFRESH_TOKEN_SECRET");
