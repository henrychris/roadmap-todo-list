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
        const { pageNo, pageSize } = getPaginationOptions(req.query);
        const sort = getSortOption(req.query);
        const filters = getFilters(req.userId, req.query);

        // calculate the total number of todos for this user
        const totalCount = await Todo.countDocuments({ user: req.userId });

        // todo: finish filtering & test sorting
        const todos = await Todo.find({
            ...filters,
        })
            .populate("user")
            .limit(pageSize)
            .skip((pageNo - 1) * pageSize)
            .sort(sort);

        res.status(200).send({
            data: todos.map((x) => x.dto),
            page: pageNo,
            limit: pageSize,
            total: totalCount,
        });
    } catch (error) {
        next(error);
    }
};

function getPaginationOptions(query) {
    // paging setup
    const pageOptions = {
        pageNo: parseInt(query.pageNo, 10) || 1,
        pageSize: parseInt(query.pageSize, 10) || 10,
    };

    // ensure non-negative page number and page size
    pageOptions.pageNo = Math.max(pageOptions.pageNo, 1);
    pageOptions.pageSize = Math.max(pageOptions.pageSize, 1);

    return pageOptions;
}

function getSortOption(query) {
    const sortOptions = {
        createdAsc: { createdAt: 1 },
        createdDesc: { createdAt: -1 },
        titleAsc: { title: 1 },
        titleDesc: { title: -1 },
    };

    const sortBy = query.sort || "createdDesc";
    const sort = sortOptions[sortBy] || sortOptions.createdDesc;
    console.log(`sort: ${sortBy}`);

    return sort;
}

function getFilters(userId, query) {
    const filters = { user: userId };

    if (query.createdFrom || query.createdTo) {
        filters.createdAt = {};
        if (query.createdFrom) {
            filters.createdAt.$gte = new Date(query.createdFrom);
        }
        if (query.createdTo) {
            filters.createdAt.$lte = new Date(query.createdTo);
        }
    }

    if (query.title) {
        filters.title = { $regex: query.title, $options: "i" }; // Case-insensitive filtering
    }

    if (query.description) {
        filters.description = { $regex: query.description, $options: "i" }; // Case-insensitive filtering
    }

    return filters;
}

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

        todo.title = title || todo.title;
        todo.description = description || todo.description;

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
