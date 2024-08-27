const { hash } = require("bcrypt");
const User = require("../models/user.js");

exports.register = async function (req, res, next) {
    try {
        const { name, email, password } = req.body;

        // use schema to validate
        if (!name) {
            res.status(422).json({ message: "A name is required.", error: {} });
            return;
        }

        if (!email || !password) {
            res.status(422).json({
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

// export
