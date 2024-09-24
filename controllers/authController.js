const { hash, compare } = require("bcrypt");
const {
    createToken,
    createRefreshToken,
    validateRefreshToken,
} = require("../utils/token.js");
const User = require("../models/user.js");

exports.register = async function (req, res, next) {
    try {
        const { name, email, password } = req.body;

        // use schema to validate
        if (!name) {
            res.status(422).send({ message: "A name is required.", error: {} });
            return;
        }

        if (!email || !password) {
            res.status(422).send({
                message: "Email and password are required!",
                error: {},
            });
            return;
        }

        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).send({
                message: "An account exists with this email address.",
                error: {},
            });
            return;
        }

        const passwordHash = await hash(password, 10);
        const user = new User({
            name,
            email,
            passwordHash,
        });

        await user.validate();
        await user.save();
        console.log("User created.");

        const token = createToken(user._id, user.email);
        const refreshToken = createRefreshToken(user._id, user.email);
        res.status(200).send({ token, refreshToken });
        return;
    } catch (error) {
        next(error);
    }
};

exports.login = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).send({
                message: "email or password incorrect.",
                error: {},
            });
            return;
        }

        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(400).send({
                message: "email or password incorrect.",
                error: {},
            });
            return;
        }

        const token = createToken(user._id, user.email);
        const refreshToken = createRefreshToken(user._id, user.email);
        res.status(200).send({ token, refreshToken });
        return;
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async function (req, res, next) {
    try {
        const { refreshToken } = req.body;
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

        res.status(200).send({ token });
        return;
    } catch (error) {
        next(error);
    }
};
