const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require("../config.js");

exports.createToken = function (userId, email) {
    const token = jwt.sign({ id: userId, email: email }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};

exports.createRefreshToken = function (userId, email) {
    const token = jwt.sign({ id: userId, email: email }, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

exports.validateRefreshToken = function (refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        console.log(`Refresh token valid for user id: ${decoded.id}`);
        return { userId: decoded.id, email: decoded.email };
    } catch (error) {
        console.error("Invalid refresh token", error.message);
        throw new Error("Invalid refresh token");
    }
};
