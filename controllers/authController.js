const { hash } = require("bcrypt");
const User = require("../models/user.js");

exports.register = async function (req, res, next) {
    const { name, email, password } = req.body;

    // use schema to validate
    if (!name) {
        res.status(422).json({ message: "A name is required." });
        return;
    }

    if (!email || !password) {
        res.status(422).json({ message: "Email and password are required!" });
        return;
    }

    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(400).send({
            message: "An account exists with this email address.",
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
        res.status(422).send({ message: error });
        return;
    }

    console.log("Validation successful.");
    await user.save();
    console.log("User created.");
    res.send(user.dto);
    return;
};
