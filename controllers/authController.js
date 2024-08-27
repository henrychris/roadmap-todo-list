const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
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

        const error = await user.validate();
        if (error) {
            console.error(error);
            res.status(422).send({ message: error, error: {} });
            return;
        }

        await user.save();
        console.log("User created.");
        res.send(user.dto);
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
            return res.status(401).send({
                message: "email or password incorrect.",
                error: {},
            });
        }

        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).send({
                message: "email or password incorrect.",
                error: {},
            });
        }
		
		// todo: place this in utils/
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).send({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};
