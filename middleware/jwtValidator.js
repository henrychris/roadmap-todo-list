const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

function jwtValidator(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach user data to the request object
            req.isAuthorised = true;
            req.userId = decoded.id;
            req.email = decoded.email;

            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401).json({
                message: "Unauthorized",
                error: {},
            });
        }
    } else {
        console.error("Authorization header missing or malformed");
        res.status(401).json({
            message: "Unauthorized",
            error: {},
        });
    }
}

module.exports = jwtValidator;
