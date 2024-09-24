const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

exports.createToken = function (userId, email) {
    const token = jwt.sign({ id: userId, email: email }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};
