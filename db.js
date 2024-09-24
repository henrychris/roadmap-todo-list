const mongoose = require("mongoose");
const { DB_URL } = require("./config.js");

exports.connect = async function main() {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL);
    console.log(`Connected to mongoose on URL: ${DB_URL}`);
};
