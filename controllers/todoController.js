const User = require("../models/user.js");

exports.create = async function (req, res, next) {
    res.status(200).send("todo create");
};

exports.getById = async function (req, res, next) {
	res.status(200).send("todo get");
};
