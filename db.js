const mongoose = require("mongoose");

exports.connect = async function main() {
    const DB_URL = process.env.DB_URL;
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL);
    console.log(`Connected to mongoose on URL: ${DB_URL}`);
};
