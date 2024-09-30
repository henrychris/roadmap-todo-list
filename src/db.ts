import mongoose from "mongoose";
import { DB_URL } from "./config.ts";

export async function connect() {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL);
    console.log(`Connected to mongoose on URL: ${DB_URL}`);
}
