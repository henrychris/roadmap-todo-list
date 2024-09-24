const User = require("../models/user.js");
const Todo = require("../models/todo.js");

exports.create = async function (req, res, next) {
    try {
        const { title, description } = req.body;

        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).send({
                message: "user not found.",
                error: {},
            });
        }

        const todo = new Todo({
            title: title,
            description: description,
            user: req.userId,
        });

        await todo.save();
        console.log("Todo created.");
        res.status(200).send(todo.dto);
    } catch (error) {
        next(error);
    }
};

exports.getById = async function (req, res, next) {
    try {
        const id = req.params.id;
        const todo = await Todo.findOne({
            _id: id,
            user: req.userId,
        }).populate("user");

        if (!todo) {
            return res.status(404).send({
                message: "todo not found.",
                error: {},
            });
        }

        res.status(200).send(todo.dto);
    } catch (error) {
        next(error);
    }
};

exports.getAll = async function (req, res, next) {
    try {
        const pageOptions = {
            pageNo: parseInt(req.query.pageNo, 10) || 1,
            pageSize: parseInt(req.query.pageSize, 10) || 10,
        };

        // ensure non-negative page number and page size
        pageOptions.pageNo = Math.max(pageOptions.pageNo, 1);
        pageOptions.pageSize = Math.max(pageOptions.pageSize, 1);

        // calculate the total number of todos for this user
        const totalCount = await Todo.countDocuments({ user: req.userId });

        const todos = await Todo.find({
            user: req.userId,
        })
            .populate("user")
            .limit(pageOptions.pageSize)
            .skip((pageOptions.pageNo - 1) * pageOptions.pageSize)
            .sort({ createdAt: -1 });

        res.status(200).send({
            data: todos.map((x) => x.dto),
            page: pageOptions.pageNo,
            limit: pageOptions.pageSize,
            total: totalCount,
        });
    } catch (error) {
        next(error);
    }
};

exports.update = async function (req, res, next) {
    try {
        const id = req.params.id;
        const { title, description } = req.body;

        const todo = await Todo.findOne({
            _id: id,
        }).populate("user");

        if (!todo) {
            return res.status(404).send({
                message: "todo not found.",
                error: {},
            });
        }

        if (todo.user._id.toString() !== req.userId) {
            return res.status(403).send({
                message: "Unauthorised.",
                error: {},
            });
        }

        todo.title = title ?? todo.title;
        todo.description = description ?? todo.description;

        await todo.save();
        res.status(200).send(todo.dto);
    } catch (error) {
        next(error);
    }
};

exports.delete = async function (req, res, next) {
    try {
        const id = req.params.id;
        const toDo = await Todo.findOne({
            _id: id,
            user: req.userId,
        }).populate("user");

        if (!toDo) {
            return res.status(404).send({
                message: "todo not found.",
                error: {},
            });
        }

        await toDo.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
