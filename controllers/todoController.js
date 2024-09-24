const User = require("../models/user.js");
const Todo = require("../models/todo.js");

exports.create = async function (req, res, next) {
    try {
        const { title, description } = req.body;

        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(401).send({
                message: "user not found.",
                error: {},
            });
        }

        const todo = new Todo({
            title: title,
            description: description,
            userId: req.userId,
        });

        await todo.validate();
        await todo.save();

        console.log("Todo created.");
        res.status(200).send(todo.dto);
    } catch (error) {
        next(error);
    }
};

exports.getById = async function (req, res, next) {
    try {
        res.status(200).send("todo get");
    } catch (error) {
        next(error);
    }
};
