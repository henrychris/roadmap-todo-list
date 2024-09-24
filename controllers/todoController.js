const User = require("../models/user.js");
const Todo = require("../models/todo.js");

exports.create = async function (req, res, next) {
    try {
        res.status(200).send("todo create");
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
