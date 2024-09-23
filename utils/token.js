const jwt = require("jsonwebtoken");

exports.createToken = function (userId, email) {
    const token = jwt.sign(
        { id: userId, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return token;
};
